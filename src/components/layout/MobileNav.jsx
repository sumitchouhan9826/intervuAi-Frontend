import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  FlaskConical,
  User,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/session-history', icon: Clock, label: 'History' },
  { to: '/interview-lab', icon: FlaskConical, label: 'Lab' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border z-30 lg:hidden flex items-center justify-around px-2">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-[52px]',
              isActive ? 'text-accent' : 'text-muted'
            )
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
