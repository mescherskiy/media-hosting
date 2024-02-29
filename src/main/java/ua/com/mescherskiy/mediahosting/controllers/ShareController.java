package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.payload.response.SharedPhotos;
import ua.com.mescherskiy.mediahosting.security.services.ShareService;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/share")
public class ShareController {
    private final ShareService shareService;

    @PostMapping
    public ResponseEntity<?> sharePhotos(@RequestBody Set<Long> photoIds, HttpServletRequest request) {
        String key = shareService.generateSharedLink(photoIds, request);
        return key != null
                ? ResponseEntity.ok().body(new MessageResponse(key))
                : ResponseEntity.badRequest().body(new MessageResponse("Error generating shared link"));
    }

    @GetMapping("/{key}")
    public ResponseEntity<?> getSharedPhotosByKey(@PathVariable String key) {
        if (!shareService.isKeyExists(key)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Page not found"));
        }
        Set<PhotoResponse> photos = shareService.getSharedPhotos(key);
        return photos != null
                ? ResponseEntity.ok(photos)
                : ResponseEntity.badRequest().body(new MessageResponse("Something went wrong"));
    }
}
