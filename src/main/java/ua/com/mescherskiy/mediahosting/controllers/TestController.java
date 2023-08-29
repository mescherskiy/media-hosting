package ua.com.mescherskiy.mediahosting.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;

//@CrossOrigin(origins = "*", maxAge = 3600)
//@CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/all")
    public ResponseEntity<?> allAccess() {
        return ResponseEntity.ok(new MessageResponse("This is public content"));
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> userAccess() {
        return ResponseEntity.ok(new MessageResponse("User content"));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> adminAccess() {
        return ResponseEntity.ok(new MessageResponse("Admin board"));
    }
}
