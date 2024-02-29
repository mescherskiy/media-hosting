package ua.com.mescherskiy.mediahosting.models;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String name;

    @Nullable
    @ElementCollection
    private Set<Long> photoIds;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Album album = (Album) o;

        if (!id.equals(album.id)) return false;
        if (!username.equals(album.username)) return false;
        if (name != null ? !name.equals(album.name) : album.name != null) return false;
        return photoIds != null ? photoIds.equals(album.photoIds) : album.photoIds == null;
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + username.hashCode();
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (photoIds != null ? photoIds.hashCode() : 0);
        return result;
    }
}
