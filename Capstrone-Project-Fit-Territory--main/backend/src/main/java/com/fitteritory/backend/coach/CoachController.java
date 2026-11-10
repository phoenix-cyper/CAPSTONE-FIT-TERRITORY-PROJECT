
package com.fitteritory.backend.coach;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/coach")
public class CoachController {

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, Object> request) {

        String message = String.valueOf(
            request.getOrDefault("message", "")
        ).toLowerCase();

        String goal = String.valueOf(
            request.getOrDefault("goal", "general fitness")
        );

        String level = String.valueOf(
            request.getOrDefault("level", "beginner")
        );

        String duration = String.valueOf(
            request.getOrDefault("duration", "30 minutes")
        );

        String reply;

        if (message.contains("diet")
                || message.contains("food")
                || message.contains("nutrition")
                || message.contains("meal")) {

            reply = "Nutrition tip: Include protein-rich foods, "
                  + "vegetables, fruits, and whole grains in your meals. "
                  + "Drink enough water and maintain balanced portions. "
                  + "Adjust your diet to your individual needs.";

        } else if (message.contains("workout")
                || message.contains("exercise")
                || message.contains("training")
                || message.contains("gym")) {

            reply = "Workout suggestion for your goal: " + goal
                  + ". Level: " + level
                  + ". Duration: " + duration
                  + ". Start with a warm-up, do suitable exercises "
                  + "with proper form, and finish with a cool-down. "
                  + "Rest when needed.";

        } else {
            reply = "Welcome to FitTerritory AI Coach! "
                  + "Your current goal is " + goal
                  + " and your level is " + level
                  + ". I can help with workout ideas, nutrition tips, "
                  + "and fitness habits. Try asking: "
                  + "'Suggest a workout' or 'Give me nutrition tips'.";
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", reply);

        return response;
    }
}
