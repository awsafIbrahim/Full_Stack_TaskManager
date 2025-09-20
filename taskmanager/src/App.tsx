// src/App.tsx
import { Link, Navigate, useLocation } from 'react-router-dom'

export default function App() {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (token) return <Navigate to="/dashboard" state={{ from: location }} replace />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[var(--card)] rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-center">TaskMate</h1>
        <p className="text-slate-300 text-center">Cloud-Native Task Manager</p>
        <Link
          to="/login"
          className="block text-center bg-indigo-500 hover:bg-indigo-600 transition rounded-xl py-2 font-medium"
        >
          Sign in / Create account
        </Link>
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Frontend: React + TS · Router · React Query · Tailwind
      </p>
    </div>
  )
}
