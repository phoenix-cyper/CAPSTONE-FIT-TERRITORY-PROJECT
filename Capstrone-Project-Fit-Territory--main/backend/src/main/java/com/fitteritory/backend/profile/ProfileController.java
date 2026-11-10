
package com.fitteritory.backend.profile;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileRepository repository;

    public ProfileController(ProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public UserProfile getProfile() {
        return repository.findById(1L).orElseGet(() ->
            repository.save(new UserProfile(
                1L,
                "Jordan Lee",
                "Finding new paths, one step at a time.",
                "Build everyday energy",
                "Beginner"
            ))
        );
    }

    @PutMapping
    public UserProfile updateProfile(@RequestBody UserProfile input) {
        UserProfile profile = repository.findById(1L).orElseGet(() ->
            new UserProfile(
                1L,
                "Jordan Lee",
                "Finding new paths, one step at a time.",
                "Build everyday energy",
                "Beginner"
            )
        );

        if (input.getName() == null || input.getName().isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        profile.setName(input.getName().trim());
        profile.setBio(input.getBio() == null ? "" : input.getBio().trim());
        profile.setFitnessGoal(input.getFitnessGoal());
        profile.setExperienceLevel(input.getExperienceLevel());

        return repository.save(profile);
    }
}
