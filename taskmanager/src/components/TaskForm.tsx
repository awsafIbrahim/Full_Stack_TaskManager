import { useState } from 'react'
import type { Task } from '../types/task';


export default function TaskForm(
  { onSubmit, submitting }: { onSubmit: (data: Partial<Task>) => void; submitting?: boolean }
) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, description, dueDate: dueDate || undefined })
    setTitle(''); setDescription(''); setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="rounded-xl bg-slate-800 p-2 border border-slate-700"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="rounded-xl bg-slate-800 p-2 border border-slate-700"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-xl bg-slate-800 p-2 border border-slate-700"
        />
      </div>
      <button type="submit" disabled={submitting} className="bg-indigo-500 hover:bg-indigo-600 rounded-xl py-2 font-medium">
        {submitting ? 'Adding…' : 'Add Task'}
      </button>
    </form>
  )
}
