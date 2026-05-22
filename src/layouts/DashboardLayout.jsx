import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import { setTokenGetter } from '@/services/api';
import { pageTransition } from '@/animations/variants';

export default function DashboardLayout() {
  const { getToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar />
      <Navbar />

      <main className="lg:ml-60 pt-14 pb-20 lg:pb-6 min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
              transition={pageTransition.transition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
