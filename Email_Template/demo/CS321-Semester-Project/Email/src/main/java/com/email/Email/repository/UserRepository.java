package com.email.Email.repository;

import com.email.Email.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer>{
    
}
