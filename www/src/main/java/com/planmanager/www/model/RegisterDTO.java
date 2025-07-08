package com.planmanager.www.model;

public record RegisterDTO(String userName, String email, String password, UserRole role) {
}
