package com.planmanager.www.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.planmanager.www.model.passwordToken.PasswordResetToken;
import com.planmanager.www.model.users.User;
import com.planmanager.www.repositories.TokenRepository;

@Service
public class PasswordResetTokenService {

    
    @Autowired
    private TokenRepository tokenRepository;
    
    

    public PasswordResetToken createToken(User user){
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpirationDateTime(LocalDateTime.now().plusHours(1));
        token.setUsed(false);
        return tokenRepository.save(token);
    }

    public boolean validateToken(String token) throws RuntimeException{
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElseThrow(() -> new RuntimeException("Token não encontrado"));
        if (resetToken.isUsed()){
            throw new RuntimeException("Token já foi utilizado");
        }
        if (resetToken.getExpirationDateTime().isBefore(LocalDateTime.now())){
            throw new RuntimeException("Token expirado");
        }
        return true;
    }

    public PasswordResetToken getByToken(String token){
        return tokenRepository.findByToken(token).orElseThrow(() -> new RuntimeException("Token não encontrado"));
    }

    public void markAsUsed(PasswordResetToken token){
        token.setUsed(true);
        tokenRepository.save(token);
    }
}
