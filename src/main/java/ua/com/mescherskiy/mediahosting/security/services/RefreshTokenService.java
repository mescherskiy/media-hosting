package ua.com.mescherskiy.mediahosting.security.services;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.mescherskiy.mediahosting.exception.RefreshTokenException;
import ua.com.mescherskiy.mediahosting.models.RefreshToken;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.repo.RefreshTokenRepository;
import ua.com.mescherskiy.mediahosting.repo.UserRepository;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Value("${jwt.refreshTokenExpirationMs}")
    private Long refreshTokenExpirationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public Optional<RefreshToken> findByUserId(Long userId) {return refreshTokenRepository.findByUser_Id(userId); }

    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(userRepository.findById(userId).get())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpirationMs))
                .token(UUID.randomUUID().toString())
                .build();

        refreshToken = refreshTokenRepository.save(refreshToken);

        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if(token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RefreshTokenException("Session timeout. Please login again");
        }

        return token;
    }

    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void deleteByToken(String token) {
        System.out.println("Deleting RefreshToken with token: " + token);
        refreshTokenRepository.deleteByToken(token);
    }

    public ResponseEntity<MessageResponse> refresh(HttpServletRequest request) {
        String refreshToken = jwtService.getRefreshTokenFromCookies(request);

        if ((refreshToken != null) && (refreshToken.length() > 0)) {
            try {
                return findByToken(refreshToken)
                        .map(this::verifyExpiration)
                        .map(RefreshToken::getUser)
                        .map(user -> {
                            ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(user);

                            return ResponseEntity.ok()
                                    .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                                    .body(new MessageResponse("Token has been refreshed"));
                        }).orElseThrow(() -> new RefreshTokenException("Refresh token is not in database"));
            } catch (RefreshTokenException exception) {
                return ResponseEntity.badRequest().body(new MessageResponse(exception.getMessage()));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Refresh token is empty!"));
        }



    }
}
