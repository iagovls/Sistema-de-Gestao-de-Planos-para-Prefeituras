package com.planmanager.www.model.propostas.dto;

import java.util.Date;


import com.planmanager.www.model.propostas.StatusProposta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PropostaRequestDTO(
    

    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, message = "Title must be at least 3 characters")
    String titulo,
    Date meta,
    StatusProposta status,
    Long planoId,
    Long eixoId,
    Long categoriaId,
    Long orgaoGestorId,
    String motivo,
    Long prefeituraId
) {}
