package com.taskmanager.taskmanagerbackend.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    @GetMapping
    public ResponseEntity<?> ok() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
