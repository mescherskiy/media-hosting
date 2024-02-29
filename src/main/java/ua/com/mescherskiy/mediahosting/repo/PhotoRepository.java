package ua.com.mescherskiy.mediahosting.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import ua.com.mescherskiy.mediahosting.models.Photo;
import ua.com.mescherskiy.mediahosting.models.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    Set<Photo> findAllByUser(User user);
    Set<Photo> findAllByUserId(Long userId);
    Set<Photo> findAllByUser_Email(String email);

    Set<Photo> findAllByUser_EmailOrderByUploadDateDesc(String email);
    void deleteById (Long id);

    @Modifying
    void deleteAllByUser_Email(String email);
    Optional<Photo> findByUser(User user);
    Optional<Photo> findByUser_Id(Long userId);
    Optional<Photo> findByFileNameOrPath(String fileName, String path);
    Set<Photo> findByIdInAndUser(Set<Long> ids, User user);
}
