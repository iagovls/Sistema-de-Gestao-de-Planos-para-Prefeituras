package com.planmanager.www.model.categorias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoriaDTO(
    Long id,
    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, message = "Title must be at least 3 characters")
    String titulo,
    @NotNull(message = "Prefeitura ID is mandatory")

    Long prefeituraId
) {

}
