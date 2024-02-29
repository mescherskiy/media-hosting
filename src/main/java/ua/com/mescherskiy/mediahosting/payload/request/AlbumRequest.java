package ua.com.mescherskiy.mediahosting.payload.request;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumRequest {
    @Nullable
    private String name;

    @Nullable
    private Long albumId;

    @Nullable
    private Set<Long> photoIds;
}
