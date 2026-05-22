import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Clock,
  FlaskConical,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import useUIStore from '@/store/useUIStore';
import { slideIn } from '@/animations/variants';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/session-history', label: 'Session History', icon: Clock },
  { to: '/interview-lab', label: 'Interview Lab', icon: FlaskConical },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                IntervuAI
              </h1>
              <p className="text-[10px] text-muted tracking-wide uppercase">
                Pro-Grade Prep
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-secondary"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                    isActive
                      ? 'bg-secondary text-foreground font-medium border-l-2 border-accent ml-0'
                      : 'text-muted hover:bg-secondary hover:text-foreground'
                  )
                }
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-2">
        <button
          onClick={() => {
            navigate('/interview-lab');
            onClose?.();
          }}
          className="w-full bg-accent hover:bg-accent/90 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-colors duration-150 cursor-pointer"
        >
          Start New Session
        </button>

        <div className="border-t border-border-light pt-3 mt-3 space-y-1">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-muted hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer">
            <HelpCircle className="w-[18px] h-[18px]" />
            <span>Help Center</span>
          </button>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm text-muted hover:text-destructive hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 h-screen bg-white border-r border-border flex-col fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              {...slideIn}
              className="fixed left-0 top-0 w-72 h-screen bg-white z-50 lg:hidden shadow-xl"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
