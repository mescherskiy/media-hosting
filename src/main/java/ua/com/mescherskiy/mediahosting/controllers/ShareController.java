package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.security.services.ShareService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/share")
public class ShareController {
    private final ShareService shareService;

    @PostMapping
    public ResponseEntity<?> sharePhotos(@RequestBody List<Long> photoIds, HttpServletRequest request) {
        String key = shareService.generateSharedLink(photoIds, request);
        return key != null
                ? ResponseEntity.ok().body(new MessageResponse(key))
                : ResponseEntity.badRequest().body(new MessageResponse("Error generating shared link"));
    }

    @GetMapping("/{key}")
    public ResponseEntity<?> getSharedPhotosByKey(@PathVariable String key) {
        List<PhotoResponse> photos = shareService.getSharedPhotos(key);
        return photos != null
                ? ResponseEntity.ok().body(photos)
                : ResponseEntity.badRequest().body(new MessageResponse("Something went wrong"));
    }
}
