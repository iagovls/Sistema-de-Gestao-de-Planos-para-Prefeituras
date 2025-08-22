package com.planmanager.www.model.propostas.dto;

import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PropostaGetDTO(
    Long id,
    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, message = "Title must be at least 3 characters")
    String titulo,
    Date meta,
    String status,
    String plano,
    String eixo,
    String categoria,
    String orgaoGestor,
    String motivo,
    Long prefeituraId
) {

}
