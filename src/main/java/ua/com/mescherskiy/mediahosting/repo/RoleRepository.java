package ua.com.mescherskiy.mediahosting.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.mescherskiy.mediahosting.models.ERole;
import ua.com.mescherskiy.mediahosting.models.Role;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName (ERole name);
}
