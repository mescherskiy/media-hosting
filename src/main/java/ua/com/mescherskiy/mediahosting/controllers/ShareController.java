package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.payload.response.SharedPhotos;
import ua.com.mescherskiy.mediahosting.security.services.ShareService;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ShareController {
    private final ShareService shareService;

    @PostMapping("/api/share")
    public ResponseEntity<?> sharePhotos(@RequestBody List<Long> photoIds, HttpServletRequest request) {
        String key = shareService.generateSharedLink(photoIds, request);
        return key != null
                ? ResponseEntity.ok().body(new MessageResponse(key))
                : ResponseEntity.badRequest().body(new MessageResponse("Error generating shared link"));
    }

    @GetMapping("/api/share/{key}")
    public ResponseEntity<?> getSharedPhotosByKey(@PathVariable String key, HttpServletRequest request, HttpServletResponse response) {
        List<PhotoResponse> photos = shareService.getSharedPhotos(key);
        if (photos != null) {
            return ResponseEntity.ok(photos);
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Something went wrong"));
        }
//        return photos != null
//                ? ResponseEntity.ok().body(new SharedPhotos(photos))
//                : ResponseEntity.badRequest().body(new MessageResponse("Something went wrong"));
    }
}
