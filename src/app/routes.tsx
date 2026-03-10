import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { HistoryTab } from './components/dashboard/HistoryTab';
import { UploadTab } from './components/dashboard/UploadTab';
import { ReportsTab } from './components/dashboard/ReportsTab';

/**
 * Protected layout — redirects to /login if no authenticated user found in localStorage.
 */
function ProtectedLayout() {
  const stored = localStorage.getItem('user');
  if (!stored) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    // Wrapper that enforces authentication
    element: <ProtectedLayout />,
    children: [
      {
        path: '/dashboard',
        Component: DashboardPage,
        children: [
          { index: true, Component: OverviewTab },
          { path: 'history', Component: HistoryTab },
          { path: 'upload', Component: UploadTab },
          { path: 'reports', Component: ReportsTab },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
