import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { Profile } from './pages/dashboard/Profile';
import { Credentials } from './pages/dashboard/Credentials';
import TimeCapsuleDashboard from './components/dashboard/TimeCapsuleDashboard';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import UseCases from './components/UseCases';
import Security from './components/Security';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const LandingPage: React.FC = () => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white bg-cyber-grid bg-[size:50px_50px] text-black"
    >
      <Header />
      <Hero />
      <HowItWorks />
      <UseCases />
      <Security />
      <Footer />
    </motion.div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen bg-white text-black">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: '!bg-white !text-black border border-gray-300 shadow-black',
            }}
          />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardHome />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/credentials"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Credentials />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/time-capsules"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <TimeCapsuleDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Suspense>
    </Router>
  );
};

export default App;