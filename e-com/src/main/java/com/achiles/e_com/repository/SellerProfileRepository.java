package com.achiles.e_com.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;
import com.achiles.e_com.entity.SellerProfile;
@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findByUserId(Long userId);
    List<SellerProfile> findByStatus(SellerProfile.Status status);

    Optional<SellerProfile> findByGstNumber(String gstNumber);
    List<SellerProfile> findByPincode(String pincode);
    List<SellerProfile> findByCity(String city);
    boolean existsByUserId(Long userId);
    boolean existsByGstNumber(String gstNumber);
    boolean existsByAccountNumber(String accountNumber);
}
