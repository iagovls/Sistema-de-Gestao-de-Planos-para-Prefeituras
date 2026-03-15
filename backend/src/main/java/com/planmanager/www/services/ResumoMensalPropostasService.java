package com.planmanager.www.services;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.StatusProposta;
import com.planmanager.www.repositories.PropostaRepository;

@Service
public class ResumoMensalPropostasService {

    private static final ZoneId BRASILIA_ZONE = ZoneId.of("America/Sao_Paulo");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("MM/yyyy");

    @Autowired
    private PropostaRepository propostaRepository;

    public List<Integer> listarPrefeiturasComPropostasAtivas() {
        return propostaRepository.findPrefeituraIdsWithPropostasAtivas();
    }

    public ResumoMensal gerarResumoPorPrefeitura(int prefeituraId) {
        List<Proposta> propostas = propostaRepository.findAtivasByPrefeituraId(prefeituraId);
        if (propostas.isEmpty()) {
            return null;
        }

        LocalDate hoje = LocalDate.now(BRASILIA_ZONE);
        String referencia = hoje.format(MONTH_FORMATTER);
        String prefeituraNome = propostas.get(0).getPlano().getPrefeitura().getName();

        List<ItemResumo> metasPermanentes = new ArrayList<>();
        List<ItemResumo> vencidas = new ArrayList<>();
        List<ItemResumo> menosDeUmMes = new ArrayList<>();
        List<ItemResumo> umATresMeses = new ArrayList<>();
        List<ItemResumo> tresASeisMeses = new ArrayList<>();
        List<ItemResumo> seisADozeMeses = new ArrayList<>();

        for (Proposta proposta : propostas) {
            if (Boolean.TRUE.equals(proposta.getMetaPermanente())) {
                metasPermanentes.add(toItem(proposta));
                continue;
            }

            if (proposta.getStatus() == StatusProposta.CONCLUIDA) {
                continue;
            }

            LocalDate meta = toLocalDate(proposta.getMeta());
            if (meta == null) {
                continue;
            }

            if (meta.isBefore(hoje)) {
                vencidas.add(toItem(proposta));
                continue;
            }

            if (meta.isBefore(hoje.plusMonths(1))) {
                menosDeUmMes.add(toItem(proposta));
            } else if (meta.isBefore(hoje.plusMonths(3))) {
                umATresMeses.add(toItem(proposta));
            } else if (meta.isBefore(hoje.plusMonths(6))) {
                tresASeisMeses.add(toItem(proposta));
            } else if (meta.isBefore(hoje.plusYears(1))) {
                seisADozeMeses.add(toItem(proposta));
            }
        }

        Comparator<ItemResumo> comparator = Comparator
                .comparing(ItemResumo::getMetaOrdenacao, Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(ItemResumo::getTitulo, String.CASE_INSENSITIVE_ORDER);

        metasPermanentes.sort(comparator);
        vencidas.sort(comparator);
        menosDeUmMes.sort(comparator);
        umATresMeses.sort(comparator);
        tresASeisMeses.sort(comparator);
        seisADozeMeses.sort(comparator);

        return new ResumoMensal(
                prefeituraId,
                prefeituraNome,
                referencia,
                metasPermanentes,
                vencidas,
                menosDeUmMes,
                umATresMeses,
                tresASeisMeses,
                seisADozeMeses);
    }

    private LocalDate toLocalDate(Date date) {
        if (date == null) {
            return null;
        }
        return date.toInstant().atZone(BRASILIA_ZONE).toLocalDate();
    }

    private ItemResumo toItem(Proposta proposta) {
        LocalDate meta = toLocalDate(proposta.getMeta());
        String metaFormatada = meta == null ? "Sem data" : meta.format(DATE_FORMATTER);
        String planoTitulo = proposta.getPlano() == null ? "Sem plano" : proposta.getPlano().getTitulo();
        return new ItemResumo(proposta.getTitulo(), planoTitulo, metaFormatada, meta);
    }

    public static class ItemResumo {
        private final String titulo;
        private final String planoTitulo;
        private final String metaFormatada;
        private final LocalDate metaOrdenacao;

        public ItemResumo(String titulo, String planoTitulo, String metaFormatada, LocalDate metaOrdenacao) {
            this.titulo = titulo;
            this.planoTitulo = planoTitulo;
            this.metaFormatada = metaFormatada;
            this.metaOrdenacao = metaOrdenacao;
        }

        public String getTitulo() {
            return titulo;
        }

        public String getPlanoTitulo() {
            return planoTitulo;
        }

        public String getMetaFormatada() {
            return metaFormatada;
        }

        public LocalDate getMetaOrdenacao() {
            return metaOrdenacao;
        }
    }

    public static class ResumoMensal {
        private final int prefeituraId;
        private final String prefeituraNome;
        private final String mesReferencia;
        private final List<ItemResumo> metasPermanentes;
        private final List<ItemResumo> vencidas;
        private final List<ItemResumo> menosDeUmMes;
        private final List<ItemResumo> umATresMeses;
        private final List<ItemResumo> tresASeisMeses;
        private final List<ItemResumo> seisADozeMeses;

        public ResumoMensal(
                int prefeituraId,
                String prefeituraNome,
                String mesReferencia,
                List<ItemResumo> metasPermanentes,
                List<ItemResumo> vencidas,
                List<ItemResumo> menosDeUmMes,
                List<ItemResumo> umATresMeses,
                List<ItemResumo> tresASeisMeses,
                List<ItemResumo> seisADozeMeses) {
            this.prefeituraId = prefeituraId;
            this.prefeituraNome = prefeituraNome;
            this.mesReferencia = mesReferencia;
            this.metasPermanentes = metasPermanentes;
            this.vencidas = vencidas;
            this.menosDeUmMes = menosDeUmMes;
            this.umATresMeses = umATresMeses;
            this.tresASeisMeses = tresASeisMeses;
            this.seisADozeMeses = seisADozeMeses;
        }

        public int getPrefeituraId() {
            return prefeituraId;
        }

        public String getPrefeituraNome() {
            return prefeituraNome;
        }

        public String getMesReferencia() {
            return mesReferencia;
        }

        public List<ItemResumo> getMetasPermanentes() {
            return metasPermanentes;
        }

        public List<ItemResumo> getVencidas() {
            return vencidas;
        }

        public List<ItemResumo> getMenosDeUmMes() {
            return menosDeUmMes;
        }

        public List<ItemResumo> getUmATresMeses() {
            return umATresMeses;
        }

        public List<ItemResumo> getTresASeisMeses() {
            return tresASeisMeses;
        }

        public List<ItemResumo> getSeisADozeMeses() {
            return seisADozeMeses;
        }

        public boolean temConteudo() {
            return !metasPermanentes.isEmpty()
                    || !vencidas.isEmpty()
                    || !menosDeUmMes.isEmpty()
                    || !umATresMeses.isEmpty()
                    || !tresASeisMeses.isEmpty()
                    || !seisADozeMeses.isEmpty();
        }
    }
}
