import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';

//public
import LandingPage from './pages/public/LandingPage';

// Layouts
import AdminLayout from './components/layout/AdminLayout';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import ManageAdmins from './pages/superadmin/ManageAdmins';
import AllTenants from './pages/superadmin/AllTenants';
import AllHouses from './pages/superadmin/AllHouses';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Houses from './pages/admin/Houses';
import Tenants from './pages/admin/Tenants';
import Maintenance from './pages/admin/Maintenance';
import WaterBilling from './pages/admin/WaterBilling';
import RentPayments from './pages/admin/RentPayments';

// Tenant Pages
import TenantDashboard from './pages/tenant/Dashboard';
import TenantMaintenance from './pages/tenant/Maintenance';
import TenantWaterBills from './pages/tenant/WaterBills';
import TenantRentHistory from './pages/tenant/RentHistory';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'super_admin') return <Navigate to="/superadmin/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/tenant/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* Super Admin */}
          <Route path="/superadmin" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminLayout role="super_admin" />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="admins" element={<ManageAdmins />} />
            <Route path="tenants" element={<AllTenants />} />
            <Route path="houses" element={<AllHouses />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout role="admin" />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="houses" element={<Houses />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="water" element={<WaterBilling />} />
            <Route path="rent" element={<RentPayments />} />
          </Route>

          {/* Tenant */}
          <Route path="/tenant" element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <AdminLayout role="tenant" />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<TenantDashboard />} />
            <Route path="maintenance" element={<TenantMaintenance />} />
            <Route path="water-bills" element={<TenantWaterBills />} />
            <Route path="rent-history" element={<TenantRentHistory />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
