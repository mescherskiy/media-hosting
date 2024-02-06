package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;
import ua.com.mescherskiy.mediahosting.security.services.UserDetailsImpl;
import ua.com.mescherskiy.mediahosting.services.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getUser(HttpServletRequest request) {
        String token = jwtService.getAccessTokenFromCookies(request);
        UserDetailsImpl user = jwtService.extractUserDetailsFromToken(token);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.badRequest().body("User not found");
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteUser(HttpServletRequest request) {
//        if (userId == null) {
//            return ResponseEntity.badRequest().body("User ID is required");
//        }

        return userService.delete(request)
                ? ResponseEntity.ok().body("User deleted successfully")
                : ResponseEntity.status(HttpStatus.FORBIDDEN).body("Failed to delete user");
    }
}
