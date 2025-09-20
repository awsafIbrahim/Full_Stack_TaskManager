package com.taskmanager.taskmanagerbackend.task;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepo;

    public TaskController(TaskRepository taskRepo) {
        this.taskRepo = taskRepo;
    }

    /** ✅ Get all tasks for logged-in user */
    @GetMapping
    public List<Task> list(Authentication authentication) {
        UserDetails user = (UserDetails) authentication.getPrincipal();
        return taskRepo.findByUserEmail(user.getUsername());
    }

    /** ✅ Add a new task */
    @PostMapping
    public Task create(@RequestBody Task task, Authentication authentication) {
        UserDetails user = (UserDetails) authentication.getPrincipal();
        task.setUserEmail(user.getUsername());
        return taskRepo.save(task);
    }

    /** ✅ Update a task */
    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task updatedTask, Authentication authentication) {
        UserDetails user = (UserDetails) authentication.getPrincipal();
        Task task = taskRepo.findById(id).orElseThrow();

        // Prevent cross-user updates
        if (!task.getUserEmail().equals(user.getUsername())) {
            throw new RuntimeException("Unauthorized");
        }

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setCompleted(updatedTask.isCompleted());
        return taskRepo.save(task);
    }

    /** ✅ Delete a task */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication authentication) {
        UserDetails user = (UserDetails) authentication.getPrincipal();
        Task task = taskRepo.findById(id).orElseThrow();

        if (!task.getUserEmail().equals(user.getUsername())) {
            throw new RuntimeException("Unauthorized");
        }

        taskRepo.delete(task);
    }
}
