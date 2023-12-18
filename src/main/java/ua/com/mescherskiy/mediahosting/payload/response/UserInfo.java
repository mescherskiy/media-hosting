package ua.com.mescherskiy.mediahosting.payload.response;

import java.util.List;

public record UserInfo(Long id, String email, String name, List<String> roles) {
}
