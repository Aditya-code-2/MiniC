package com.achiles.e_com.repository;
import java.util.*;
import com.achiles.e_com.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);

    
    List<User> findByRole(User.Role role);

}
