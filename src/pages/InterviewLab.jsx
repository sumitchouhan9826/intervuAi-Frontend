import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Users,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Mic,
  Upload,
  X,
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import useInterviewStore from '@/store/useInterviewStore';
import interviewService from '@/services/interviewService';
import resumeService from '@/services/resumeService';
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
  const [resumeFile, setResumeFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setInterview = useInterviewStore((s) => s.setInterview);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setResumeFile(file);
      setIsParsing(true);
      setIsParsed(false);
      setResumeText('');
      
      try {
        const { data } = await resumeService.parseResume(file);
        if (data && data.text) {
          setResumeText(data.text);
          setIsParsed(true);
          toast.success('Resume parsed successfully!');
        } else {
          throw new Error('No text content returned');
        }
      } catch (err) {
        console.error('Parse resume error:', err);
        toast.error(err?.response?.data?.error || 'Failed to extract text from your resume PDF.');
        setResumeFile(null);
      } finally {
        setIsParsing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  });

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
      if (!resumeFile) return toast.error('Please upload your resume PDF.');
      if (!isParsed) return toast.error('Please wait for the resume to finish parsing.');
      if (!jobRole.trim()) return toast.error('Please enter your target job role.');
      payload = { 
        type: 'resume', 
        jobRole: jobRole.trim(),
        experience: parseInt(experience) || 0,
        resumeText: resumeText.trim() 
      };
    } else {
      if (!jdText.trim()) return toast.error('Please paste the job description.');
      if (!jobRole.trim()) return toast.error('Please enter your target job role.');
      payload = { 
        type: 'jd', 
        jobRole: jobRole.trim(),
        experience: parseInt(experience) || 0,
        jdText: jdText.trim() 
      };
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
          <div className="bg-white border border-border rounded-xl overflow-hidden animate-fade-in">
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
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Target Job Role
                      </label>
                      <input
                        type="text"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="e.g. Senior React Developer"
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
                          placeholder="e.g. 3"
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

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Upload Resume PDF
                    </label>
                    {!resumeFile ? (
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                          isDragActive
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50 hover:bg-secondary/40'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-accent animate-bounce' : 'text-muted'}`} />
                        <p className="text-sm font-semibold text-foreground">
                          {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume PDF here'}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          or <span className="text-accent font-medium">browse files</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          PDF files only, up to 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="bg-secondary/30 border border-border rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-accent/15 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-foreground truncate max-w-[200px] md:max-w-md">
                              {resumeFile.name}
                            </p>
                            <p className="text-[10px] text-muted mt-0.5 flex items-center gap-2">
                              <span>{(resumeFile.size / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              {isParsing ? (
                                <span className="text-accent flex items-center gap-1">
                                  <svg className="animate-spin h-3 w-3 text-accent" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                  </svg>
                                  Parsing text...
                                </span>
                              ) : isParsed ? (
                                <span className="text-success font-medium">Parsed & ready</span>
                              ) : (
                                <span className="text-destructive font-medium">Parsing failed</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setResumeFile(null);
                            setResumeText('');
                            setIsParsed(false);
                          }}
                          className="p-1.5 hover:bg-secondary rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* JD-based Tab */}
              {activeTab === 'jd' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Target Job Role
                      </label>
                      <input
                        type="text"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="e.g. Senior React Developer"
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
                          placeholder="e.g. 3"
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

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Job Description
                    </label>
                    <textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste the job description here..."
                      rows={6}
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
                    />
                  </div>
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
