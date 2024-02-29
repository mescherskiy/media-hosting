package ua.com.mescherskiy.mediahosting.services;

import ch.qos.logback.core.joran.sanity.Pair;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.payload.response.EditProfileResponse;
import ua.com.mescherskiy.mediahosting.repo.PhotoRepository;
import ua.com.mescherskiy.mediahosting.repo.UserRepository;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    private final PhotoService photoService;

    private final PasswordEncoder passwordEncoder;

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

    public boolean isUserExists(String username) {
        return userRepository.existsByEmail(username);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByEmail(username);
    }

    public EditProfileResponse editUser(String name, String oldPassword, String newPassword, String username) {
        EditProfileResponse response = new EditProfileResponse();
        User user = userRepository.findByEmail(username).orElse(null);
        if (user == null) {
            response.setStatusCode(400);
            response.setMessage("User not found");
        } else if (!passwordEncoder.matches(oldPassword, user.getPass())) {
            response.setStatusCode(418);
            response.setMessage("Invalid current password");
        } else {
            if (name != null && !name.isEmpty()) {
                user.setName(name);
            }
            if (newPassword != null && !newPassword.isEmpty()) {
                user.setPass(passwordEncoder.encode(newPassword));
            }
            userRepository.save(user);
            response.setStatusCode(200);
            response.setMessage("User edited successfully");
        }
        return response;
    }
}
