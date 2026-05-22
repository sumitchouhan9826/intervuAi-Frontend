import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles, CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import toast from 'react-hot-toast';

export default function JDAnalyzer() {
  const [jd, setJd] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!jd.trim()) { toast.error('Please paste a job description'); return; }
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 3000));
    setAnalysis({
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Company',
      extractedSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'GraphQL', 'Docker', 'CI/CD', 'Microservices', 'Agile'],
      matchPercentage: 74,
      matchedSkills: ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'GraphQL'],
      missingSkills: ['PostgreSQL', 'CI/CD', 'Microservices', 'Agile'],
      recommendations: ['Consider getting AWS certified to strengthen cloud credentials', 'Add PostgreSQL projects to your portfolio', 'Highlight any CI/CD pipeline experience', 'Emphasize microservices architecture knowledge'],
    });
    setIsAnalyzing(false);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8 max-w-4xl">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold">Job Description Analyzer</h1>
        <p className="text-muted mt-1">Paste a job description to extract key requirements and compare with your profile.</p>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-6">
        <label className="block text-sm font-medium mb-2">Job Description</label>
        <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the full job description here..." rows={10} className="w-full px-4 py-3 border border-border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
        <button onClick={handleAnalyze} disabled={isAnalyzing || !jd.trim()} className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {isAnalyzing ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>) : (<>Analyze Job Description <ArrowRight className="w-4 h-4" /></>)}
        </button>
      </motion.div>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Match Score */}
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted mb-1">Profile Match</p>
            <p className="text-5xl font-bold text-accent">{analysis.matchPercentage}%</p>
            <p className="text-sm text-muted mt-2">{analysis.jobTitle} at {analysis.company}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-success" /> Matched Skills</h3>
              <div className="flex flex-wrap gap-2">{analysis.matchedSkills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{s}</span>)}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-destructive" /> Missing Skills</h3>
              <div className="flex flex-wrap gap-2">{analysis.missingSkills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{s}</span>)}</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-warning" /> Recommendations</h3>
            <ul className="space-y-3">{analysis.recommendations.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm"><ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />{r}</li>)}</ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">All Required Skills</h3>
            <div className="flex flex-wrap gap-2">{analysis.extractedSkills.map((s, i) => {
              const matched = analysis.matchedSkills.includes(s);
              return <span key={i} className={`px-3 py-1.5 text-sm rounded-lg border ${matched ? 'bg-accent-light text-accent border-accent/20' : 'bg-secondary text-muted border-border'}`}>{s}</span>;
            })}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
