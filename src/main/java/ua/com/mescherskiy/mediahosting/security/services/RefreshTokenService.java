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
import ua.com.mescherskiy.mediahosting.payload.request.RefreshTokenRequest;
import ua.com.mescherskiy.mediahosting.payload.response.MessageResponse;
import ua.com.mescherskiy.mediahosting.payload.response.RefreshTokenResponse;
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
            throw new RefreshTokenException(token.getToken(), "Refresh token was expired. Please make a new login request");
        }

        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }

    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refreshToken = jwtService.getRefreshTokenFromCookies(request);

        if ((refreshToken != null) && (refreshToken.length() > 0)) {
            return findByToken(refreshToken)
                    .map(this::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(user);

                        return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                                .body(new MessageResponse("Token has been refreshed"));
                    }).orElseThrow(() -> new RefreshTokenException(refreshToken, "Refresh token is not in database"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Refresh token is empty!"));
        }



    }
}
