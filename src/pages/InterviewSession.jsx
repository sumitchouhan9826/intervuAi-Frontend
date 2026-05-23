import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, Send, CheckCircle, AlertCircle, Sparkles, ArrowLeft, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import toast from 'react-hot-toast';
import interviewService from '../services/interviewService';

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [overallScore, setOverallScore] = useState(null);
  const [overallFeedback, setOverallFeedback] = useState('');

  // Fetch interview data on mount
  useEffect(() => {
    const fetchInterview = async () => {
      if (!id || id === 'session') {
        toast.error('Invalid interview session ID.');
        navigate('/interview-lab');
        return;
      }
      try {
        setLoading(true);
        const response = await interviewService.getInterview(id);
        console.log('[InterviewSession] Fetch interview API response:', response.data);
        
        const fetchedSession = response.data?.interview || response.data?.data || response.data;
        if (fetchedSession) {
          setInterview(fetchedSession);
          const qList = fetchedSession.questions || fetchedSession.generatedQuestions || [];
          if (qList && qList.length > 0) {
            setQuestions(qList);
            
            // Set current index to first unanswered question
            const unansweredIdx = qList.findIndex(q => !q.answer);
            setCurrentIndex(unansweredIdx !== -1 ? unansweredIdx : 0);
            
            // Re-populate submitted answers in state
            const prevAnswers = qList
              .filter(q => q.answer)
              .map(q => ({
                question: q.question,
                answer: q.answer,
                score: q.score,
                feedback: q.feedback,
                strengths: q.strengths || [],
                improvements: q.improvements || [],
              }));
            setAnswers(prevAnswers);

            if (fetchedSession.status === 'completed') {
              setOverallScore(fetchedSession.overallScore || fetchedSession.score);
              setOverallFeedback(fetchedSession.overallFeedback || fetchedSession.aiFeedback);
              setIsComplete(true);
            }
          } else {
            toast.error('No questions found in this interview session.');
            setQuestions([]);
          }
        } else {
          toast.error('Failed to load session details.');
        }
      } catch (err) {
        console.error('Fetch interview error:', err);
        toast.error('Failed to load interview session from the database.');
        navigate('/interview-lab');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSubmit = async () => {
    if (!answer.trim()) { toast.error('Please write an answer'); return; }
    setIsSubmitting(true);
    
    try {
      const response = await interviewService.submitAnswer(id, {
        questionIndex: currentIndex,
        answer: answer.trim()
      });
      console.log('[InterviewSession] Submit answer API response:', response.data);
      
      const responseData = response.data?.data || response.data;
      if (responseData) {
        const resultFeedback = {
          score: responseData.score,
          feedback: responseData.feedback,
          strengths: responseData.strengths || [],
          improvements: responseData.improvements || [],
        };
        setFeedback(resultFeedback);
        setAnswers(prev => [...prev, { question: currentQuestion.question, answer, ...resultFeedback }]);
        toast.success('Answer analyzed!');
      } else {
        throw new Error('No feedback data returned from server');
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      toast.error(err?.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer('');
      setFeedback(null);
    } else {
      // Call backend complete API
      try {
        setLoading(true);
        const response = await interviewService.completeInterview(id);
        console.log('[InterviewSession] Complete interview API response:', response.data);
        
        const responseData = response.data?.data || response.data;
        if (responseData) {
          const session = responseData.interview || responseData;
          setOverallScore(session.overallScore || session.score);
          setOverallFeedback(session.overallFeedback || session.aiFeedback);
          setIsComplete(true);
          toast.success('Interview session successfully saved and analyzed!');
        } else {
          throw new Error('No completion details returned from server');
        }
      } catch (err) {
        console.error('Complete interview error:', err);
        toast.error('Failed to complete interview on server.');
        setIsComplete(true);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted font-medium">Fetching interview details...</p>
      </div>
    );
  }

  if (isComplete) {
    const avgScore = overallScore || Math.round(answers.reduce((a, b) => a + b.score, 0) / answers.length);
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-accent" /></div>
        <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
        <p className="text-muted mb-8">You answered {answers.length} questions in {formatTime(timer)}</p>
        <div className="bg-card border border-border rounded-xl p-8 mb-8 space-y-4 text-left">
          <div className="text-center">
            <p className="text-sm text-muted mb-2">Overall Score</p>
            <p className="text-5xl font-bold text-accent">{avgScore}%</p>
          </div>
          {overallFeedback && (
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-sm mb-1.5 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-accent" /> Overall Feedback</h4>
              <p className="text-sm text-muted leading-relaxed">{overallFeedback}</p>
            </div>
          )}
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors cursor-pointer">Back to Dashboard</button>
          <button onClick={() => navigate('/session-history')} className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer">View History</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted"><Clock className="w-4 h-4" /><span className="font-mono text-sm">{formatTime(timer)}</span></div>
          <span className="text-sm text-muted">Question {currentIndex + 1} of {questions.length}</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={fadeInUp} className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                currentQuestion.type === 'technical' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                currentQuestion.type === 'behavioral' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                currentQuestion.type === 'system-design' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                'bg-gray-100 text-gray-700'
              }`}>{currentQuestion.type}</span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-50 text-green-700 border border-green-100' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                'bg-red-50 text-red-700 border border-red-100'
              }`}>{currentQuestion.difficulty}</span>
            </div>
            <h2 className="text-xl font-semibold leading-relaxed text-foreground">{currentQuestion.question}</h2>
            
            {/* Explanation Toggle Button */}
            {currentQuestion.explanation && (
              <div className="pt-2 border-t border-border-light">
                <button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showExplanation ? 'Hide Explanation' : 'View Answer / Explanation'}</span>
                  {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                
                {/* Explanation Content */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="bg-secondary/40 border border-border/80 rounded-lg p-4 text-sm text-muted leading-relaxed">
                        <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-accent" /> Ideal Answer / Explanation:
                        </p>
                        {currentQuestion.explanation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Area */}
      {!feedback ? (
        <motion.div variants={fadeInUp} className="space-y-4">
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..." rows={8} className="w-full px-6 py-4 border border-border rounded-xl text-foreground bg-card resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{answer.length} characters</span>
            <button onClick={handleSubmit} disabled={isSubmitting || !answer.trim()} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>) : (<><Send className="w-4 h-4" /> Submit Answer</>)}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /><h3 className="font-semibold text-foreground">AI Feedback</h3></div>
              <div className="flex items-center gap-2"><span className="text-2xl font-bold text-accent">{feedback.score}%</span></div>
            </div>
            <p className="text-muted leading-relaxed mb-4">{feedback.feedback}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50/50 border border-green-100 rounded-lg p-4"><h4 className="font-medium text-green-800 mb-2">Strengths</h4>{feedback.strengths && feedback.strengths.length > 0 ? feedback.strengths.map((s, i) => <p key={i} className="text-xs text-green-700 flex items-center gap-2 mt-1"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />{s}</p>) : <p className="text-xs text-green-600">Well-phrased answer components.</p>}</div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4"><h4 className="font-medium text-amber-800 mb-2">Improvements</h4>{feedback.improvements && feedback.improvements.length > 0 ? feedback.improvements.map((s, i) => <p key={i} className="text-xs text-amber-700 flex items-center gap-2 mt-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{s}</p>) : <p className="text-xs text-amber-600">Minor formatting tweaks possible.</p>}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors cursor-pointer">
              {currentIndex < questions.length - 1 ? (<>Next Question <ChevronRight className="w-4 h-4" /></>) : (<>Complete Interview <CheckCircle className="w-4 h-4" /></>)}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
