package com.planmanager.www.model.users.dto;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordMailDTO(
    @NotBlank(message = "O e-mail é obrigatório")
    String email
    
    
    
    ) {

}
