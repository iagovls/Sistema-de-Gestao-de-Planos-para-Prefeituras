package com.planmanager.www.model.prefeituras.dto;

import java.util.List;

import com.planmanager.www.model.categorias.CategoriaDTO;
import com.planmanager.www.model.eixos.EixoDTO;
import com.planmanager.www.model.orgaos.OrgaoGestorDTO;
import com.planmanager.www.model.planos.PlanoDTO;


public record PrefeituraDTO(
    Long id,
    String name,
    String logoPrefeitura,
    String logoCMDCA,
    List<PlanoDTO> planos,
    List<EixoDTO> eixos,
    List<CategoriaDTO> categorias,
    List<OrgaoGestorDTO> orgaosGestores

) {

}
