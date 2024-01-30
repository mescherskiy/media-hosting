package ua.com.mescherskiy.mediahosting.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;

//@CrossOrigin(origins = "*", maxAge = 3600)
//@CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true", maxAge = 3600)
@RestController
public class TestController {

    @GetMapping()
    public String redirect() {
        return "forward:/index.html";
    }
}
