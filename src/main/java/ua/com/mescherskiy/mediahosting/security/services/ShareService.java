package ua.com.mescherskiy.mediahosting.security.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.models.Share;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.payload.response.PhotoResponse;
import ua.com.mescherskiy.mediahosting.repo.ShareRepository;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;
import ua.com.mescherskiy.mediahosting.services.PhotoService;
import ua.com.mescherskiy.mediahosting.services.UserService;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShareService {
    private final ShareRepository shareRepository;
    private final JwtService jwtService;
    private final UserService userService;
    private final PhotoService photoService;

    private static final SecureRandom secureRandom = new SecureRandom();

    public String generateSharedLink(List<Long> photoIds, HttpServletRequest request) {
        String key = null;
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        if (userService.isUserExists(username) && !photoIds.isEmpty()) {
            key = generateRandomKey();
            Share share = Share.builder()
                    .username(username)
                    .photoIds(photoIds)
                    .key(key)
                    .build();
            shareRepository.save(share);
        }
        return key;
    }

    public boolean isKeyExists(String key) {
        return shareRepository.existsByKey(key);
    }

    public List<PhotoResponse> getSharedPhotos(String key) {
        Optional<Share> share = shareRepository.findByKey(key);
        if (share.isPresent()) {
            List<Long> photoIds = share.get().getPhotoIds();
            User user = userService.findUserByUsername(share.get().getUsername()).orElse(null);
            if (user != null) {
                return photoService.getUserPhotosByIds(photoIds, user);
            }
        }
        return null;
    }

    private String generateRandomKey() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
