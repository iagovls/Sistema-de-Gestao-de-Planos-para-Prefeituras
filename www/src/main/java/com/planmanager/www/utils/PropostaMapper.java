package com.planmanager.www.utils;

import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.propostas.Categoria;
import com.planmanager.www.model.propostas.Eixo;
import com.planmanager.www.model.propostas.OrgaoGestor;
import com.planmanager.www.model.propostas.Plano;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.dto.PropostaRequestDTO;

public class PropostaMapper {

    public static Proposta toEntity(PropostaRequestDTO dto, Prefeitura prefeitura, Plano plano, Eixo eixo, Categoria categoria, OrgaoGestor orgaoGestor) {
        Proposta proposta = new Proposta();
        proposta.setTitulo(dto.titulo());
        proposta.setMeta(dto.meta());
        proposta.setStatus(dto.status());
        proposta.setPlano(plano != null ? plano : null);
        proposta.setEixo(eixo != null ? eixo : null);
        proposta.setCategoria(categoria != null ? categoria : null);
        proposta.setOrgaoGestor(orgaoGestor != null ? orgaoGestor : null);
        proposta.setMotivo(dto.motivo());
        proposta.setPrefeitura(prefeitura);
        return proposta;
    }
}
