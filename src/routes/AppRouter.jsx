import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const SessionHistory = lazy(() => import('../pages/SessionHistory'));
const InterviewLab = lazy(() => import('../pages/InterviewLab'));
const InterviewSession = lazy(() => import('../pages/InterviewSession'));
const ResumeUpload = lazy(() => import('../pages/ResumeUpload'));
const JDAnalyzer = lazy(() => import('../pages/JDAnalyzer'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-muted text-sm font-medium">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><RedirectToSignIn /></SignedOut>
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/sign-in/*', element: <Suspense fallback={<LoadingFallback />}><SignInPage /></Suspense> },
      { path: '/sign-up/*', element: <Suspense fallback={<LoadingFallback />}><SignUpPage /></Suspense> },
    ],
  },
  {
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense> },
      { path: '/session-history', element: <Suspense fallback={<LoadingFallback />}><SessionHistory /></Suspense> },
      { path: '/interview-lab', element: <Suspense fallback={<LoadingFallback />}><InterviewLab /></Suspense> },
      { path: '/interview/:id', element: <Suspense fallback={<LoadingFallback />}><InterviewSession /></Suspense> },
      { path: '/resume', element: <Suspense fallback={<LoadingFallback />}><ResumeUpload /></Suspense> },
      { path: '/jd-analyzer', element: <Suspense fallback={<LoadingFallback />}><JDAnalyzer /></Suspense> },
      { path: '/profile', element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense> },
      { path: '/settings', element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
