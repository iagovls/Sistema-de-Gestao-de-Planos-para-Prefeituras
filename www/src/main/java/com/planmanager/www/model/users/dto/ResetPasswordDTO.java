package com.planmanager.www.model.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordDTO(
    
    @NotBlank(message = "O token é obrigatório")
    String token, 
    
    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, max = 20, message = "A senha deve ter entre 8 e 20 caracteres")
    String password, 
    @NotBlank(message = "A confirmação de senha é obrigatória")
    @Size(min = 8, max = 20, message = "A confirmação de senha deve ter entre 8 e 20 caracteres")
    String confirmPassword) {

}
