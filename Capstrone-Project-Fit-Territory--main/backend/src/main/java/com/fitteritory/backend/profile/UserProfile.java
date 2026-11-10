
package com.fitteritory.backend.profile;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private Long id;

    private String name;
    private String bio;
    private String fitnessGoal;
    private String experienceLevel;

    public UserProfile() {
    }

    public UserProfile(Long id, String name, String bio,
                       String fitnessGoal, String experienceLevel) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.fitnessGoal = fitnessGoal;
        this.experienceLevel = experienceLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(String fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
}
