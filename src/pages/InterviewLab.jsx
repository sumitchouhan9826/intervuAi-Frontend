import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Mic,
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import useInterviewStore from '@/store/useInterviewStore';
import interviewService from '@/services/interviewService';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'role', label: 'Role-based', icon: Users },
  { id: 'resume', label: 'Resume-based', icon: FileText },
  { id: 'jd', label: 'JD-based', icon: Briefcase },
];

const preparationTips = [
  'Research the company culture and recent initiatives',
  'Prepare STAR method examples for behavioral questions',
  'Practice speaking clearly with a timer running',
  'Review core data structures and algorithms',
  'Prepare thoughtful questions for the interviewer',
];

export default function InterviewLab() {
  const [activeTab, setActiveTab] = useState('role');
  const [jobRole, setJobRole] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setInterview = useInterviewStore((s) => s.setInterview);

  const handleGenerate = async () => {
    let payload = {};

    if (activeTab === 'role') {
      if (!jobRole.trim()) return toast.error('Please enter a job role.');
      payload = {
        type: 'role',
        jobRole: jobRole.trim(),
        experience: parseInt(experience) || 0,
      };
    } else if (activeTab === 'resume') {
      if (!resumeText.trim()) return toast.error('Please paste your resume.');
      payload = { type: 'resume', resumeText: resumeText.trim() };
    } else {
      if (!jdText.trim())
        return toast.error('Please paste the job description.');
      payload = { type: 'jd', jdText: jdText.trim() };
    }

    setLoading(true);
    try {
      const { data } = await interviewService.generateInterview(payload);
      setInterview(data);
      toast.success('Interview generated!');
      navigate(`/interview/${data._id || data.id || 'session'}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate.');
    } finally {
      setLoading(false);
    }
  };

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
          Start New Session
        </h1>
        <p className="text-muted mt-1.5 text-sm">
          Configure your interview parameters and let our AI generate
          personalized questions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Card */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-foreground border-b-2 border-accent bg-accent/5'
                      : 'text-muted hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">
              {/* Role-based Tab */}
              {activeTab === 'role' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Job Role
                    </label>
                    <input
                      type="text"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. Senior Frontend Developer"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Experience (Years)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 5"
                        min="0"
                        max="30"
                        className="w-full border border-border rounded-lg px-4 py-2.5 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">
                        Years
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resume-based Tab */}
              {activeTab === 'resume' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Resume Content
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    rows={8}
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
                  />
                </div>
              )}

              {/* JD-based Tab */}
              {activeTab === 'jd' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Job Description
                  </label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={8}
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
                  />
                </div>
              )}

              {/* AI Personalization Card */}
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    AI Personalization Engine
                  </h4>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    Our AI adapts questions to your specific experience level,
                    tech stack, and career goals for maximum interview readiness.
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-sm py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    Generate Questions
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar: Tips + Feature Card */}
        <motion.div variants={fadeInUp} className="space-y-5">
          {/* Pro Preparation Tips */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Pro Preparation Tips
            </h3>
            <ul className="space-y-3">
              {preparationTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real-time Coaching Card */}
          <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Real-time coaching
                </h4>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Get instant feedback on your answers with AI-powered analysis of
              content quality, communication style, and technical accuracy.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] text-accent font-medium">
                Pro Feature
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
