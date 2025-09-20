package com.taskmanager.taskmanagerbackend.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
}
