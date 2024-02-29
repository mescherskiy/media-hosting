package ua.com.mescherskiy.mediahosting.security.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

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
        Optional<RefreshToken> oldToken = refreshTokenService.findByUserId(userDetails.getId());
        oldToken.ifPresent(token -> refreshTokenService.deleteByToken(token.getToken()));
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(refreshTokenService.createRefreshToken(userDetails.getId()).getToken());
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toSet());

        return new JwtCookieResponse(jwtCookie.toString(), refreshTokenCookie.toString(),
                new UserInfo(userDetails.getId(), userDetails.getEmail(), userDetails.getName(), roles));
//        return new JwtCookieResponse(jwtCookie.toString(), refreshTokenCookie.toString(), userDetails);
    }

    public LogoutResponse logout(HttpServletRequest request) {
        Object userPrincipal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.toString().equals("anonymousUser")) {
            Long userId = ((UserDetailsImpl) userPrincipal).getId();

            refreshTokenService.deleteByToken(jwtService.getRefreshTokenFromCookies(request));
        }

        ResponseCookie accessTokenCookie = jwtService.getCleanAccessTokenCookie();
        ResponseCookie refreshTokenCookie = jwtService.getCleanRefreshTokenCookie();

        return new LogoutResponse(accessTokenCookie.toString(), refreshTokenCookie.toString(),
                new MessageResponse("You've been logged out"));

//        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        refreshTokenService.deleteByUserId(userDetails.getId());
//        ResponseCookie accessTokenCookie = jwtService.getCleanAccessTokenCookie();
//        ResponseCookie refreshTokenCookie = jwtService.getCleanRefreshTokenCookie();
//        return new LogoutResponse(accessTokenCookie.toString(), refreshTokenCookie.toString(),
//                new MessageResponse("You've been logged out"));

//        String accessToken = jwtService.getAccessTokenFromCookies(request);
//        UserDetailsImpl userDetails = jwtService.extractUserDetailsFromToken(accessToken);
//        if (userDetails != null) {
//            refreshTokenService.deleteByUserId(userDetails.getId());
//        }
//        ResponseCookie accessTokenCookie = jwtService.getCleanAccessTokenCookie();
//        ResponseCookie refreshTokenCookie = jwtService.getCleanRefreshTokenCookie();
//        return new LogoutResponse(accessTokenCookie.toString(), refreshTokenCookie.toString(),
//                new MessageResponse("You've been logged out"));
    }
}
