package ua.com.mescherskiy.mediahosting.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import ua.com.mescherskiy.mediahosting.aws.Bucket;
import ua.com.mescherskiy.mediahosting.aws.FileStore;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.repo.PhotoRepository;
import ua.com.mescherskiy.mediahosting.repo.ThumbnailRepository;
import ua.com.mescherskiy.mediahosting.repo.UserRepository;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.apache.http.entity.ContentType.*;

@Service
@RequiredArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    private final JwtService jwtService;
    private final FileStore fileStore;
    private final static Logger logger = LoggerFactory.getLogger(PhotoService.class);

//    public List<Photo> getAllUserPhotosByUserId(Long id) {
//        return photoRepository.findAllByUserId(id);
//    }
//
//    public List<Photo> getAllUserPhotosByUser(User user) {
//        return photoRepository.findAllByUser(user);
//    }
//
//    public List<Photo> getAllUserPhotosByUserEmail(String email) {return photoRepository.findAllByUser_Email(email);}
//
//    public List<String> getAllUserPhotoKeysByUsername(String username) {
//        List<Photo> photos = photoRepository.findAllByUser_Email(username);
//        return photos.stream().map(Photo::getFileName).collect(Collectors.toList());
//    }
//
//    public List<Long> getAllUserPhotoIdsByUsername(String username) {
//        List<Photo> photos = photoRepository.findAllByUser_Email(username);
//        return photos.stream().map(Photo::getId).collect(Collectors.toList());
//    }

    public List<PhotoResponse> generateAllUserPhotoUrls(HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        List<Photo> photos = photoRepository.findAllByUser_EmailOrderByUploadDateDesc(username);
        return photos.stream().map(photo -> new PhotoResponse(
                "https://media-hosting-beedbd9a2f9f.herokuapp.com/api/vault/" + photo.getId(),
                photo.getWidth(), photo.getHeight(), photo.getId())).toList();
//        return photos.stream().map(photo -> new PhotoResponse(
//                "http://localhost:8080/api/vault/" + photo.getId(),
//                photo.getWidth(), photo.getHeight(), photo.getId())).toList();
    }

//    public Optional<Photo> getPhotoByFilenameOrPath(String fileName, String path) {
//        return photoRepository.findByFileNameOrPath(fileName, path);
//    }
//
//    public Optional<Photo> getPhotoById(Long id) {
//        return photoRepository.findById(id);
//    }

    public void uploadOriginalPhoto(MultipartFile file, HttpServletRequest request) throws IOException {
        isFileEmpty(file);
        isImage(file);
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        User user = isUserExists(username);
        Map<String, String> metadata = extractMetadata(file);

        String path = String.format("%s/%s", Bucket.MEDIA_HOSTING.getBucketName(), user.getId());

        BufferedImage image = ImageIO.read(file.getInputStream());
        int width = image.getWidth();
        int height = image.getHeight();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(image)
                .outputFormat("jpg")
                .outputQuality(0.8)
                .size(height, width)
                .toOutputStream(outputStream);
        ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());

        Photo photo = Photo.builder()
                .fileName(file.getOriginalFilename())
                .path(path)
                .uploadDate(new Date())
                .width(width)
                .height(height)
                .user(user)
                .build();

        photoRepository.save(photo);
        fileStore.save(photo.getPath(), photo.getFileName(), Optional.of(metadata), inputStream);
    }

//    public void uploadPhotoWithThumbnail(String username, MultipartFile file) throws IOException {
//        isFileEmpty(file);
//        isImage(file);
//        User user = isUserExists(username);
//        Map<String, String> originalMetadata = extractMetadata(file);
//        String path = String.format("%s/%s", Bucket.MEDIA_HOSTING.getBucketName(), user.getId());
//
//        Thumbnail thumbnail;
//
//        try {
//            thumbnail = createThumbnail(file, path);
//        } catch (IOException e) {
//            throw new RuntimeException("Cannot create thumbnail!", e);
//        }
//
//        BufferedImage image = ImageIO.read(file.getInputStream());
//        int width = image.getWidth();
//        int height = image.getHeight();
//
//        Photo photo = Photo.builder()
//                .fileName(file.getOriginalFilename())
//                .path(path)
//                .uploadDate(new Date())
//                .user(user)
//                .height(height)
//                .width(width)
//                .build();
//
//        photo.createThumbnail(thumbnail);
//        thumbnail.setOriginalPhoto(photo);
//
//        Map<String, String> thumbnailMetadata = extractMetadata(thumbnail.getBytes());
//
//        try {
//            photoRepository.save(photo);
//            thumbnailRepository.save(thumbnail);
//            fileStore.save(photo.getPath(), photo.getFileName(), Optional.of(originalMetadata), file.getInputStream());
//            fileStore.save(thumbnail.getPath(), thumbnail.getFileName(), Optional.of(thumbnailMetadata), new ByteArrayInputStream(thumbnail.getBytes()));
//        } catch (IOException e) {
//            throw new IllegalStateException(e);
//        }
//    }

