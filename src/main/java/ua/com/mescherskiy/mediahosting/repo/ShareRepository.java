package ua.com.mescherskiy.mediahosting.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.mescherskiy.mediahosting.models.Share;
import ua.com.mescherskiy.mediahosting.models.User;

import java.util.Optional;

@Repository
public interface ShareRepository extends JpaRepository<Share, Long> {
    Optional<Share> findByUsername(String username);

    Optional<Share> findByKey(String key);

    boolean existsByKey(String key);
}
