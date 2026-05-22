import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { User, Mail, Calendar, FileText, BarChart3, Clock, Award } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';

export default function Profile() {
  const { user } = useUser();
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8 max-w-4xl">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted mt-1">Manage your account and view your progress.</p>
      </motion.div>

      {/* User Card */}
      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-8">
        <div className="flex items-center gap-6">
          <img src={user?.imageUrl} alt="Profile" className="w-20 h-20 rounded-full border-2 border-border" />
          <div>
            <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-muted flex items-center gap-2 mt-1"><Mail className="w-4 h-4" /> {user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-muted flex items-center gap-2 mt-1"><Calendar className="w-4 h-4" /> Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: '42', icon: BarChart3, color: 'bg-blue-50 text-blue-600' },
          { label: 'Hours Practiced', value: '18.5h', icon: Clock, color: 'bg-accent-light text-accent' },
          { label: 'Avg Score', value: '84%', icon: Award, color: 'bg-green-50 text-green-600' },
          { label: 'Resumes', value: '3', icon: FileText, color: 'bg-purple-50 text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Saved Resumes */}
      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Saved Resumes</h3>
        <div className="space-y-3">
          {['Resume_2024_SWE.pdf', 'Resume_PM_Google.pdf', 'Resume_Frontend.pdf'].map((name, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border-light last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent-light rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-accent" /></div>
                <div><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted">Uploaded Oct {20 + i}, 2024</p></div>
              </div>
              <button className="text-sm text-accent hover:underline">View Analysis</button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
