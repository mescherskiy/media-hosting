package ua.com.mescherskiy.mediahosting.security.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import ua.com.mescherskiy.mediahosting.security.jwt.JwtService;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String refreshToken = jwtService.getRefreshTokenFromCookies(request);
        if (refreshToken != null && !refreshToken.isEmpty()) {
            refreshTokenService.deleteByToken(refreshToken);
        }
        response.addHeader(HttpHeaders.SET_COOKIE, jwtService.getCleanAccessTokenCookie().toString());
        response.addHeader(HttpHeaders.SET_COOKIE, jwtService.getCleanRefreshTokenCookie().toString());
    }
}
