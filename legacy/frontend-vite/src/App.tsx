import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));

const OwnerDashboard = lazy(() => import('@/pages/owner/Dashboard'));
const OwnerInventory = lazy(() => import('@/pages/owner/Inventory'));
const OwnerOrders = lazy(() => import('@/pages/owner/Orders'));
const OwnerShipments = lazy(() => import('@/pages/owner/Shipments'));

const FishCatalog = lazy(() => import('@/pages/buyer/FishCatalog'));
const MyOrders = lazy(() => import('@/pages/buyer/MyOrders'));
const MyShipments = lazy(() => import('@/pages/buyer/MyShipments'));

const queryClient = new QueryClient();

function Spinner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {children}
    </div>
  );
}

function HomeRedirect() {
  const { user } = useAuthStore();
  const role = user?.role;
  if (role === 'OWNER') return <Navigate to="/dashboard" replace />;
  if (role === 'SUPPLIER') return <Navigate to="/orders/my" replace />;
  return <Navigate to="/fish" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomeRedirect />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <AppLayout>
                    <OwnerDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <AppLayout>
                    <OwnerInventory />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <AppLayout>
                    <OwnerOrders />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <AppLayout>
                    <OwnerShipments />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fish"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <AppLayout>
                    <FishCatalog />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/my"
              element={
                <ProtectedRoute allowedRoles={['BUYER', 'SUPPLIER']}>
                  <AppLayout>
                    <MyOrders />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/my"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <AppLayout>
                    <MyShipments />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

