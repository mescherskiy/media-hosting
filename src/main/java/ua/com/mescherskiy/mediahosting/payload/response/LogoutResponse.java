package ua.com.mescherskiy.mediahosting.payload.response;

public record LogoutResponse(String accessToken, String refreshToken, MessageResponse messageResponse) {
}
