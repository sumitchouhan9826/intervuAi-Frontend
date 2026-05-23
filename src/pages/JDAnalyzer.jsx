import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles, CheckCircle, XCircle, ArrowRight, Lightbulb, FileText, HelpCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import jdService from '../services/jdService';
import resumeService from '../services/resumeService';
import toast from 'react-hot-toast';

export default function JDAnalyzer() {
  const [jd, setJd] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Resumes list for optional matching
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);
        const { data } = await resumeService.getAnalyses();
        if (data) {
          setResumes(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const handleAnalyze = async () => {
    if (!jd.trim()) {
      toast.error('Please paste a job description');
      return;
    }
    setIsAnalyzing(true);
    try {
      const payload = {
        jobDescription: jd.trim(),
        resumeId: selectedResumeId || undefined,
      };
      
      const { data } = await jdService.analyzeJD(payload);
      if (data) {
        setAnalysis(data);
        toast.success('Job description analyzed successfully!');
      }
    } catch (err) {
      console.error('JD matching error:', err);
      toast.error(err?.response?.data?.error || 'Failed to analyze job description.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-4xl animate-fade-in"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Job Description Matcher <span className="text-accent">💼</span>
        </h1>
        <p className="text-muted mt-1.5 text-sm">
          Paste any job description to extract target skills, required experience level, recommendations, and optionally match against your uploaded resumes.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Job Description</label>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here (responsibilities, technical requirements, qualifications)..."
            rows={8}
            className="w-full px-4 py-3 border border-border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm text-foreground"
          />
        </div>

        {/* Optional Resume Selection */}
        <div className="border-t border-border pt-4">
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
            Optionally Match Against Your Uploaded Resumes
          </label>
          {loadingResumes ? (
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          ) : resumes.length === 0 ? (
            <div className="bg-secondary/30 border border-border rounded-xl p-3 flex items-center gap-2 text-xs text-muted">
              <HelpCircle className="w-4 h-4" />
              <span>No previously analyzed resumes found. Match will perform general JD requirements extraction only.</span>
            </div>
          ) : (
            <select
              value={selectedResumeId}
              onChange={e => setSelectedResumeId(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
            >
              <option value="">-- No Resume Match (General Analysis Only) --</option>
              {resumes.map(r => (
                <option key={r._id} value={r._id}>
                  {r.fileName || 'resume.pdf'} (ATS: {r.atsScore}%, Analyzed on {new Date(r.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jd.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer text-sm"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running Dynamic Match...
            </>
          ) : (
            <>
              Analyze &amp; Map Competencies <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Match Score */}
          <div className="bg-white border border-border rounded-xl p-8 text-center shadow-sm">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20 rounded">
              Role Relevance Score
            </span>
            <p className="text-6xl font-black text-accent mt-3">
              {analysis.matchPercentage !== null ? `${analysis.matchPercentage}%` : 'N/A'}
            </p>
            <h3 className="font-extrabold text-foreground text-md mt-4">
              {analysis.jobTitle || 'Extracted Job Role'}
            </h3>
            {analysis.company && (
              <p className="text-xs text-muted font-medium mt-1">at {analysis.company}</p>
            )}
            {analysis.requiredExperience && (
              <p className="text-xs text-muted mt-2">
                Required Experience: <span className="font-semibold text-foreground">{analysis.requiredExperience}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extracted Required Skills */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" /> Required Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.extractedSkills && analysis.extractedSkills.length > 0 ? (
                  analysis.extractedSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No distinct skills extracted.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">All required skills are covered in your selected profile!</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" /> Strategic Interview Recommendations
            </h3>
            <ul className="space-y-3">
              {analysis.recommendations && analysis.recommendations.length > 0 ? (
                analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                    <ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))
              ) : (
                <p className="text-xs text-muted italic">No specific recommendations provided.</p>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
