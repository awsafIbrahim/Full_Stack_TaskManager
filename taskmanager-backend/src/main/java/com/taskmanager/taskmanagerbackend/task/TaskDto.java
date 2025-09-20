package com.taskmanager.taskmanagerbackend.task;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDate dueDate;   // ✅ must match Task.java
    private String userEmail;

    public static TaskDto fromEntity(Task t) {
        TaskDto dto = new TaskDto();
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setDescription(t.getDescription());
        dto.setCompleted(t.isCompleted());
        dto.setDueDate(t.getDueDate());   // ✅ now compiles
        dto.setUserEmail(t.getUserEmail());
        return dto;
    }
}
