package com.sigtau.sigtau.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Long roleId;
    private String roleName;
}
