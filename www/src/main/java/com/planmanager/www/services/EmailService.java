package com.planmanager.www.services;

import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    private String fromAddress = "contato@monitoramentocmdca.com.br";

    public void sendResetPasswordEmail(String to, String token){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject("Redefinição de senha");
        message.setText("Clique no link abaixo para redefinir sua senha: https://monitoramentocmdca.com.br/conta/cadastrar-senha?token=" + token);
        mailSender.send(message);
    }
}
