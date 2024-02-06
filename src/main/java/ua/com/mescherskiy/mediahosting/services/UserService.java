package ua.com.mescherskiy.mediahosting.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.repo.PhotoRepository;
import ua.com.mescherskiy.mediahosting.repo.UserRepository;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    private final PhotoService photoService;

    @Transactional
    public boolean delete (HttpServletRequest request) {
        String username = jwtService.getUsernameFromJWT(jwtService.getAccessTokenFromCookies(request));
        if (username == null) {
            return false;
        }
        return userRepository.findByEmail(username)
                .map(user -> {
                    photoService.deleteAllUserPhotos(user);
                    userRepository.deleteByEmail(username);
                    return true;
                }).orElse(false);
    }
}
