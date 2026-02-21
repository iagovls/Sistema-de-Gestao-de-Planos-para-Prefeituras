package com.planmanager.www.model.categorias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
    @NotBlank(message = "O nome da categoria é obrigatório")
    @Size(min = 3, max = 100, message = "O nome da categoria deve ter entre 3 e 100 caracteres")
    String titulo,
    @NotNull(message = "A prefeitura é obrigatória")
    Long prefeituraId
) {

}
