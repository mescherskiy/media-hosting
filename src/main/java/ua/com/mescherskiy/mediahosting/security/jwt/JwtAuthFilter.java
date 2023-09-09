package ua.com.mescherskiy.mediahosting.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import ua.com.mescherskiy.mediahosting.security.services.UserDetailsServiceImpl;

import java.io.IOException;

@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtAuthEntryPoint authEntryPoint;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        if (!request.getServletPath().endsWith("/signin")
                && !request.getServletPath().endsWith("/refreshtoken")
                && !request.getServletPath().endsWith("/test/all")
                && !request.getServletPath().endsWith("/signup")) {
            try {
                String jwt = parseJWT(request);
                if (jwt != null && jwtService.isTokenValid(jwt)) {
                    String username = jwtService.getUsernameFromJWT(jwt);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } catch (ExpiredJwtException e) {
                //logger.error("Access token has expired: {}", e);
                SecurityContextHolder.clearContext();
                authEntryPoint.commence(request, response, new AuthenticationException("Token expired", e) {
                });
                return;
//            //throw e;
//            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
//            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//
//            final Map<String, Object> body = new HashMap<>();
//            body.put("status", HttpServletResponse.SC_FORBIDDEN);
//            body.put("error", "Access token expired");
//            body.put("message", e.getMessage());
//            body.put("path", request.getServletPath());
//
//            final ObjectMapper mapper = new ObjectMapper();
//            mapper.writeValue(response.getOutputStream(), body);
//            return;
            } catch (Exception e) {
                logger.error("Cannot set user authentication: {}", e);
//            return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String parseJWT(HttpServletRequest request) {
//        final String authHeader = request.getHeader("Authorization");
//        if (authHeader != null && !authHeader.isBlank() && authHeader.startsWith("Bearer ")) {
//            return authHeader.substring(7);
//        }
//        return null;
        return jwtService.getAccessTokenFromCookies(request);
    }
}
