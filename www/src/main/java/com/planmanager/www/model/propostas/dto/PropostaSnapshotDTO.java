package com.planmanager.www.model.propostas.dto;

import java.util.Date;

import com.planmanager.www.model.propostas.StatusProposta;

public record PropostaSnapshotDTO(
    Long id, 
    String titulo, 
    Date meta, 
    String planoTitulo,
    String eixoTitulo,
    String categoriaTitulo,
    String orgaoGestorTitulo,
    StatusProposta status, 
    String motivo,
    Boolean metaPermanente,
    String modificadoPor,
    Date dataModificacao
    ) {}

    


