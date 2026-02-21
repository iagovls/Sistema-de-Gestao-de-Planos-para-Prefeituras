package com.planmanager.www.model.users;

public enum UserRole {
    MASTER("master"),ADMIN("admin"), USER("user");
    private final String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return this.role;
    }
}
