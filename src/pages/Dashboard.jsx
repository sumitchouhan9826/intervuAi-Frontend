import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Briefcase,
  ArrowRight,
  FlaskConical,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import interviewService from '@/services/interviewService';
import userService from '@/services/userService';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useUser();
  const firstName = user?.firstName || 'Candidate';
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalHours: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [activityRes, statsRes] = await Promise.all([
          userService.getActivity(),
          interviewService.getStats()
        ]);
        if (activityRes.data && activityRes.data.success) {
          setActivities(activityRes.data.data || []);
        }
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'role': return Users;
      case 'resume': return FileText;
      case 'jd': return Briefcase;
      case 'resume_analysis': return FileText;
      case 'jd_analysis': return Briefcase;
      default: return FlaskConical;
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8 animate-fade-in"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          Welcome back, {firstName}. <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-muted mt-1.5 text-sm">
          Your dynamic AI-powered diagnostic cockpit is fully active. Choose your path below to begin training.
        </p>
      </motion.div>

      {/* Quick Start Cards */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          🚀 Quick Start Drills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Role & Experience Card */}
          <Link to="/interview-lab" className="group">
            <div className="bg-white border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/50 transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  Role &amp; Experience
                </h3>
                <p className="text-muted text-xs mt-1.5 leading-relaxed">
                  Generate hyper-realistic, dynamic technical and behavioral interview questions tailored to any custom job role.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-4 group-hover:gap-2 transition-all">
                Launch Drills <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Resume Upload Card */}
          <Link to="/resume" className="group">
            <div className="bg-white border border-border rounded-xl p-6 hover:shadow-md hover:border-accent/50 transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-accent">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  Resume Analysis
                </h3>
                <p className="text-muted text-xs mt-1.5 leading-relaxed">
                  Upload your resume for real-time ATS scoring, skill gaps extraction, and personalized AI-generated interview prep.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent mt-4 group-hover:gap-2 transition-all">
                Analyze Resume <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Job Description Card (Inverted) */}
          <Link to="/jd-analyzer" className="group">
            <div className="bg-white border border-border rounded-xl p-6 hover:shadow-md hover:border-accent/50 transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-accent">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm">Job Description Matching</h3>
                <p className="text-muted text-xs mt-1.5 leading-relaxed">
                  Paste any job description to instantly map key competencies, calculate profile compatibility, and identify missing skills.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent mt-4 group-hover:gap-2 transition-all">
                Analyze Job Description <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              ⚡ Recent Activity Logs
            </h2>
            <Link
              to="/session-history"
              className="text-xs text-accent font-semibold hover:text-accent/80 transition-colors"
            >
              View All History
            </Link>
          </div>
          <div className="bg-white border border-border rounded-xl divide-y divide-border-light overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-muted text-xs font-medium">Syncing activity logs...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-16 px-4">
                <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3" />
                <h3 className="font-semibold text-foreground text-sm">No activity recorded yet</h3>
                <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                  Ready to start? Upload your resume or configure parameters in the Interview Lab to launch your first MERN-driven diagnostic drill!
                </p>
              </div>
            ) : (
              activities.map((item) => {
                const Icon = getIcon(item.type);
                const dateText = new Date(item.createdAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) + ' · ' + new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type.includes('resume') ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-muted mt-0.5">
                        {dateText} {item.duration ? `· ${item.duration}` : ''}
                      </p>
                    </div>
                    {item.score !== null && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                          {item.score}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Practice Metrics */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-accent" /> Practice Metrics
          </h2>
          <div className="bg-white border border-border rounded-xl p-6 space-y-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="border border-border-light rounded-xl p-4 bg-secondary/10">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Total Drills</span>
                <p className="text-3xl font-extrabold text-foreground mt-1.5">{stats.totalSessions}</p>
              </div>
              <div className="border border-border-light rounded-xl p-4 bg-secondary/10">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Hours Practiced</span>
                <p className="text-3xl font-extrabold text-foreground mt-1.5">{stats.totalHours || 0}</p>
              </div>
            </div>
            
            <div className="border border-border rounded-xl p-5 text-center bg-gradient-to-br from-accent/5 to-accent/15">
              <span className="text-xs text-muted block font-semibold mb-1">Average Score</span>
              <p className="text-5xl font-black text-accent">{stats.averageScore || 0}%</p>
            </div>

            <div className="text-xs text-muted leading-relaxed text-center italic bg-secondary/15 rounded-lg p-3 border border-border-light">
              "Consistency is the key to mastering mock technical interviews. Keep reviewing past sessions!"
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
