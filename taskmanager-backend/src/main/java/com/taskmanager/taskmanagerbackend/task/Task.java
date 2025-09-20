package com.taskmanager.taskmanagerbackend.task;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private boolean completed = false;

    // ✅ Associate task with user via email
    @Column(nullable = false)
    private String userEmail;

    // ✅ Add due date so TaskDto compiles
    private LocalDate dueDate;
}
