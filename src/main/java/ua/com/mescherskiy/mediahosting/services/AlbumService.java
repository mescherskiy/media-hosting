package ua.com.mescherskiy.mediahosting.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import ua.com.mescherskiy.mediahosting.models.Album;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.payload.request.AlbumRequest;
import ua.com.mescherskiy.mediahosting.payload.response.AlbumResponse;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.repo.AlbumRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final PhotoService photoService;

    private final UserService userService;

    public List<AlbumResponse> findAllUserAlbums(String username) {
        return albumRepository.findAllByUsername(username).stream()
                .map(album -> getAllPhotosFromTheAlbum(album.getId())).toList();
    }

    public void deletePhotosFromAlbums(List<Long> photoIds) {
        if (photoIds.isEmpty()) {
            return;
        }
        Set<Album> albums = new HashSet<>();
        for (Long id : photoIds) {
            albums.addAll(albumRepository.findAllByPhotoIdsContains(id));
        }
        for (Album album : albums) {
            album.getPhotoIds().removeAll(photoIds);
            albumRepository.save(album);
        }
    }

    public void createNewAlbum(AlbumRequest albumRequest, String username) {
        String name = albumRequest.getName();
        Set<Long> photoIds = albumRequest.getPhotoIds();
        Album newAlbum = Album.builder()
                .name(name)
                .username(username)
                .photoIds(photoIds)
                .build();
        albumRepository.save(newAlbum);
    }

    public boolean addToAlbum(Long albumId, Set<Long> photoIds) {
        Album album = albumRepository.findById(albumId).orElse(null);
        if (album != null) {
            album.getPhotoIds().addAll(photoIds);
            albumRepository.save(album);
            return true;
        }
        return false;
    }

    public AlbumResponse getAllPhotosFromTheAlbum(Long albumId) {
        Optional<Album> album = albumRepository.findById(albumId);
        if (album.isPresent()) {
            String username = album.get().getUsername();

            Optional<User> user = userService.findUserByUsername(username);
            if (user.isPresent()) {
                Set<PhotoResponse> photos = new HashSet<>(photoService.getUserPhotosByIds(album.get().getPhotoIds(), user.get()));
                return new AlbumResponse(album.get().getId(), album.get().getName(), photos);
            }
        }
        return null;
    }

    @Modifying
    public boolean deleteAlbum(Long id, String username) {
        User user = userService.findUserByUsername(username).orElse(null);
        if (user != null) {
            Album album = albumRepository.findById(id).orElse(null);
            if (album != null) {
                albumRepository.delete(album);
                return true;
            }
        }
        return false;
    }
}
