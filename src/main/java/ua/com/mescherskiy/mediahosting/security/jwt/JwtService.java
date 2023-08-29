package ua.com.mescherskiy.mediahosting.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.util.WebUtils;
import ua.com.mescherskiy.mediahosting.exception.AccessTokenExpiredException;
import ua.com.mescherskiy.mediahosting.models.User;
import ua.com.mescherskiy.mediahosting.security.services.UserDetailsImpl;

import java.security.Key;
import java.util.Date;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    @Value("${jwt.accessTokenExpirationMs}")
    private int accessTokenExpirationMs;

    @Value("${jwt.refreshTokenExpirationMs}")
    private int refreshTokenExpirationMs;

    @Value("${jwt.accessTokenCookieName}")
    private String accessTokenCookieName;

    @Value("${jwt.refreshTokenCookieName}")
    private String refreshTokenCookieName;

//    private final HandlerExceptionResolver handlerExceptionResolver;

    //    public String generateAccessToken(UserDetails userDetails) {
//        return generateAccessToken(new HashMap<>(), userDetails);
//    }
//
//    public String generateAccessToken(
//            Map<String, Object> extraClaims,
//            UserDetails userDetails
//    ) {
//        return Jwts
//                .builder()
//                .setClaims(extraClaims)
//                .setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60))
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String generateRefreshToken(
//            Map<String, Object> extraClaims,
//            UserDetails userDetails
//    ) {
//        return Jwts
//                .builder()
//                .setClaims(extraClaims)
//                .setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }

//    public boolean isTokenValid(String token, UserDetails userDetails) {
//        final String username = extractUsername(token);
//        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
//    }

//    public String generateJWT(UserDetailsImpl userPrincipal) {
//        return generateJWTFromUsername(userPrincipal.getUsername());
//    }



    public ResponseCookie generateAccessTokenCookie(UserDetailsImpl userPrincipal) {
        String jwt = generateJWTFromUsername(userPrincipal.getUsername());
        return generateCookie(accessTokenCookieName, jwt, "/api", accessTokenExpirationMs);
    }

        public ResponseCookie generateAccessTokenCookie(User user) {
        String jwt = generateJWTFromUsername(user.getEmail());
        return generateCookie(accessTokenCookieName, jwt, "/api", accessTokenExpirationMs);
    }

    public ResponseCookie generateRefreshTokenCookie(String refreshToken) {
        return generateCookie(refreshTokenCookieName, refreshToken, "/api", refreshTokenExpirationMs);
    }

    public String getAccessTokenFromCookies(HttpServletRequest request) {
        return getCookieValueByName(request, accessTokenCookieName);
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        return getCookieValueByName(request, refreshTokenCookieName);
    }

    public ResponseCookie getCleanAccessTokenCookie() {
        return ResponseCookie.from(accessTokenCookieName).path("/api").build();
    }

    public Cookie getCleanAccessJWTCookie() {
        Cookie cookie = new Cookie(accessTokenCookieName, null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/api");
        return cookie;
    }

    public ResponseCookie getCleanRefreshTokenCookie() {
        return ResponseCookie.from(refreshTokenCookieName).path("/api").build();
    }

    public Cookie getCleanRefreshJWTCookie() {
        Cookie cookie = new Cookie(refreshTokenCookieName, null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/api");
        return cookie;
    }

    public String getUsernameFromJWT(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token)
            throws SignatureException, MalformedJwtException, ExpiredJwtException, UnsupportedJwtException, IllegalArgumentException {
        Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
        return true;
    }

    public String generateJWTFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + accessTokenExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

//    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }

//    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }

//    public boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    private Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    private Claims extractAllClaims(String token) {
//        return Jwts
//                .parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }

    private ResponseCookie generateCookie(String name, String value, String path, int expirationMs) {
        return ResponseCookie.from(name, value).path(path).maxAge(expirationMs/100).httpOnly(true).build();
    }

    private String getCookieValueByName(HttpServletRequest request, String name) {
        Cookie cookie = WebUtils.getCookie(request, name);
        return cookie != null ? cookie.getValue() : null;
    }
}
