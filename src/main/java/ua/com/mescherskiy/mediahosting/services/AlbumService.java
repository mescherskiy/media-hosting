package ua.com.mescherskiy.mediahosting.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.com.mescherskiy.mediahosting.models.Album;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.payload.request.AlbumRequest;
import ua.com.mescherskiy.mediahosting.payload.response.AlbumResponse;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.repo.AlbumRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final PhotoService photoService;

    private final UserService userService;

    public List<AlbumResponse> findAllUserAlbums(String username) {
        return albumRepository.findAllByUsername(username).stream()
                .map(album -> getAllPhotosFromTheAlbum(album.getId())).toList();
    }

    public void createNewAlbum(AlbumRequest albumRequest, String username) {
        String name = albumRequest.getName();
        List<Long> photoIds = albumRequest.getPhotoIds();
        String src = photoService.getCurrentPhotoUrl(photoIds.get(0), username);
        System.out.println("titlePhotoSrc: " + src);
        Album newAlbum = Album.builder()
                .name(name)
                .username(username)
                .photoIds(photoIds)
                .titlePhotoSrc(src)
                .build();
        albumRepository.save(newAlbum);
    }

    public AlbumResponse getAllPhotosFromTheAlbum(Long albumId) {
        Optional<Album> album = albumRepository.findById(albumId);
        if (album.isPresent()) {
            String username = album.get().getUsername();

            Optional<User> user = userService.findUserByUsername(username);
            if (user.isPresent()) {
                List<PhotoResponse> photos = new ArrayList<>(photoService.getUserPhotosByIds(album.get().getPhotoIds(), user.get()));
                return new AlbumResponse(album.get().getId(), album.get().getName(), photos, album.get().getTitlePhotoSrc());
            }
        }
        return null;
    }
}
