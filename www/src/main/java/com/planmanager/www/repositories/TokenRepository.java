package com.planmanager.www.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.passwordToken.PasswordResetToken;

public interface TokenRepository extends JpaRepository<PasswordResetToken, String> {

    java.util.Optional<PasswordResetToken> findByToken(String token);

}
