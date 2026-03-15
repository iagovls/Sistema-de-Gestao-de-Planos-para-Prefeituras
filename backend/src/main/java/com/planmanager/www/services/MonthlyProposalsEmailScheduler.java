package com.planmanager.www.services;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.planmanager.www.model.users.User;
import com.planmanager.www.repositories.UserRepository;
import com.planmanager.www.services.ResumoMensalPropostasService.ResumoMensal;

import jakarta.mail.MessagingException;

@Service
public class MonthlyProposalsEmailScheduler {

    private static final Logger logger = LoggerFactory.getLogger(MonthlyProposalsEmailScheduler.class);

    @Autowired
    private ResumoMensalPropostasService resumoMensalPropostasService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(
            cron = "${monthly.proposals.email.cron:0 0 8 1 * *}",
            zone = "${monthly.proposals.email.zone:America/Sao_Paulo}")
    public void enviarResumoMensal() {
        List<Integer> prefeituraIds = resumoMensalPropostasService.listarPrefeiturasComPropostasAtivas();
        logger.info("Iniciando envio mensal para {} prefeituras", prefeituraIds.size());

        for (Integer prefeituraId : prefeituraIds) {
            try {
                ResumoMensal resumo = resumoMensalPropostasService.gerarResumoPorPrefeitura(prefeituraId);
                if (resumo == null || !resumo.temConteudo()) {
                    logger.info("Prefeitura {} sem conteúdo para envio", prefeituraId);
                    continue;
                }

                List<User> destinatarios = userRepository.findByPrefeituraId(prefeituraId);
                if (destinatarios.isEmpty()) {
                    logger.warn("Prefeitura {} sem destinatários", prefeituraId);
                    continue;
                }

                for (User destinatario : destinatarios) {
                    String email = destinatario.getEmail();
                    if (email == null || email.isBlank()) {
                        continue;
                    }

                    try {
                        String nome = destinatario.getCompleteName();
                        emailService.sendMonthlyProposalsSummaryEmail(nome, email, resumo);
                    } catch (MessagingException | IOException | MailException e) {
                        logger.error("Falha ao enviar resumo para destinatário {} da prefeitura {}", email, prefeituraId, e);
                    }
                }

                logger.info("Envio mensal concluído para prefeitura {}", prefeituraId);
            } catch (Exception e) {
                logger.error("Falha no processamento da prefeitura {}", prefeituraId, e);
            }
        }
    }
}
