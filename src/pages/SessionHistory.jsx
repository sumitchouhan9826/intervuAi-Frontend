import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, Trash2, ChevronLeft, ChevronRight, Code2, FileText, Briefcase, MessageSquare } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';

const mockSessions = [
  { id: 1, title: 'Senior Frontend Engineer Drill', date: 'Oct 24, 2023 • 02:30 PM', type: 'Role', score: 88, duration: '45m 12s', icon: Code2 },
  { id: 2, title: 'Resume Optimization: Google L6', date: 'Oct 22, 2023 • 10:15 AM', type: 'Resume', score: 72, duration: '12m 45s', icon: FileText },
  { id: 3, title: 'JD Breakdown: Netflix Sr. PM', date: 'Oct 20, 2023 • 09:00 AM', type: 'JD', score: 94, duration: '22m 30s', icon: Briefcase },
  { id: 4, title: 'Behavioral Masterclass: Amazon LP', date: 'Oct 18, 2023 • 04:45 PM', type: 'Role', score: 65, duration: '58m 04s', icon: MessageSquare },
];

export default function SessionHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('All Types');
  const [sortBy, setSortBy] = useState('Newest First');

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Session History</h1>
          <p className="text-muted mt-1 max-w-2xl">Review your past performance, track improvement metrics, and revisit specific interview drills to sharpen your skills.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"><Filter className="w-4 h-4" /> Filter</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"><Download className="w-4 h-4" /> Export CSV</button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <span className="px-3 py-1 bg-accent-light text-accent text-xs font-medium rounded-full">All Time</span>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-muted">Total Sessions</p>
              <p className="text-3xl font-bold mt-1">42</p>
            </div>
            <div>
              <p className="text-sm text-muted">Hours Practiced</p>
              <p className="text-3xl font-bold mt-1">18.5</p>
            </div>
            <div>
              <p className="text-sm text-muted">Success Rate</p>
              <p className="text-3xl font-bold mt-1">84%</p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-primary text-primary-foreground rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-accent">Ready for more?</h3>
            <p className="text-sm text-gray-400 mt-2">Your mock scores have increased by 12% this week. Keep the momentum going with a technical drill.</p>
          </div>
          <button className="mt-4 px-4 py-2 bg-white text-primary text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors w-fit">New Session</button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-accent/20">
            <option>All Types</option><option>Role</option><option>Resume</option><option>JD</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-accent/20">
            <option>Newest First</option><option>Oldest First</option><option>Highest Score</option><option>Lowest Score</option>
          </select>
        </div>
        <p className="text-sm text-muted">Showing 42 sessions</p>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Session & Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Score</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Duration</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockSessions.map((session) => {
                const Icon = session.icon;
                return (
                  <tr key={session.id} className="border-b border-border-light hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${session.type === 'Role' ? 'bg-blue-50 text-blue-600' : session.type === 'Resume' ? 'bg-accent-light text-accent' : 'bg-purple-50 text-purple-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{session.title}</p>
                          <p className="text-sm text-muted">{session.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded border ${
                        session.type === 'Role' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                        session.type === 'Resume' ? 'border-teal-200 text-teal-700 bg-teal-50' :
                        'border-purple-200 text-purple-700 bg-purple-50'
                      }`}>{session.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${session.score}%` }} />
                        </div>
                        <span className="text-sm font-medium">{session.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{session.duration}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><Eye className="w-4 h-4 text-muted" /></button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-muted hover:text-destructive" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-secondary rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === currentPage ? 'bg-accent text-white' : 'hover:bg-secondary'}`} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
            <span className="px-2 text-muted">...</span>
            <button className="w-8 h-8 rounded-lg text-sm font-medium hover:bg-secondary" onClick={() => setCurrentPage(12)}>12</button>
            <button className="p-2 hover:bg-secondary rounded-lg"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-muted">Showing 1 to 10 of 42 sessions</p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 pt-8 pb-4 text-sm text-muted">
        <span>© 2024 IntervuAI</span>
        <span>•</span><a href="#" className="hover:text-foreground">Privacy Policy</a>
        <span>•</span><a href="#" className="hover:text-foreground">Terms of Service</a>
        <span>•</span><span className="flex items-center gap-1"><span className="w-2 h-2 bg-success rounded-full" /> Systems Operational</span>
        <span>•</span><a href="#" className="hover:text-foreground">Priority Support</a>
      </motion.footer>
    </motion.div>
  );
}
