package ua.com.mescherskiy.mediahosting.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccessTokenExpiredException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public AccessTokenExpiredException(String token, String message) {
        super(String.format("Access token [%s] is expired: %s", token, message));
    }
}
