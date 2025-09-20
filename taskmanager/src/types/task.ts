// src/types/task.ts
export type Task = {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  completed: boolean;
};
