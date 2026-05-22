import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Briefcase,
  ArrowRight,
  FlaskConical,
  // Clock,
  CheckCircle2,
} from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
// } from 'recharts';
import { fadeInUp, staggerContainer } from '@/animations/variants';

// const performanceData = [
//   { name: 'Week 1', score: 65, avg: 55 },
//   { name: 'Week 2', score: 72, avg: 58 },
//   { name: 'Week 3', score: 68, avg: 60 },
//   { name: 'Week 4', score: 85, avg: 62 },
//   { name: 'Week 5', score: 78, avg: 63 },
//   { name: 'Week 6', score: 92, avg: 65 },
// ];

const recentActivity = [
  {
    id: 1,
    title: 'Senior Frontend Developer — React',
    date: 'May 18, 2024',
    duration: '24 min',
    match: 92,
    icon: FlaskConical,
  },
  {
    id: 2,
    title: 'Full Stack Engineer — Node.js',
    date: 'May 16, 2024',
    duration: '18 min',
    match: 87,
    icon: FlaskConical,
  },
  {
    id: 3,
    title: 'System Design — Distributed Systems',
    date: 'May 14, 2024',
    duration: '32 min',
    match: 78,
    icon: FlaskConical,
  },
];

// const performanceScores = [
//   { label: 'Communication', grade: 'A+', color: 'text-accent' },
//   { label: 'Technical Accuracy', grade: 'B', color: 'text-warning' },
//   { label: 'Confidence', grade: 'A', color: 'text-success' },
// ];

export default function Dashboard() {
  const { user } = useUser();
  const firstName = user?.firstName || 'Alex';

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome back, {firstName}.
        </h1>
        <p className="text-muted mt-1.5 text-sm">
          Ready to sharpen your skills? Choose a path to start your session.
        </p>
      </motion.div>

      {/* Quick Start Cards */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Start
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Role & Experience Card */}
          <Link to="/interview-lab" className="group">
            <div className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 h-full">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Role &amp; Experience
              </h3>
              <p className="text-muted text-xs mt-1.5 leading-relaxed">
                Generate tailored questions based on your target role and
                experience level.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground mt-4 group-hover:gap-2 transition-all">
                Start Mode <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Resume Upload Card */}
          <Link to="/resume" className="group">
            <div className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 h-full">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Resume Upload
              </h3>
              <p className="text-muted text-xs mt-1.5 leading-relaxed">
                Upload your resume for AI-powered analysis and personalized
                interview prep.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-4 group-hover:gap-2 transition-all">
                Upload PDF <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Job Description Card (Inverted) */}
          <Link to="/jd-analyzer" className="group">
            <div className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 h-full">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Job Description</h3>
              <p className=" text-xs mt-1.5 leading-relaxed">
                Paste a job description to generate targeted questions matching
                the role requirements.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-4 group-hover:gap-2 transition-all">
                Paste JD <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
            <Link
              to="/session-history"
              className="text-xs text-accent font-medium hover:text-accent/80 transition-colors"
            >
              View All History
            </Link>
          </div>
          <div className="bg-white border border-border rounded-xl divide-y divide-border-light">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {item.date} · {item.duration}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    {item.match}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Card */}
        {/* <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Performance
          </h2>
          <div className="bg-white border border-border rounded-xl p-5">
            <div className="h-44 mb-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} barSize={14} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: '1px solid #E5E7EB',
                    }}
                  />
                  <Bar dataKey="score" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avg" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {performanceScores.map((score) => (
                <div
                  key={score.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-muted">{score.label}</span>
                  <span className={`text-sm font-bold ${score.color}`}>
                    {score.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div> */}
      </div>
    </motion.div>
  );
}
