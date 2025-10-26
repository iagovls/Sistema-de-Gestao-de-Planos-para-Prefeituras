package com.planmanager.www.services;

import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private String fromAddress = "contato@monitoramentocmdca.com.br";

    public void sendResetPasswordEmail(String userName, String to, String token)
            throws MessagingException, IOException, InterruptedException {
        String resetLink = "https://monitoramentocmdca.com.br/conta/cadastrar-senha?token=" + token;

        // Compilar MJML em tempo real → HTML
        Path htmlFile = Path.of("www/src/main/resources/email-templates/reset-password-mail.html");


        

        // Ler HTML gerado e substituir variáveis
        String htmlContent = Files.readString(htmlFile)
                           .replace("{{RESET_LINK}}", resetLink)
                           .replace("{{USER_NAME}}", userName); // Assumindo que você tenha um placeholder {{USER_NAME}}



        // Criar e enviar e-mail HTML
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(fromAddress);
        helper.setTo(to);
        helper.setSubject("Redefinição de senha");
        helper.setText(htmlContent, true); // true = HTML

        mailSender.send(mimeMessage);
    }
}
