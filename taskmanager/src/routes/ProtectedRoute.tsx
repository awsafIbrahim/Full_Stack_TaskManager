import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken } from '../lib/api';

export default function ProtectedRoute() {
  const loc = useLocation();
  const token = getAuthToken();
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}
