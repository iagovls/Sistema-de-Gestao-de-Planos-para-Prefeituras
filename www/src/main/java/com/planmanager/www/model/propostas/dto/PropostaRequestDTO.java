package com.planmanager.www.model.propostas.dto;

import java.util.Date;

import com.planmanager.www.model.propostas.Categoria;
import com.planmanager.www.model.propostas.Eixo;
import com.planmanager.www.model.propostas.OrgaoGestor;
import com.planmanager.www.model.propostas.Plano;
import com.planmanager.www.model.propostas.StatusProposta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PropostaRequestDTO(
    

    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, message = "Title must be at least 3 characters")
    String titulo,
    Date meta,
    StatusProposta status,
    Plano plano,
    Eixo eixo,
    Categoria categoria,
    OrgaoGestor orgaoGestor,
    String motivo,
    Long prefeituraId
) {}
