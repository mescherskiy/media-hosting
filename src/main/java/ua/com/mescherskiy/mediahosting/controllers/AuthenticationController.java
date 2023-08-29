package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.payload.request.AuthenticationRequest;
import ua.com.mescherskiy.mediahosting.payload.request.RefreshTokenRequest;
import ua.com.mescherskiy.mediahosting.payload.request.RegisterRequest;
import ua.com.mescherskiy.mediahosting.payload.response.JwtCookieResponse;
import ua.com.mescherskiy.mediahosting.payload.response.LogoutResponse;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.security.services.AuthenticationService;
import ua.com.mescherskiy.mediahosting.security.services.RefreshTokenService;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", maxAge = 3600)
//@CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true", maxAge = 3600)
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private final AuthenticationService service;

    @Autowired
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return service.register(request) ?
                ResponseEntity.ok().body(new MessageResponse("User registered successfully!")) :
                ResponseEntity.badRequest().body(new MessageResponse("Error: user with this email already exists"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        JwtCookieResponse responseData = service.authenticate(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseData.getAccessToken())
                .header(HttpHeaders.SET_COOKIE, responseData.getRefreshToken())
                .body(responseData.getUserInfo());
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logout() {
        LogoutResponse logoutResponse = service.logout();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, logoutResponse.accessToken())
                .header(HttpHeaders.SET_COOKIE, logoutResponse.refreshToken())
                .body(logoutResponse.messageResponse());
    }

//    @GetMapping("/test")
//    public ResponseEntity<String> test() {
//        return ResponseEntity.ok("Test is okay!");
//    }

    @GetMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken (HttpServletRequest request) {
        return refreshTokenService.refresh(request);
    }
}
