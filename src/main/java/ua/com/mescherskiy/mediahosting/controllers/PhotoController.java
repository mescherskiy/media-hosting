package ua.com.mescherskiy.mediahosting.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.services.PhotoService;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vault")
public class PhotoController {

    private final PhotoService photoService;

//    @GetMapping("/{username}")
//    public List<String> getAllUserPhotoKeys(@PathVariable("username") String userEmail) {
//        return photoService.getAllUserPhotoKeysByUsername(userEmail);
//    }

    @GetMapping("/{username}")
    public List<PhotoResponse> getAllUserPhotoIds(@PathVariable("username") String userEmail) {
        return photoService.generateAllUserPhotoUrls(userEmail);
    }

//    @GetMapping("/{username}/{imageKey}")
//    public ResponseEntity<String> getPresignedPhotoUrl(@PathVariable String username, @PathVariable String imageKey) {
//        String presignedUrl = photoService.generatePresignedPhotoUrl(username, imageKey);
//        return ResponseEntity.ok(presignedUrl);
//    }

    @PostMapping(
            path = "/{username}/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public void uploadUserPhoto(@PathVariable("username") String userEmail, @RequestParam("file")MultipartFile file) {
        try {
            photoService.uploadOriginalPhoto(userEmail, file);
        } catch (IOException e) {
            throw new RuntimeException("Cannot upload photo", e);
        }
    }

    @GetMapping("/{username}/{photoId}")
    public byte[] downloadUserPhotoById(@PathVariable("username") String username,
                                        @PathVariable("photoId") Long photoId,
                                        @RequestParam("size") String size) {
        if (size.equals("thumbnail")) {
            return photoService.downloadThumbnail(username, photoId);
        } else if (size.equals("full")) {
            return photoService.downloadOriginalPhoto(username, photoId);
        } else {
            throw new IllegalArgumentException("Invalid photo size");
        }
    }
}
