import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, Send, CheckCircle, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import toast from 'react-hot-toast';

const mockQuestions = [
  { question: 'Explain the difference between useMemo and useCallback in React. When would you use each?', type: 'technical', difficulty: 'medium' },
  { question: 'Tell me about a time you had to deal with a difficult team member. How did you handle it?', type: 'behavioral', difficulty: 'medium' },
  { question: 'How would you design a real-time notification system for a large-scale application?', type: 'system-design', difficulty: 'hard' },
  { question: 'What is your approach to code reviews? What do you look for?', type: 'technical', difficulty: 'easy' },
  { question: 'Where do you see yourself in 5 years and how does this role fit into that plan?', type: 'hr', difficulty: 'easy' },
];

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentQuestion = mockQuestions[currentIndex];
  const progress = ((currentIndex + 1) / mockQuestions.length) * 100;

  const handleSubmit = async () => {
    if (!answer.trim()) { toast.error('Please write an answer'); return; }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    const mockFeedback = { score: Math.floor(Math.random() * 30) + 65, feedback: 'Good answer with relevant technical depth. Consider adding more specific examples from your experience to strengthen your response. Your explanation of core concepts was clear and well-structured.', strengths: ['Clear explanation', 'Good technical depth'], improvements: ['Add specific examples', 'Mention edge cases'] };
    setFeedback(mockFeedback);
    setAnswers(prev => [...prev, { question: currentQuestion.question, answer, ...mockFeedback }]);
    setIsSubmitting(false);
  };

  const handleNext = () => {
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer('');
      setFeedback(null);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const avgScore = Math.round(answers.reduce((a, b) => a + b.score, 0) / answers.length);
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-accent" /></div>
        <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
        <p className="text-muted mb-8">You answered {answers.length} questions in {formatTime(timer)}</p>
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <p className="text-sm text-muted mb-2">Overall Score</p>
          <p className="text-5xl font-bold text-accent">{avgScore}%</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors">Back to Dashboard</button>
          <button onClick={() => navigate('/session-history')} className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">View History</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted"><Clock className="w-4 h-4" /><span className="font-mono text-sm">{formatTime(timer)}</span></div>
          <span className="text-sm text-muted">Question {currentIndex + 1} of {mockQuestions.length}</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={fadeInUp} className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              currentQuestion.type === 'technical' ? 'bg-blue-50 text-blue-700' :
              currentQuestion.type === 'behavioral' ? 'bg-purple-50 text-purple-700' :
              currentQuestion.type === 'system-design' ? 'bg-orange-50 text-orange-700' :
              'bg-gray-100 text-gray-700'
            }`}>{currentQuestion.type}</span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-50 text-green-700' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }`}>{currentQuestion.difficulty}</span>
          </div>
          <h2 className="text-xl font-semibold leading-relaxed">{currentQuestion.question}</h2>
        </motion.div>
      </AnimatePresence>

      {/* Answer Area */}
      {!feedback ? (
        <motion.div variants={fadeInUp} className="space-y-4">
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..." rows={8} className="w-full px-6 py-4 border border-border rounded-xl text-foreground bg-card resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{answer.length} characters</span>
            <button onClick={handleSubmit} disabled={isSubmitting || !answer.trim()} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>) : (<><Send className="w-4 h-4" /> Submit Answer</>)}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /><h3 className="font-semibold">AI Feedback</h3></div>
              <div className="flex items-center gap-2"><span className="text-2xl font-bold text-accent">{feedback.score}%</span></div>
            </div>
            <p className="text-muted leading-relaxed mb-4">{feedback.feedback}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4"><h4 className="font-medium text-green-800 mb-2">Strengths</h4>{feedback.strengths.map((s, i) => <p key={i} className="text-sm text-green-700 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" />{s}</p>)}</div>
              <div className="bg-amber-50 rounded-lg p-4"><h4 className="font-medium text-amber-800 mb-2">Improvements</h4>{feedback.improvements.map((s, i) => <p key={i} className="text-sm text-amber-700 flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5" />{s}</p>)}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors">
              {currentIndex < mockQuestions.length - 1 ? (<>Next Question <ChevronRight className="w-4 h-4" /></>) : (<>Complete Interview <CheckCircle className="w-4 h-4" /></>)}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
