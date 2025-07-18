package com.planmanager.www.model.propostas.dto;

import java.util.Date;

import com.planmanager.www.model.propostas.Categoria;
import com.planmanager.www.model.propostas.Eixo;
import com.planmanager.www.model.propostas.Plano;
import com.planmanager.www.model.propostas.StatusProposta;

public record PropostaRequestDTO(
    String titulo,
    Date meta,
    StatusProposta status,
    Plano plano,
    Eixo eixo,
    Categoria categoria,
    String motivo,
    Long prefeituraId
) {}
