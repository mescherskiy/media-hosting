package ua.com.mescherskiy.mediahosting.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.models.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findAllByUser(User user);
    List<Photo> findAllByUserId(Long userId);
    List<Photo> findAllByUser_Email(String email);
    Optional<Photo> findByUser(User user);
    Optional<Photo> findByUser_Id(Long userId);
    Optional<Photo> findByFileNameOrPath(String fileName, String path);
}
