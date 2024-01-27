package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.services.PhotoService;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vault")
public class PhotoController {

    private final PhotoService photoService;

    private final static Logger logger = LoggerFactory.getLogger(PhotoController.class);

//    @GetMapping("/{username}")
//    public List<String> getAllUserPhotoKeys(@PathVariable("username") String userEmail) {
//        return photoService.getAllUserPhotoKeysByUsername(userEmail);
//    }

    @GetMapping()
    public List<PhotoResponse> getAllUserPhotoIds(HttpServletRequest request) {
        return photoService.generateAllUserPhotoUrls(request);
    }

//    @GetMapping("/{username}/{imageKey}")
//    public ResponseEntity<String> getPresignedPhotoUrl(@PathVariable String username, @PathVariable String imageKey) {
//        String presignedUrl = photoService.generatePresignedPhotoUrl(username, imageKey);
//        return ResponseEntity.ok(presignedUrl);
//    }

    @PostMapping(
            path = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public void uploadUserPhoto(@RequestParam("file")MultipartFile file, HttpServletRequest request) {
        try {
            photoService.uploadOriginalPhoto(file, request);
        } catch (IOException e) {
            throw new RuntimeException("Cannot upload photo", e);
        }
    }

//    @GetMapping("/{photoId}")
//    public byte[] downloadUserPhotoById(@PathVariable("photoId") Long photoId,
//                                        @RequestParam("size") String size,
//                                        HttpServletRequest request) {
//        if (size.equals("thumbnail")) {
//            return photoService.downloadThumbnail(photoId, request);
//        } else if (size.equals("full")) {
//            return photoService.downloadOriginalPhoto(photoId, request);
//            return photoService.getCurrentPhotoUrl(photoId, request);
//        } else {
//            throw new IllegalArgumentException("Invalid photo size");
//        }
//    }

    @GetMapping("/{photoId}")
    public ResponseEntity<?> redirectToCurrentPhotoUrl(@PathVariable("photoId") Long photoId, HttpServletRequest request) {
            String actualPhotoUrl = photoService.getCurrentPhotoUrl(photoId, request);
            return ResponseEntity.status(HttpStatus.SC_MOVED_TEMPORARILY).location(URI.create(actualPhotoUrl)).build();
    }

    @PostMapping("/delete")
    public void deletePhotos(@RequestBody List<Long> photoIds, HttpServletRequest request) {
        logger.info("Photo IDs to delete: " + photoIds);
        photoService.deletePhotos(photoIds, request);
    }
}
