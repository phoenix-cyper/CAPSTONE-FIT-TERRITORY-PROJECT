
package com.fitteritory.backend.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // User Registration
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {

        return authService.register(
                request.name(),
                request.email(),
                request.password()
        );
    }

    // User Login
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {

        return authService.login(
                request.email(),
                request.password()
        );
    }

    public record RegisterRequest(
            @NotBlank(message = "Name is required")
            String name,

            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email")
            String email,

            @NotBlank(message = "Password is required")
            @Size(min = 8, message = "Password must contain at least 8 characters")
            String password
    ) {}

    public record LoginRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email")
            String email,

            @NotBlank(message = "Password is required")
            String password
    ) {}
}
