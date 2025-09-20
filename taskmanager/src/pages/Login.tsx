// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function doLogin() {
    const res = await api.post<{ token: string }>('/auth/login', { email, password });
    if (!res?.token) throw new Error('Server did not return a token');
    setAuthToken(res.token);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) Try normal login
      await doLogin();
      navigate('/dashboard');
    } catch (err: any) {
      const msg = (err?.message ?? '') as string;

      // 2) If 401, auto-register then login again
      if (msg.startsWith('HTTP 401')) {
        try {
          await api.post('/auth/register', { email, password });
          await doLogin();
          navigate('/dashboard');
          return;
        } catch (regErr: any) {
          setError(regErr?.message || 'Sign up failed');
          return;
        }
      }

      // Other errors
      setError(msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-[var(--card)] rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Welcome back</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-800 p-2 outline-none border border-slate-700"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-800 p-2 outline-none border border-slate-700"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition rounded-xl py-2 font-medium"
        >
          {loading ? 'Signing in…' : 'Sign in / Create account'}
        </button>

        <p className="text-center text-sm text-slate-400">
          No account? We’ll auto-create one on first login.
        </p>
      </form>
    </div>
  );
}
