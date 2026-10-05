import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const goHome = () => {
    const role = user?.role;
    if (role === 'OWNER') navigate('/dashboard');
    else if (role === 'SUPPLIER') navigate('/orders/my');
    else navigate('/fish');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-900 p-3 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Access Denied</h1>
            <p className="text-sm text-slate-600">You don&apos;t have permission to view this page.</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
          <button
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            onClick={goHome}
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}

