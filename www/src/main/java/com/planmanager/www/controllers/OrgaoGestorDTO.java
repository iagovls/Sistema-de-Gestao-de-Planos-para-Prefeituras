package com.planmanager.www.controllers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrgaoGestorDTO(
    @NotBlank(message = "Title is mandatory")
    String titulo,
    @NotNull(message = "Prefeitura ID is mandatory")
    Long prefeituraId
) {

}
