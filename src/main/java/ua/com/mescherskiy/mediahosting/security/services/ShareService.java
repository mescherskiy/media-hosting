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

    public Optional<Share> findByUsername(String username) {
        return shareRepository.findByUsername(username);
    }

    public String generateSharedLink(List<Long> photoIds, HttpServletRequest request) {
        String key = null;
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        if (userService.isUserExists(username) && !photoIds.isEmpty()) {
            try {
//                key = encrypt(photoIds, username, secretKey);
                key = generateRandomKey();
            } catch (Exception e) {
                System.out.println("Error! Encryption String failed: " + e.getMessage());
                return null;
            }
            Share share = Share.builder()
                    .username(username)
                    .photoIds(photoIds)
                    .key(key)
                    .build();
            shareRepository.save(share);
        }
        return key;
    }

    public List<PhotoResponse> getSharedPhotos(String key) {
//        String decryptedData = null;
//        try {
//            decryptedData = decrypt(key, secretKey);
//        } catch (Exception e) {
//            System.out.println("Error! Decryption failed: " + e.getMessage());
//        }
//        if (decryptedData != null) {
//            List<Long> photoIds = extractPhotoIdsFromDecryptedString(decryptedData);
//            String username = extractUsernameFromDecryptedString(decryptedData);
//            User user = userService.findUserByUsername(username).orElse(null);
//            if (user != null) {
//                return photoService.getUserPhotosByIds(photoIds, user);
//            }
//        }
//        return null;

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

//    private String encrypt(List<Long> photoIds, String username, String secretKey) throws Exception {
//        SecretKey key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
//        Cipher cipher = Cipher.getInstance("AES");
//        cipher.init(Cipher.ENCRYPT_MODE, key);
//        String userAndPhotoIdsStr =
//                username + "<!>" + photoIds.stream().map(String::valueOf).collect(Collectors.joining("|")) + "<!>";
//        byte[] encryptedData = cipher.doFinal(userAndPhotoIdsStr.getBytes());
//        return Base64.getEncoder().encodeToString(encryptedData);
//    }
//
//    private String decrypt(String encryptedData, String secretKey) throws Exception {
//        SecretKey key = new SecretKeySpec(secretKey.getBytes(), "AES");
//        Cipher cipher = Cipher.getInstance("AES");
//        cipher.init(Cipher.DECRYPT_MODE, key);
//        byte[] decryptedData = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
//        return new String(decryptedData);
//    }
//
//    private String extractUsernameFromDecryptedString(String decryptedData) {
//        return decryptedData.split("<!>")[0];
//    }
//
//    private List<Long> extractPhotoIdsFromDecryptedString(String decryptedData) {
//        return Arrays.stream(decryptedData.split("<!>")[1].split("\\|"))
//                .map(Long::parseLong)
//                .collect(Collectors.toList());
//    }

    private String generateRandomKey() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
