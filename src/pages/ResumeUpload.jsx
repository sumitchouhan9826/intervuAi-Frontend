import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, XCircle, Lightbulb, Sparkles, Trash2, X } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import toast from 'react-hot-toast';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnalysis(null);
      toast.success('Resume uploaded successfully');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 3000));
    setAnalysis({
      atsScore: 78,
      strengths: ['Strong technical skills section', 'Quantified achievements with metrics', 'Clean formatting and structure', 'Relevant project experience'],
      weaknesses: ['Missing summary/objective section', 'Could improve action verb variety', 'No certifications listed'],
      suggestions: ['Add a professional summary at the top', 'Include relevant certifications', 'Use more diverse action verbs', 'Add links to GitHub/portfolio'],
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL'],
    });
    setIsAnalyzing(false);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8 max-w-4xl">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold">Resume Analysis</h1>
        <p className="text-muted mt-1">Upload your resume and get AI-powered insights to improve your chances.</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeInUp}>
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-accent bg-accent-light/20' : 'border-border hover:border-accent/50 hover:bg-secondary/50'}`}>
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-accent' : 'text-muted'}`} />
          <p className="text-lg font-medium">{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}</p>
          <p className="text-sm text-muted mt-1">or <span className="text-accent font-medium">click to browse</span></p>
          <p className="text-xs text-muted-foreground mt-3">Supports PDF files up to 10MB</p>
        </div>
      </motion.div>

      {/* File Preview */}
      {file && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-accent" /></div>
            <div><p className="font-medium text-sm">{file.name}</p><p className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</p></div>
          </div>
          <div className="flex items-center gap-2">
            {!analysis && <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {isAnalyzing ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>) : (<><Sparkles className="w-4 h-4" /> Analyze</>)}
            </button>}
            <button onClick={() => { setFile(null); setAnalysis(null); }} className="p-2 hover:bg-secondary rounded-lg"><X className="w-4 h-4 text-muted" /></button>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* ATS Score */}
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted mb-3">ATS Compatibility Score</p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#14B8A6" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(analysis.atsScore / 100) * 327} 327`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{analysis.atsScore}%</span>
            </div>
            <p className="text-sm text-muted">Your resume is performing above average</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-success" /> Strengths</h3>
              <ul className="space-y-3">{analysis.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />{s}</li>)}</ul>
            </div>
            {/* Weaknesses */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-destructive" /> Weaknesses</h3>
              <ul className="space-y-3">{analysis.weaknesses.map((w, i) => <li key={i} className="flex items-start gap-2 text-sm"><XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />{w}</li>)}</ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-warning" /> Suggestions</h3>
            <ul className="space-y-3">{analysis.suggestions.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm"><Lightbulb className="w-4 h-4 text-warning mt-0.5 shrink-0" />{s}</li>)}</ul>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">{analysis.skills.map((skill, i) => <span key={i} className="px-3 py-1.5 bg-secondary text-foreground text-sm rounded-lg border border-border">{skill}</span>)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
