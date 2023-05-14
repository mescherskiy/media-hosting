package ua.com.mescherskiy.mediahosting.auth;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.com.mescherskiy.mediahosting.config.JwtService;
import ua.com.mescherskiy.mediahosting.user.Role;
import ua.com.mescherskiy.mediahosting.user.User;
import ua.com.mescherskiy.mediahosting.user.UserRepository;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .pass(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        repository.save(user);
        String jwtToken = jwtService.generateAccessToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        Map<String, Object> extraClaims = Map.of("name", user.getName());
        String accessToken = jwtService.generateAccessToken(extraClaims, user);
        String refreshToken = jwtService.generateRefreshToken(extraClaims, user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public RefreshResponse refresh(HttpServletRequest request) {
        // 1. get refresh_token from the request
        String authHeader = request.getHeader("Authorization");
        String refreshToken;
        String accessToken;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            refreshToken = authHeader.substring(7);

            // 2. validate refresh_token
            try {
                String email = jwtService.extractUsername(refreshToken);
                User user = repository.findByEmail(email).orElseThrow();
                if (jwtService.isTokenValid(refreshToken)) {

                    // 3. generate new access_token
                    accessToken = jwtService.generateAccessToken(user);
                    return RefreshResponse.builder()
                            .accessToken(accessToken)
                            .build();
                }
            } catch (Exception e) {
                throw new RuntimeException("Refresh token is not valid");
            }
        } else {
            throw new RuntimeException("Refresh token is missing");
        }

        return null;
    }
}
