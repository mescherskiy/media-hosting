package ua.com.mescherskiy.mediahosting.advice;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import ua.com.mescherskiy.mediahosting.exception.AccessTokenExpiredException;
import ua.com.mescherskiy.mediahosting.exception.RefreshTokenException;

import java.util.Date;

@RestControllerAdvice
public class JWTControllerAdvice {

    @ExceptionHandler(value = {RefreshTokenException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorMessage handleRefreshTokenException(RefreshTokenException e, WebRequest request) {
        return new ErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                e.getMessage(),
                request.getDescription(false)
        );
    }

    @ExceptionHandler(value = {ExpiredJwtException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorMessage handleExpiredJwtException(ExpiredJwtException e, HttpServletRequest request) {
        return new ErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                e.getMessage(),
                request.getServletPath()
        );
    }
}
