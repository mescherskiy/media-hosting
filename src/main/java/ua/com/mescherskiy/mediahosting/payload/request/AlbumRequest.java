package ua.com.mescherskiy.mediahosting.payload.request;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumRequest {
    private String name;
    @Nullable
    private List<Long> photoIds;
}
