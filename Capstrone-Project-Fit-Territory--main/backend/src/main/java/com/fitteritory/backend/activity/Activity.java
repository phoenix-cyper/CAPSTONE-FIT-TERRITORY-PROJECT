
package com.fitteritory.backend.activity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String activityType;
    private double distanceKm;
    private int durationMinutes;
    private int calories;
    private String activityDate;

    // Additional tracker fields
    private String activityMode;

    @Lob
    private String gpsRouteJson;

    @Lob
    private String workoutDetailsJson;

    private double averagePaceSecondsPerKm;

    public Activity() {
    }

    public Activity(String activityType, double distanceKm,
                    int durationMinutes, int calories,
                    String activityDate) {
        this.activityType = activityType;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.calories = calories;
        this.activityDate = activityDate;
    }

    public Long getId() { return id; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public String getActivityDate() { return activityDate; }
    public void setActivityDate(String activityDate) { this.activityDate = activityDate; }

    public String getActivityMode() { return activityMode; }
    public void setActivityMode(String activityMode) { this.activityMode = activityMode; }

    public String getGpsRouteJson() { return gpsRouteJson; }
    public void setGpsRouteJson(String gpsRouteJson) { this.gpsRouteJson = gpsRouteJson; }

    public String getWorkoutDetailsJson() { return workoutDetailsJson; }
    public void setWorkoutDetailsJson(String workoutDetailsJson) { this.workoutDetailsJson = workoutDetailsJson; }

    public double getAveragePaceSecondsPerKm() { return averagePaceSecondsPerKm; }
    public void setAveragePaceSecondsPerKm(double averagePaceSecondsPerKm) {
        this.averagePaceSecondsPerKm = averagePaceSecondsPerKm;
    }
}
