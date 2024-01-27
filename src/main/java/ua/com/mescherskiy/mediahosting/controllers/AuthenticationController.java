package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.payload.request.AuthenticationRequest;
import ua.com.mescherskiy.mediahosting.payload.request.RefreshTokenRequest;
import ua.com.mescherskiy.mediahosting.payload.request.RegisterRequest;
import ua.com.mescherskiy.mediahosting.payload.response.JwtCookieResponse;
import ua.com.mescherskiy.mediahosting.payload.response.LogoutResponse;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.security.services.AuthenticationService;
import ua.com.mescherskiy.mediahosting.security.services.RefreshTokenService;

import java.util.HashMap;
import java.util.Map;

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
                ResponseEntity.badRequest().body(new MessageResponse("User with this email already exists"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthenticationRequest request,
                                          HttpServletResponse response) {
        JwtCookieResponse responseData = service.authenticate(request);
        response.addHeader(HttpHeaders.SET_COOKIE, responseData.getAccessToken());
        response.addHeader(HttpHeaders.SET_COOKIE, responseData.getRefreshToken());
        return ResponseEntity.ok(responseData.getUserInfo());
    }

//    @PostMapping("/signout")
//    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
//        LogoutResponse logoutResponse = service.logout(request);
//        response.addHeader(HttpHeaders.SET_COOKIE, logoutResponse.accessToken());
//        response.addHeader(HttpHeaders.SET_COOKIE, logoutResponse.refreshToken());
//        return ResponseEntity.ok(logoutResponse.messageResponse());
//    }

    @GetMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken (HttpServletRequest request) {
        return refreshTokenService.refresh(request);
//        return success
//                ? ResponseEntity.ok(new MessageResponse("Access token refreshed successfully"))
//                : ResponseEntity.badRequest().body(new MessageResponse("Error refreshing access token"));
    }


    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, String> handleNullJWTException(IllegalArgumentException exception) {
        Map<String, String> error = new HashMap<>();
        error.put(String.valueOf(exception.getCause()), exception.getMessage());

        return error;
    }
}


