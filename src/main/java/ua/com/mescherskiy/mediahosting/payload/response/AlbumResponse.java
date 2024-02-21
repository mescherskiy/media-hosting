package ua.com.mescherskiy.mediahosting.payload.response;

import jakarta.persistence.ElementCollection;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AlbumResponse {
    private Long id;

    private String name;

    @ElementCollection
    private List<PhotoResponse> photos;

    private String titlePhotoSrc;
}