//    public Thumbnail createThumbnail (MultipartFile originalFile, String path) throws IOException {
//        BufferedImage originalImage = ImageIO.read(originalFile.getInputStream());
//        BufferedImage thumbnailImage = Scalr.resize(originalImage, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_TO_WIDTH,
//                100, 100, Scalr.OP_ANTIALIAS);
//
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        ImageIO.write(thumbnailImage, "jpg", baos);
//
//        return Thumbnail.builder()
//                .bytes(baos.toByteArray())
//                .fileName("thumbnail_" + originalFile.getOriginalFilename())
//                .path(path)
//                .uploadDate(new Date())
//                .build();
//    }

    public byte[] downloadOriginalPhoto(Long photoId, HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        User user = isUserExists(username);
        String path = String.format("%s/%s", Bucket.MEDIA_HOSTING.getBucketName(), user.getId());
        String key = "";
        if (user != null && user.getPhotos().stream().anyMatch(photo -> photo.getId().equals(photoId))) {
            key = photoRepository.findById(photoId).get().getFileName();
            logger.info("Photo path+key: " + path+"/"+key);
            return fileStore.download(path, key);
        }
        return new byte[0];
    }

    public byte[] downloadThumbnail(Long photoId, HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        User user = isUserExists(username);
        String path = String.format("%s/%s", Bucket.MEDIA_HOSTING.getBucketName(), user.getId());
        String key = "";
        if (user != null && user.getPhotos().stream().anyMatch(photo -> photo.getId().equals(photoId))) {
            key = photoRepository.findById(photoId).get().getFileName();
            return fileStore.download(path, "thumbnail_" + key);
        }
        return new byte[0];
    }

    public void deletePhotos(List<Long> photoIds, HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        User user = isUserExists(username);
        String path = String.format("%s/%s", Bucket.MEDIA_HOSTING.getBucketName(), user.getId());
        boolean allPhotosExist = new HashSet<>(user.getPhotos().stream()
                .map(Photo::getId).toList())
                .containsAll(photoIds);

        if (!CollectionUtils.isEmpty(photoIds) && allPhotosExist) {
            List<String> photoKeys = photoIds.stream().map(id -> photoRepository.findById(id).get().getFileName()).toList();
            fileStore.delete(path, photoKeys);

            List<Photo> photosToDelete = user.getPhotos().stream()
                    .filter(photo -> photoIds.contains(photo.getId())).toList();

            user.getPhotos().removeAll(photosToDelete);

            for (Long id: photoIds) {
                photoRepository.deleteById(id);
            }
        }
    }


//    public String generatePresignedPhotoUrl(String username, String imageKey) {
//        User user = isUserExists(username);
//        String path = String.format("%s/%s", Bucket.MEDIA_HOSTING.getBucketName(), user.getId());
//        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(path, imageKey);
//        return fileStore.generatePresignedUrl(generatePresignedUrlRequest);
//    }

//    public byte[] downloadAllUserPhotos (Long userId) {
//        List<Photo> photos = photoRepository.findAllByUserId(userId);
//
//    }

    private Map<String, String> extractMetadata(MultipartFile file) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-type", file.getContentType());
        metadata.put("Content-Length", String.valueOf(file.getSize()));
        return metadata;
    }

//    private Map<String, String> extractMetadata(byte[] bytes) {
//        Map<String, String> metadata = new HashMap<>();
//        metadata.put("Content-Length", String.valueOf(bytes.length));
//        return metadata;
//    }
//
//    private User isUserExists(Long userId) {
//        return userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User not found"));
//    }

    private User isUserExists(String username) {
        return userRepository.findByEmail(username).orElseThrow(() -> new IllegalStateException("User not found"));
    }

    private void isImage(MultipartFile file) {
        if (!Arrays.asList(IMAGE_JPEG.getMimeType(), IMAGE_PNG.getMimeType(), IMAGE_GIF.getMimeType())
                .contains(file.getContentType())) {
            throw new IllegalStateException("File must be an image [ " + file.getContentType() + "]");
        }
    }

    private void isFileEmpty(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalStateException("Cannot upload an empty file [ " + file.getSize() + " ]");
        }
    }
}
