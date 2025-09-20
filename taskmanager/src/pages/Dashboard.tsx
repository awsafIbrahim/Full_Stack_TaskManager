import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, setAuthToken } from '../lib/api';
import type { Task } from '../types/task';



export default function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // ---- queries & mutations ----
  const tasksQ = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get<Task[]>('/tasks'),
    retry: false,
  });

  const addM = useMutation({
    mutationFn: (body: Partial<Task>) => api.post<Task>('/tasks', body),
    onSuccess: () => {
      setTitle(''); setDesc(''); setDue('');
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleM = useMutation({
    mutationFn: (t: Task) => api.put<Task>(`/tasks/${t.id}`, { ...t, completed: !t.completed }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const delM = useMutation({
    mutationFn: (id: number) => api.del<void>(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // ---- local state for create form ----
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue]   = useState('');

  // ---- logout ----
  function doLogout() {
    setAuthToken(null);           // clears header + localStorage
    navigate('/login', { replace: true });
  }

  // ---- UI ----
  if (tasksQ.isLoading) return <div className="p-6">Loading…</div>;
  if (tasksQ.isError)   return (
    <div className="p-6 text-red-400">
      Failed to load tasks<br />
      {(tasksQ.error as Error).message}
      <div className="mt-3">
        <button className="px-3 py-1 rounded bg-slate-700" onClick={() => qc.invalidateQueries({ queryKey: ['tasks'] })}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with Logout */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Tasks</h1>
        <button
          onClick={doLogout}
          className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
        >
          Logout
        </button>
      </div>

      {/* Create task */}
      <div className="flex flex-wrap gap-3">
        <input
          className="flex-1 min-w-[200px] rounded-xl bg-slate-800 p-2 border border-slate-700"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="flex-[2] min-w-[240px] rounded-xl bg-slate-800 p-2 border border-slate-700"
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="date"
          className="rounded-xl bg-slate-800 p-2 border border-slate-700"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
          disabled={!title || addM.isPending}
          onClick={() => addM.mutate({ title, description: desc || undefined, dueDate: due || undefined })}
        >
          {addM.isPending ? 'Adding…' : 'Add Task'}
        </button>
      </div>

      {/* Task list */}
      {tasksQ.data!.length === 0 ? (
        <div className="text-slate-400">No tasks yet. Add your first task above.</div>
      ) : (
        <ul className="space-y-2">
          {tasksQ.data!.map((t) => (
            <li key={t.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleM.mutate(t)}
                />
                <div>
                  <div className={`font-medium ${t.completed ? 'line-through text-slate-400' : ''}`}>
                    {t.title}
                  </div>
                  {(t.description || t.dueDate) && (
                    <div className="text-sm text-slate-400">
                      {t.description || ''} {t.dueDate ? `• Due: ${t.dueDate}` : ''}
                    </div>
                  )}
                </div>
              </label>
              <button
                className="text-red-400 hover:text-red-300"
                onClick={() => delM.mutate(t.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
