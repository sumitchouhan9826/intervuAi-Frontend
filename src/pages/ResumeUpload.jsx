import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingDown,
  BookOpen,
  UserCheck,
  X,
  HelpCircle,
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import resumeService from '../services/resumeService';
import toast from 'react-hot-toast';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Auto reload last analyzed resume on refresh
  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      setLoadingLatest(true);
      try {
        console.log('[ResumeUpload] Fetching user analyses to load latest...');
        const response = await resumeService.getAnalyses();
        console.log('[ResumeUpload] List analyses response:', response.data);
        
        const list = Array.isArray(response.data) 
          ? response.data 
          : response.data?.analyses || response.data?.data || [];
          
        if (list.length > 0) {
          const latest = list[0];
          setAnalysis(latest);
          console.log('[ResumeUpload] Automatically loaded latest analysis:', latest);
        }
      } catch (err) {
        console.error('[ResumeUpload] Failed to reload analysis on refresh:', err);
      } finally {
        setLoadingLatest(false);
      }
    };
    fetchLatestAnalysis();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnalysis(null);
      toast.success('Resume file selected!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please select a PDF resume file first.');
      return;
    }
    setIsAnalyzing(true);
    try {
      console.log('[ResumeUpload] Uploading & analyzing resume file:', file.name);
      const response = await resumeService.uploadResume(file);
      console.log('[ResumeUpload] Received upload analysis response:', response.data);
      
      if (response.data) {
        // Enforce robust JSON structure mapping
        const fetchedAnalysis = response.data.analysis || response.data;
        setAnalysis(fetchedAnalysis);
        console.log('[ResumeUpload] React state "analysis" updated successfully with:', fetchedAnalysis);
        toast.success('Resume parsed and analyzed successfully!');
      }
    } catch (err) {
      console.error('[ResumeUpload] Analyze error:', err);
      toast.error(err?.response?.data?.error || 'Failed to extract and analyze resume PDF.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTechnicalList = () => {
    if (analysis?.technicalQuestions && analysis.technicalQuestions.length > 0) {
      return analysis.technicalQuestions;
    }
    const qList = analysis?.generatedQuestions || analysis?.questions || [];
    return qList.filter(q => q && q.type?.toLowerCase() === 'technical').map(q => q.question);
  };

  const getHRList = () => {
    if (analysis?.hrQuestions && analysis.hrQuestions.length > 0) {
      return analysis.hrQuestions;
    }
    const qList = analysis?.generatedQuestions || analysis?.questions || [];
    return qList.filter(q => q && (q.type?.toLowerCase() === 'hr' || q.type?.toLowerCase() === 'behavioral')).map(q => q.question);
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
          Resume Analysis Engine <span className="text-accent">📄</span>
        </h1>
        <p className="text-muted mt-1.5 text-sm">
          Upload your resume PDF for instant extraction, ATS scoring, missing competencies analysis, and personalized mock question generation.
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeInUp}>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-accent bg-accent-light/10 bg-accent/5'
              : 'border-border hover:border-accent/50 hover:bg-secondary/40'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-accent animate-bounce' : 'text-muted'}`} />
          <p className="text-lg font-bold text-foreground">
            {isDragActive ? 'Drop your resume PDF here' : 'Drag & drop your resume PDF here'}
          </p>
          <p className="text-sm text-muted mt-1">
            or <span className="text-accent font-semibold">click to browse local files</span>
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Supports PDF files only, up to 10MB
          </p>
        </div>
      </motion.div>

      {/* File Preview */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-xl p-4 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground truncate max-w-[200px] md:max-w-md">
                {file.name}
              </p>
              <p className="text-xs text-muted">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!analysis && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Extracting & Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Analyze Resume
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => {
                setFile(null);
                setAnalysis(null);
              }}
              className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer text-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State for Initial Load */}
      {loadingLatest && !analysis && (
        <div className="flex items-center justify-center py-10 gap-2">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted">Loading your latest resume analysis...</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ATS Score & Details */}
          <div className="bg-white border border-border rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm animate-fade-in">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(analysis.atsScore / 100) * 327} 327`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-foreground">
                {analysis.atsScore}%
              </span>
            </div>
            
            <div className="space-y-2 text-center md:text-left">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20 rounded">
                ATS Compatibility Verdict
              </span>
              <h2 className="text-xl font-bold text-foreground">
                {analysis.atsScore >= 80 ? 'Excellent Match!' : analysis.atsScore >= 60 ? 'Strong Potential' : 'Needs Optimization'}
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                Candidate demonstrated experience corresponds to a <span className="font-semibold text-foreground">{analysis.difficultyLevel || 'Medium'}</span> experience tier. We have matched key keywords, action verbs, and skills. Review recommendations below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" /> Key Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.strengths && analysis.strengths.length > 0 ? (
                  analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No distinct strengths identified.</p>
                )}
              </ul>
            </div>
            
            {/* Weaknesses */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" /> Areas of Improvements
              </h3>
              <ul className="space-y-3">
                {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                  analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                      <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No major structural weaknesses detected.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Suggestions & Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggestions */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" /> Actionable Recommendations
              </h3>
              <ul className="space-y-3">
                {analysis.suggestions && analysis.suggestions.length > 0 ? (
                  analysis.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                      <Lightbulb className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No suggestions provided.</p>
                )}
              </ul>
            </div>

            {/* Missing Skills */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-accent" /> Extracted Skill Gaps
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No gaps discovered for target path.</p>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-foreground mb-4">Extracted Competencies & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skills && analysis.skills.length > 0 ? (
                analysis.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-secondary text-foreground text-xs font-semibold rounded-lg border border-border"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-muted italic text-center w-full">No explicit skills parsed from text.</p>
              )}
            </div>
          </div>

          {/* AI Recommended Questions */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-sm text-foreground border-b border-border pb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" /> Recommended Mock Interview Practice
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Technical Questions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-primary flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Suggested Technical Questions
                </h4>
                {getTechnicalList().length > 0 ? (
                  getTechnicalList().map((q, i) => (
                    <div key={i} className="p-3 bg-secondary/30 border border-border rounded-lg text-xs leading-relaxed text-muted">
                      <span className="font-bold text-foreground block mb-0.5">Q{i + 1}</span>
                      {q}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No specific technical questions generated.</p>
                )}
              </div>

              {/* HR / Behavioral Questions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-accent flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-accent" /> Suggested HR Questions
                </h4>
                {getHRList().length > 0 ? (
                  getHRList().map((q, i) => (
                    <div key={i} className="p-3 bg-secondary/30 border border-border rounded-lg text-xs leading-relaxed text-muted">
                      <span className="font-bold text-foreground block mb-0.5">Q{i + 1}</span>
                      {q}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No specific HR questions generated.</p>
                )}
              </div>

              {/* AI Generated Mock Session Questions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-success flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-success" /> AI Generated Mock Sessions
                </h4>
                {(analysis.generatedQuestions || analysis.questions) && (analysis.generatedQuestions || analysis.questions).length > 0 ? (
                  (analysis.generatedQuestions || analysis.questions).map((q, i) => (
                    <div key={i} className="p-3 bg-secondary/30 border border-border rounded-lg text-xs leading-relaxed text-muted">
                      <span className="font-bold text-foreground block mb-0.5">Q{i + 1} ({q.difficulty || 'medium'})</span>
                      {q.question}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">No generated mock session questions active.</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Link
                to="/interview-lab"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Go to Interview Lab <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
