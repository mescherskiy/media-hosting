package ua.com.mescherskiy.mediahosting.security.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.com.mescherskiy.mediahosting.models.RefreshToken;
import ua.com.mescherskiy.mediahosting.models.Role;
import ua.com.mescherskiy.mediahosting.payload.request.AuthenticationRequest;
import ua.com.mescherskiy.mediahosting.payload.request.RegisterRequest;
import ua.com.mescherskiy.mediahosting.payload.response.*;
import ua.com.mescherskiy.mediahosting.repo.RoleRepository;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;
import ua.com.mescherskiy.mediahosting.models.ERole;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.repo.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Boolean register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return false;
        }
        Set<String> strRoles = request.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles != null && strRoles.contains("admin")) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN was not found"));
            roles.add(adminRole);
        } else {
            Role role = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role USER was not found"));
            roles.add(role);
        }

        User user = User.builder()
                .name(request.getUsername())
                .email(request.getEmail())
                .pass(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .build();
        userRepository.save(user);

        return true;
    }

    public JwtCookieResponse authenticate(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        ResponseCookie jwtCookie = jwtService.generateAccessTokenCookie(userDetails);
        //String token = jwtService.generateJWT(userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList();

//        User user = repository.findByEmail(request.getEmail())
//                .orElseThrow();
//        Map<String, Object> extraClaims = Map.of("name", user.getName());
//        String accessToken = jwtService.generateAccessToken(extraClaims, user);
//        String refreshToken = jwtService.generateRefreshToken(extraClaims, user);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(refreshToken.getToken());

        return new JwtCookieResponse(jwtCookie.toString(), refreshTokenCookie.toString(),
                new UserInfo(userDetails.getEmail(), userDetails.getName(), roles));
    }

    public LogoutResponse logout() {
        Object userPrincipal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.toString().equals("anonymousUser")) {
            Long userId = ((UserDetailsImpl) userPrincipal).getId();
            refreshTokenService.deleteByUserId(userId);
        }

        ResponseCookie accessTokenCookie = jwtService.getCleanAccessTokenCookie();
        ResponseCookie refreshTokenCookie = jwtService.getCleanRefreshTokenCookie();

        return new LogoutResponse(accessTokenCookie.toString(), refreshTokenCookie.toString(),
                new MessageResponse("You've been logged out"));
    }



//    public RefreshResponse refresh(HttpServletRequest request) {
//        // 1. get refresh_token from the request
//        String authHeader = request.getHeader("Authorization");
//        String refreshToken;
//        String accessToken;
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            refreshToken = authHeader.substring(7);
//
//            // 2. validate refresh_token
//            try {
//                String email = jwtService.extractUsername(refreshToken);
//                User user = repository.findByEmail(email).orElseThrow();
//                if (jwtService.isTokenValid(refreshToken)) {
//
//                    // 3. generate new access_token
//                    accessToken = jwtService.generateAccessToken(user);
//                    return RefreshResponse.builder()
//                            .accessToken(accessToken)
//                            .build();
//                }
//            } catch (Exception e) {
//                throw new RuntimeException("Refresh token is not valid");
//            }
//        } else {
//            throw new RuntimeException("Refresh token is missing");
//        }
//
//        return null;
//    }
}
