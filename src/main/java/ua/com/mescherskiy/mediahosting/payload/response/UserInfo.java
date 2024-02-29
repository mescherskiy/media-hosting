package ua.com.mescherskiy.mediahosting.payload.response;

import java.util.List;
import java.util.Set;

public record UserInfo(Long id, String email, String name, Set<String> roles) {
}
