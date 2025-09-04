package com.planmanager.www.model.propostas.dto;

import java.util.Date;

import com.planmanager.www.model.categorias.CategoriaDTO;
import com.planmanager.www.model.eixos.EixoDTO;
import com.planmanager.www.model.orgaos.OrgaoGestorDTO;
import com.planmanager.www.model.planos.PlanoDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PropostaGetDTO(
    Long id,
    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, message = "Title must be at least 3 characters")
    String titulo,
    Date meta,
    String status,
    Boolean ativa,
    PlanoDTO plano,
    EixoDTO eixo,
    CategoriaDTO categoria,
    OrgaoGestorDTO orgaoGestor,
    String motivo,
    Boolean metaPermanente,
    Long prefeituraId
) {

}
