package ua.com.mescherskiy.mediahosting.payload.response;

import java.util.List;

public record UserInfo(String email, String name, List<String> roles) {
}
