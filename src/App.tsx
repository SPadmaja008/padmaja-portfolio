import { useState, useEffect } from 'react';
import { Portfolio } from '@/components/public/Portfolio';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useAuth } from '@/lib/useAuth';

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

function App() {
  const route = useHashRoute();
  const { session, loading } = useAuth();
  const isAdmin = route.startsWith('#/admin');

  // Update document title dynamically
  useEffect(() => {
    if (isAdmin) {
      document.title = 'Admin Dashboard — Padmaja';
    } else {
      document.title = 'Padmaja | Developer Portfolio';
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAdmin) {
    return session ? <AdminDashboard /> : <AdminLogin />;
  }

  return <Portfolio />;
}

export default App;
