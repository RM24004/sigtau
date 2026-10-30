package com.sigtau.sigtau.dto;
import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
