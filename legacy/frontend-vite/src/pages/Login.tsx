import { zodResolver } from '@hookform/resolvers/zod';
import { Fish } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { loginUser } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await loginUser(values.email, values.password);
      login(res.token, { name: res.name, email: res.email, role: res.role });

      if (res.role === 'OWNER') navigate('/dashboard');
      else if (res.role === 'SUPPLIER') navigate('/orders/my');
      else navigate('/fish');
    } catch (e: any) {
      setError('root', { message: e?.message ?? 'Login failed' });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-10">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Fish className="h-6 w-6" />
          AquaFlow
        </div>
        <div>
          <p className="text-3xl font-semibold leading-tight">Streamline your aquatic trade</p>
          <p className="mt-3 text-slate-300">
            Secure ordering, inventory, compliance-ready shipments — all in one place.
          </p>
        </div>
        <div className="text-xs text-slate-400">© {new Date().getFullYear()} AquaFlow</div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-600">Use your AquaFlow account credentials.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {errors.root?.message && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link className="font-medium text-slate-900 underline" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

