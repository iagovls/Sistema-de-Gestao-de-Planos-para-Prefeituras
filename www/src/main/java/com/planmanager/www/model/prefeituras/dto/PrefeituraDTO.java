package com.planmanager.www.model.prefeituras.dto;


public record PrefeituraDTO(
    Long id,
    String name,
    String logoPrefeitura,
    String logoCMDCA
    // List<PlanoDTO> planos,
    // List<EixoDTO> eixos,
    // List<CategoriaDTO> categorias,
    // List<OrgaoGestorDTO> orgaosGestores
) {

}
