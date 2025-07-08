package com.planmanager.www.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);
    
}


