package ua.com.mescherskiy.mediahosting.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.models.Thumbnail;

public interface ThumbnailRepository extends JpaRepository<Thumbnail, Long> {
    Thumbnail findByOriginalPhoto (Photo originalPhoto);
}
