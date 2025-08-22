package com.planmanager.www.model.users.dto;

import com.planmanager.www.model.users.UserRole;

public record RegisterDTO(String userName, String email, String password, UserRole role, Long prefeituraId) {
}
