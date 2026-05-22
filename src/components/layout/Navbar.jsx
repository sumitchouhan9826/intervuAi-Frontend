import { NavLink } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import useUIStore from '@/store/useUIStore';

const navTabs = [
  { label: 'Practice', to: '/dashboard' },
  { label: 'Insights', to: '/session-history' },
  { label: 'Resources', to: '/interview-lab' },
];

export default function Navbar() {
  const { user } = useUser();
  const { theme, setTheme, toggleSidebar, searchQuery, setSearchQuery } =
    useUIStore();

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-white border-b border-border z-20 flex items-center px-4 lg:px-6 gap-10">
      {/* Mobile Hamburger */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-1.5 rounded-md hover:bg-secondary cursor-pointer"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Nav Tabs */}
      <nav className="hidden md:flex items-center gap-1">
        {navTabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors',
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted hover:text-foreground'
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-secondary border border-gray-600 rounded-lg px-3 py-1.5 w-56">
        <Search className="w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
      </div>

      {/* Bell */}
      <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
        <Bell className="w-[18px] h-[18px] text-muted" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
      >
        {theme === 'light' ? (
          <Moon className="w-[18px] h-[18px] text-muted" />
        ) : (
          <Sun className="w-[18px] h-[18px] text-muted" />
        )}
      </button>

      
      {/* User Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm">
            {user?.firstName?.[0] || 'U'}
          </div>
        )}
      </div>
    </header>
  );
}
