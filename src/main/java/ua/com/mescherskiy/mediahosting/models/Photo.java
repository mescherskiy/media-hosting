package ua.com.mescherskiy.mediahosting.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

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
