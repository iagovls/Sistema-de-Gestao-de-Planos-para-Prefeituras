package com.planmanager.www.model.orgaos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrgaoGestorRequestDTO(
    @NotBlank(message = "O nome do órgão gestor é obrigatório")
    @Size(min = 3, max = 100, message = "O nome do órgão gestor deve ter entre 3 e 100 caracteres")
    String titulo,
    @NotNull(message = "A prefeitura é obrigatória")
    Long prefeituraId
) {

}
