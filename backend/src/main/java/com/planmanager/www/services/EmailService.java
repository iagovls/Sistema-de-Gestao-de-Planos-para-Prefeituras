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
import java.util.List;

import com.planmanager.www.services.ResumoMensalPropostasService.ItemResumo;
import com.planmanager.www.services.ResumoMensalPropostasService.ResumoMensal;

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

    public void sendMonthlyProposalsSummaryEmail(
            String userName,
            String to,
            ResumoMensal resumo) throws MessagingException, IOException {
        ClassPathResource htmlResource = new ClassPathResource("email-templates/monthly-proposals-summary.html");
        String htmlTemplate = StreamUtils.copyToString(htmlResource.getInputStream(), StandardCharsets.UTF_8);
        String htmlContent = htmlTemplate
                .replace("{{USER_NAME}}", escapeHtml(userName))
                .replace("{{PREFEITURA_NAME}}", escapeHtml(resumo.getPrefeituraNome()))
                .replace("{{MES_REFERENCIA}}", escapeHtml(resumo.getMesReferencia()))
                .replace("{{SECTION_METAS_PERMANENTES}}", buildSection("Propostas com meta permanente", resumo.getMetasPermanentes()))
                .replace("{{SECTION_VENCIDAS}}", buildSection("Propostas vencidas", resumo.getVencidas()))
                .replace("{{SECTION_MENOS_1_MES}}", buildSection("Propostas com meta para vencer em menos de 1 mês", resumo.getMenosDeUmMes()))
                .replace("{{SECTION_1_3_MESES}}", buildSection("Propostas com meta para vencer em 1 a 3 meses", resumo.getUmATresMeses()))
                .replace("{{SECTION_3_6_MESES}}", buildSection("Propostas com meta para vencer em 3 a 6 meses", resumo.getTresASeisMeses()))
                .replace("{{SECTION_6_12_MESES}}", buildSection("Propostas com meta para vencer em 6 a 12 meses", resumo.getSeisADozeMeses()));

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(fromAddress);
        helper.setTo(to);
        helper.setSubject("Resumo mensal de propostas");
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
        logger.info("Resumo mensal enviado para {}", to);
    }

    private String buildSection(String title, List<ItemResumo> itens) {
        if (itens == null || itens.isEmpty()) {
            return "";
        }

        StringBuilder content = new StringBuilder();
        content.append("<h3 style=\"margin:24px 0 8px 0;color:#1f2937;\">")
                .append(escapeHtml(title))
                .append(" (")
                .append(itens.size())
                .append(")</h3>");
        content.append("<ul style=\"padding-left:20px;margin:0;\">");

        for (ItemResumo item : itens) {
            content.append("<li style=\"margin:8px 0;color:#374151;\">")
                    .append("<strong>")
                    .append(escapeHtml(item.getTitulo()))
                    .append("</strong>")
                    .append(" — Plano: ")
                    .append(escapeHtml(item.getPlanoTitulo()))
                    .append(" — Meta: ")
                    .append(escapeHtml(item.getMetaFormatada()))
                    .append("</li>");
        }

        content.append("</ul>");
        return content.toString();
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
