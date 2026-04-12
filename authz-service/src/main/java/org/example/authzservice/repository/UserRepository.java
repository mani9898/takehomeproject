package org.example.authzservice.repository;

import org.example.authzservice.entity.MediaUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<MediaUser, Long> {
    Optional<MediaUser> findByUsername(String username);
}
