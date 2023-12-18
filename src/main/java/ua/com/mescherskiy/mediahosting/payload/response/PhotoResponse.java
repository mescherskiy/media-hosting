package ua.com.mescherskiy.mediahosting.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PhotoResponse {
    private String url;
    private int width;
    private int height;
    private Long id;
}
