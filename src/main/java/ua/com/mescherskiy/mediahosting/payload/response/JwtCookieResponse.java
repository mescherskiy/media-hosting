package ua.com.mescherskiy.mediahosting.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtCookieResponse {
    private String accessToken;
    private String refreshToken;
    private UserInfo userInfo;
}
