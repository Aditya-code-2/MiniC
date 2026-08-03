package com.achiles.e_com.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.achiles.e_com.entity.Address;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
  
    List<Address> findByUserId(Long userId);
    
}
