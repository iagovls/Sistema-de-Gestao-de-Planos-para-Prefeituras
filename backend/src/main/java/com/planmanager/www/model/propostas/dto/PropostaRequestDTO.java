package com.planmanager.www.model.propostas.dto;

import java.util.Date;


import com.planmanager.www.model.propostas.StatusProposta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PropostaRequestDTO(
    

    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, message = "Title must be at least 3 characters")
    String titulo,

    Date meta,

    @NotNull(message = "Status is mandatory")
    StatusProposta status,
    
    Boolean ativa,
    
    @NotNull(message = "Plano is mandatory")
    int planoId,
    
    @NotNull(message = "Eixo is mandatory")
    int eixoId,
    
    @NotNull(message = "Categoria is mandatory")
    int categoriaId,
    
    @NotNull(message = "OrgaoGestor is mandatory")
    int orgaoGestorId,
    
    @NotBlank(message = "Motivo is mandatory")
    @Size(min = 10, message = "Motivo must be at least 10 characters")
    String motivo,
    
    
    Boolean metaPermanente,

    
    
    @NotNull(message = "Prefeitura is mandatory")
    int prefeituraId
) {}
