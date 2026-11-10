
package com.fitteritory.backend.profile;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository
        extends JpaRepository<UserProfile, Long> {
}
