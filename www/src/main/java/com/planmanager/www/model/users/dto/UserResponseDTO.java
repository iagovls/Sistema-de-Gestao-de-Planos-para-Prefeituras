package com.planmanager.www.model.users.dto;

import com.planmanager.www.model.users.UserRole;

public record UserResponseDTO(String id, String completeName, String email, UserRole role) {

}
