package com.planmanager.www.utils;

import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.dto.PropostaRequestDTO;

public class PropostaMapper {

    public static Proposta toEntity(PropostaRequestDTO dto, Prefeitura prefeitura) {
        Proposta proposta = new Proposta();
        proposta.setTitulo(dto.titulo());
        proposta.setMeta(dto.meta());
        proposta.setStatus(dto.status());
        proposta.setPlano(dto.plano());
        proposta.setEixo(dto.eixo());
        proposta.setCategoria(dto.categoria());
        proposta.setOrgaoGestor(dto.orgaoGestor());
        proposta.setMotivo(dto.motivo());
        proposta.setPrefeitura(prefeitura);
        return proposta;
    }
}
