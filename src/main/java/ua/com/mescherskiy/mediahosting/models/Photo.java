package ua.com.mescherskiy.mediahosting.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Objects;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String path;

    private Date uploadDate;

    private Integer width;

    private Integer height;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "originalPhoto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Thumbnail thumbnail;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Photo photo = (Photo) o;

        if (!id.equals(photo.id)) return false;
        if (!fileName.equals(photo.fileName)) return false;
        if (!path.equals(photo.path)) return false;
        if (!uploadDate.equals(photo.uploadDate)) return false;
        if (!Objects.equals(width, photo.width)) return false;
        if (!Objects.equals(height, photo.height)) return false;
        return user.equals(photo.user);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + fileName.hashCode();
        result = 31 * result + path.hashCode();
        result = 31 * result + uploadDate.hashCode();
        result = 31 * result + (width != null ? width.hashCode() : 0);
        result = 31 * result + (height != null ? height.hashCode() : 0);
        result = 31 * result + user.hashCode();
        return result;
    }

    public void createThumbnail(Thumbnail thumbnail) {
        this.thumbnail = thumbnail;
        thumbnail.setOriginalPhoto(this);
    }

//    @PrePersist
//    public void prePersist() {
//        this.fileName = "";
//    }

    @PostPersist
    public void postPersist() {
        if (this.fileName != null) {
            this.fileName = this.id + "-" + this.fileName;
        }
    }
}
