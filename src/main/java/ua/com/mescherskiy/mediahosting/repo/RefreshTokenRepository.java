package ua.com.mescherskiy.mediahosting.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import ua.com.mescherskiy.mediahosting.models.RefreshToken;
import ua.com.mescherskiy.mediahosting.models.User;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser_Id(Long userId);

//    @Modifying
//    int deleteByUser(User user);

    void deleteByUserId(Long userId);

    @Modifying
    void deleteByUser(User user);

    @Modifying
    void deleteByToken(String token);
}
