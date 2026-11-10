
package com.fitteritory.backend.activity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository
        extends JpaRepository<Activity, Long> {
}
