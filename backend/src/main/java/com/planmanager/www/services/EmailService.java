package com.planmanager.www.services;

import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    private String fromAddress = "contato@monitoramentocmdca.com.br";

    public void sendResetPasswordEmail(
            String userName,
            String to,
            String token)
            throws MessagingException, IOException {
        String resetLink = "https://monitoramentocmdca.com.br/conta/cadastrar-senha?token=" + token;
        ClassPathResource htmlResource = new ClassPathResource("email-templates/reset-password-mail.html");
        logger.info("Reset link gerado para envio de e-mail");
        logger.info("Template de e-mail encontrado: {}", htmlResource.exists());
        String htmlTemplate = StreamUtils.copyToString(htmlResource.getInputStream(), StandardCharsets.UTF_8);
        String htmlContent = htmlTemplate
                .replace("{{RESET_LINK}}", resetLink)
                .replace("{{USER_NAME}}", userName);
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(fromAddress);
        helper.setTo(to);
        helper.setSubject("Redefinição de senha");
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
        logger.info("E-mail de redefinição enviado para {}", to);
    }
}
