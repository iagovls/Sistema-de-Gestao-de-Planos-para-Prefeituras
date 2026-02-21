package com.planmanager.www.model.orgaos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrgaoGestorDTO(
    Long id,
    @NotBlank(message = "Title is mandatory")
    @Size(min = 2, message = "Title must be at least 2 characters")
    String titulo,
    @NotNull(message = "Prefeitura ID is mandatory")
    Long prefeituraId
) {

}
