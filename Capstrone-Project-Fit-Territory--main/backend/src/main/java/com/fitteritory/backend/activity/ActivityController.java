
package com.fitteritory.backend.activity;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityRepository activityRepository;

    public ActivityController(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @GetMapping
    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Activity createActivity(@RequestBody Activity activity) {
        if (activity.getActivityType() == null
                || activity.getActivityType().isBlank()) {
            throw new IllegalArgumentException("Activity type is required");
        }

        if (activity.getDistanceKm() < 0
                || activity.getDurationMinutes() < 0
                || activity.getCalories() < 0) {
            throw new IllegalArgumentException(
                "Distance, duration, and calories cannot be negative"
            );
        }

        activity.setActivityType(activity.getActivityType().trim());

        if (activity.getActivityMode() == null
                || activity.getActivityMode().isBlank()) {
            activity.setActivityMode("OUTDOOR");
        }

        return activityRepository.save(activity);
    }
}
