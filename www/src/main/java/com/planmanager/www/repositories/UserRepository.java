package com.planmanager.www.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.users.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);
    User findByEmail(String email);
    
}


