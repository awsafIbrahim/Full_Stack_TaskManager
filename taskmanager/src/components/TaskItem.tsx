import type { Task } from '../types/task';


export default function TaskItem({ task, onToggle, onDelete }: { task: Task, onToggle: () => void, onDelete: () => void }) {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-4 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={task.completed} onChange={onToggle} className="mt-1" />
        <div>
          <h3 className="font-medium">{task.title}</h3>
          {task.description && <p className="text-slate-300 text-sm">{task.description}</p>}
          {task.dueDate && <p className="text-slate-400 text-xs mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
        </div>
      </div>
      <button onClick={onDelete} className="text-sm bg-red-600 hover:bg-red-700 rounded-lg px-3 py-1">Delete</button>
    </div>
  )
}
