import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Moon, Sun, Bell, Shield, ExternalLink } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import useUIStore from '../store/useUIStore';

export default function Settings() {
  const { user } = useUser();
  const { theme, setTheme } = useUIStore();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8 max-w-3xl">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted mt-1">Manage your preferences and account settings.</p>
      </motion.div>

      {/* Theme */}
      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Moon className="w-5 h-5" /> Appearance</h3>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium">Theme</p><p className="text-sm text-muted">Select your preferred theme</p></div>
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
            <button onClick={() => setTheme('light')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${theme === 'light' ? 'bg-card shadow-sm font-medium' : 'text-muted'}`}><Sun className="w-4 h-4" /> Light</button>
            <button onClick={() => setTheme('dark')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${theme === 'dark' ? 'bg-card shadow-sm font-medium' : 'text-muted'}`}><Moon className="w-4 h-4" /> Dark</button>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</h3>
        <div className="space-y-4">
          {['Email notifications for new features', 'Weekly progress summary', 'Interview reminders'].map((label, i) => (
            <div key={i} className="flex items-center justify-between">
              <p className="text-sm">{label}</p>
              <button className={`w-11 h-6 rounded-full transition-colors ${i === 0 ? 'bg-accent' : 'bg-gray-200'} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${i === 0 ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account */}
      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> Account</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div><p className="text-sm font-medium">Email</p><p className="text-sm text-muted">{user?.primaryEmailAddress?.emailAddress}</p></div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div><p className="text-sm font-medium">Account Management</p><p className="text-sm text-muted">Manage your Clerk account settings</p></div>
            <a href="https://accounts.clerk.dev" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-accent hover:underline">Manage <ExternalLink className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
