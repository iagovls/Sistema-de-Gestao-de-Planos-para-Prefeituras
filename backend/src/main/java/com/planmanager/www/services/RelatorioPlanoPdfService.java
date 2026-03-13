package com.planmanager.www.services;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import com.planmanager.www.model.planos.Plano;
import com.planmanager.www.repositories.PlanosRepository;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;

@Service
public class RelatorioPlanoPdfService {

    @Autowired
    private PlanosRepository planosRepository;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private ResourceLoader resourceLoader;

    public byte[] gerarRelatorioPorPlano(int planoId, int prefeituraId) {
        Plano plano = planosRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));

        if ((plano.getPrefeitura() == null || prefeituraId != plano.getPrefeitura().getId())) {
            throw new RuntimeException("Plano não pertence à prefeitura informada");
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("dataGeracao", new SimpleDateFormat("dd/MM/yyyy HH:mm").format(new Date()));
        parametros.put("planoId", plano.getId());
        parametros.put("prefeituraId", prefeituraId);

        Resource resource = resourceLoader.getResource("classpath:reports/relatorioPlano.jrxml");
        try (InputStream inputStream = resource.getInputStream();
                Connection connection = dataSource.getConnection()) {
            JasperReport jasperReport = JasperCompileManager.compileReport(inputStream);
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parametros, connection);
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException | IOException | SQLException e) {
            throw new RuntimeException("Erro ao gerar relatório PDF", e);
        }
    }
}
