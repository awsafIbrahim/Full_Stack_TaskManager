package com.taskmanager.taskmanagerbackend.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // ✅ Custom finder to load tasks by user email
    List<Task> findByUserEmail(String email);
}
