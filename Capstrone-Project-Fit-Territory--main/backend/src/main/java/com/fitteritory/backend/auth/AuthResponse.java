package com.fitteritory.backend.auth;

public record AuthResponse(
        String token,
        String name,
        String email,
        String role
) {
}