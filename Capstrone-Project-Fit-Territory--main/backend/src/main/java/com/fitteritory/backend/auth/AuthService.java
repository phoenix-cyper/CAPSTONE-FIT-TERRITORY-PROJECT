package com.fitteritory.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(
            String name,
            String email,
            String password) {

        if (name == null || name.isBlank()
                || email == null || email.isBlank()
                || password == null || password.length() < 8) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter a valid name, email and password of at least 8 characters"
            );
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        AppUser user = new AppUser(
                name.trim(),
                normalizedEmail,
                passwordEncoder.encode(password),
                Role.USER
        );

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public AuthResponse login(String email, String password) {

        if (email == null || password == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email and password are required"
            );
        }

        AppUser user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}