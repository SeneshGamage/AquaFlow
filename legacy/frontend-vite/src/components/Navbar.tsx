import { Fish, LogOut, Menu, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

type LinkItem = { to: string; label: string };

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const links: LinkItem[] = useMemo(() => {
    const role = user?.role;
    if (role === 'OWNER') {
      return [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/inventory', label: 'Inventory' },
        { to: '/orders', label: 'Orders' },
        { to: '/shipments', label: 'Shipments' },
      ];
    }
    if (role === 'SUPPLIER') {
      return [
        { to: '/orders/my', label: 'My Orders' },
        { to: '/shipments', label: 'Shipments' },
      ];
    }
    return [
      { to: '/fish', label: 'Fish Catalog' },
      { to: '/orders/my', label: 'My Orders' },
      { to: '/shipments/my', label: 'My Shipments' },
    ];
  }, [user?.role]);

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            <span className="font-semibold">AquaFlow</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.name ?? 'User'}</div>
              <div className="text-xs text-slate-300">
                <span className="inline-flex rounded-full bg-white/10 px-2 py-0.5">
                  {user?.role ?? ''}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg bg-white/10 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
              <button
                onClick={onLogout}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

