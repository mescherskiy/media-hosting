package ua.com.mescherskiy.mediahosting.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.mescherskiy.mediahosting.models.Album;
import ua.com.mescherskiy.mediahosting.payload.request.AlbumRequest;
import ua.com.mescherskiy.mediahosting.payload.response.AlbumResponse;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;
import ua.com.mescherskiy.mediahosting.services.AlbumService;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/album")
public class AlbumController {

    private final AlbumService albumService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getAllUserAlbums(HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        if (username == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        List<AlbumResponse> albums = albumService.findAllUserAlbums(username);
        return ResponseEntity.ok(albums);
    }

    @PostMapping("/new")
    public ResponseEntity<?> addNewAlbum(@RequestBody AlbumRequest albumRequest, HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        if (username == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        albumService.createNewAlbum(albumRequest, username);
        return ResponseEntity.ok(new MessageResponse("New album was created!"));
    }

    @PutMapping("/add")
    public ResponseEntity<?> addToAlbum(@RequestBody AlbumRequest albumRequest, HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        Long albumId = albumRequest.getAlbumId();
        Set<Long> photoIds = albumRequest.getPhotoIds();
        if (username == null || albumId == null || photoIds == null) {

            return ResponseEntity.badRequest().body(albumRequest);
        }
        return albumService.addToAlbum(albumId, photoIds)
                ? ResponseEntity.ok(new MessageResponse("Photo(s) added to album"))
                : ResponseEntity.badRequest().body(new MessageResponse("Something goes wrong"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPhotosFromAlbum(@PathVariable Long id) {
        AlbumResponse album = albumService.getAllPhotosFromTheAlbum(id);
//        return album != null ?
//                ResponseEntity.ok(album) :
//                ResponseEntity.badRequest().body(new MessageResponse("Error getting photos from album"));
        return ResponseEntity.ok(album);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlbum(@PathVariable Long id, HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        if (username == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return albumService.deleteAlbum(id, username) ?
                ResponseEntity.ok(new MessageResponse("Album deleted successfully")) :
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new MessageResponse("Can't delete the album"));
    }
}
