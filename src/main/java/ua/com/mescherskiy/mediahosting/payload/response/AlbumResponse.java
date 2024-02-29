package ua.com.mescherskiy.mediahosting.payload.response;

import jakarta.persistence.ElementCollection;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
public class AlbumResponse {
    private Long id;

    private String name;

    @ElementCollection
    private Set<PhotoResponse> photos;
}
