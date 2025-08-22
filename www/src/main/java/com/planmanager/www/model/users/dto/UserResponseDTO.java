package com.planmanager.www.model.users.dto;

import com.planmanager.www.model.users.UserRole;

public record UserResponseDTO(String completeName, String email, UserRole role) {

}
