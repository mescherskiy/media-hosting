package ua.com.mescherskiy.mediahosting.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Thumbnail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Transient
    private byte[] bytes;
    private String fileName;
    private String path;
    private Date uploadDate;
    @OneToOne
    @JoinColumn(name = "original_photo_id")
    private Photo originalPhoto;
}
