import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Eye, Trash2, ChevronLeft, ChevronRight, 
  Code2, FileText, Briefcase, MessageSquare, X, CheckCircle, 
  AlertCircle, Sparkles, Clock, Calendar, Star, HelpCircle
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import interviewService from '../services/interviewService';
import toast from 'react-hot-toast';

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalHours: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('All Types');
  const [sortBy, setSortBy] = useState('Newest First');
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 10
  });

  // Modal State for Reviewing a Single Session
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch interviews list and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Map filters to API params
      const typeParam = 
        filterType === 'Role' ? 'role' : 
        filterType === 'Resume' ? 'resume' : 
        filterType === 'JD' ? 'jd' : undefined;

      const sortParam = 
        sortBy === 'Newest First' ? '-createdAt' :
        sortBy === 'Oldest First' ? 'createdAt' :
        sortBy === 'Highest Score' ? '-overallScore' :
        sortBy === 'Lowest Score' ? 'overallScore' : undefined;

      const [interviewsRes, statsRes] = await Promise.all([
        interviewService.getInterviews({
          page: currentPage,
          limit: 10,
          type: typeParam,
          sort: sortParam
        }),
        interviewService.getStats()
      ]);

      if (interviewsRes.data) {
        setSessions(interviewsRes.data.data || []);
        setPagination(interviewsRes.data.pagination || { total: 0, pages: 1, limit: 10 });
      }
      if (statsRes.data && statsRes.data.data) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
      toast.error('Failed to load sessions list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, filterType, sortBy]);

  // Load session detail for review modal
  const handleReviewSession = async (sessionId) => {
    setSelectedSessionId(sessionId);
    setLoadingDetail(true);
    try {
      const { data } = await interviewService.getInterview(sessionId);
      if (data) {
        setSelectedSession(data.data || data);
      }
    } catch (err) {
      console.error('Get interview details error:', err);
      toast.error('Failed to load session details.');
      setSelectedSessionId(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Delete an interview session
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this interview session?')) return;
    
    try {
      await interviewService.deleteInterview(sessionId);
      toast.success('Interview session deleted.');
      fetchData();
    } catch (err) {
      console.error('Delete interview error:', err);
      toast.error('Failed to delete interview.');
    }
  };

  // Close details modal
  const handleCloseModal = () => {
    setSelectedSessionId(null);
    setSelectedSession(null);
  };

  const getSessionIcon = (type) => {
    switch (type) {
      case 'role': return Code2;
      case 'resume': return FileText;
      case 'jd': return Briefcase;
      default: return MessageSquare;
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Session History</h1>
          <p className="text-muted mt-1 max-w-2xl">Review your past performance, track improvement metrics, and revisit specific interview drills to sharpen your skills.</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Performance Overview</h3>
            <span className="px-3 py-1 bg-accent-light text-accent text-xs font-medium rounded-full">All Time</span>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-muted">Total Sessions</p>
              <p className="text-3xl font-bold mt-1 text-foreground">{stats.totalSessions}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Hours Practiced</p>
              <p className="text-3xl font-bold mt-1 text-foreground">{stats.totalHours || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Average Score</p>
              <p className="text-3xl font-bold mt-1 text-accent">{stats.averageScore || 0}%</p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-primary text-primary-foreground rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-accent flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /> Keep Practicing!</h3>
            <p className="text-sm text-gray-400 mt-2">Revisiting past sessions and reviewing AI-generated explanations is the absolute best way to build mock confidence.</p>
          </div>
          <a href="/interview-lab" className="mt-4 px-4 py-2 bg-white text-primary text-center text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors w-fit block cursor-pointer">New Session</a>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-muted" />
            <span className="text-xs font-semibold text-muted uppercase">Filter:</span>
          </div>
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer">
            <option>All Types</option><option>Role</option><option>Resume</option><option>JD</option>
          </select>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer">
            <option>Newest First</option><option>Oldest First</option><option>Highest Score</option><option>Lowest Score</option>
          </select>
        </div>
        <p className="text-sm text-muted">Showing {sessions.length} of {pagination.total} sessions</p>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted text-sm font-medium">Fetching sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-foreground">No sessions found</h3>
            <p className="text-muted text-sm max-w-sm mx-auto mt-1">Configure parameters in the Interview Lab to start generating tailored questions!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Session & Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Score</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Duration</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const Icon = getSessionIcon(session.type);
                  const formattedDate = new Date(session.createdAt).toLocaleDateString([], {
                    month: 'short', day: 'numeric', year: 'numeric'
                  }) + ' • ' + new Date(session.createdAt).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit'
                  });
                  return (
                    <tr key={session._id} className="border-b border-border-light hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            session.type === 'role' ? 'bg-blue-50 text-blue-600' : 
                            session.type === 'resume' ? 'bg-accent-light text-accent' : 
                            'bg-purple-50 text-purple-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{session.title || 'Untitled Session'}</p>
                            <p className="text-xs text-muted mt-0.5">{formattedDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded border ${
                          session.type === 'role' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                          session.type === 'resume' ? 'border-teal-200 text-teal-700 bg-teal-50' :
                          'border-purple-200 text-purple-700 bg-purple-50'
                        }`}>{session.type === 'role' ? 'Role' : session.type === 'resume' ? 'Resume' : 'JD'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {session.overallScore !== null ? (
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${session.overallScore}%` }} />
                            </div>
                            <span className="text-sm font-medium text-foreground">{session.overallScore}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {session.duration !== undefined ? `${session.duration} min` : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleReviewSession(session._id)}
                            title="Review Questions & Explanations"
                            className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-muted hover:text-foreground" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteSession(session._id, e)}
                            title="Delete Session"
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-muted hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 hover:bg-secondary rounded-lg disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pagination.pages }, (_, idx) => idx + 1).map(p => (
                <button 
                  key={p} 
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${p === currentPage ? 'bg-accent text-white' : 'hover:bg-secondary'} cursor-pointer`} 
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button 
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                className="p-2 hover:bg-secondary rounded-lg disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted">Showing page {currentPage} of {pagination.pages}</p>
          </div>
        )}
      </motion.div>

      {/* DETAILED PAST-SESSION DETAILS MODAL */}
      <AnimatePresence>
        {selectedSessionId && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                      Review mode
                    </span>
                    {selectedSession && (
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {selectedSession.duration || 0}m duration
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedSession ? selectedSession.title : 'Loading Session Details...'}
                  </h2>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-secondary rounded-full transition-colors text-muted hover:text-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {loadingDetail ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted font-medium">Analyzing interview data...</p>
                  </div>
                ) : selectedSession ? (
                  <>
                    {/* Score summary panel */}
                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-center justify-between">
                      <div className="space-y-1.5 text-center md:text-left">
                        <div className="flex items-center gap-1.5 justify-center md:justify-start">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <h4 className="font-bold text-foreground">Overall Performance</h4>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                          {selectedSession.overallFeedback || 'Your overall mock evaluation is ready below. Great practice session!'}
                        </p>
                      </div>
                      <div className="bg-card border border-border px-8 py-4 rounded-xl text-center shadow-sm flex-shrink-0 min-w-[120px]">
                        <span className="text-xs text-muted block mb-0.5">Overall Score</span>
                        <span className="text-4xl font-extrabold text-accent">
                          {selectedSession.overallScore !== null ? `${selectedSession.overallScore}%` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Questions & Explanations Details */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-md text-foreground border-b border-border pb-2">Questions, Answers & Explanations</h3>
                      {selectedSession.questions && selectedSession.questions.length > 0 ? (
                        selectedSession.questions.map((q, idx) => (
                          <div key={q._id || idx} className="bg-secondary/20 border border-border rounded-xl p-5 space-y-4">
                            {/* Question Header */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted uppercase">Question {idx + 1}</span>
                                <h4 className="font-semibold text-foreground leading-relaxed">{q.question}</h4>
                              </div>
                              <div className="flex gap-2">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                  q.type === 'technical' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                }`}>{q.type}</span>
                                {q.score !== null && (
                                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-accent/15 text-accent border border-accent/25 rounded-full">
                                    Score: {q.score}%
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Pre-generated Explanation / Correct Answer */}
                            {q.explanation && (
                              <div className="bg-card border border-border/80 rounded-lg p-4 space-y-1">
                                <span className="text-xs font-bold text-accent flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5" /> Ideal Explanation / Suggested Answer
                                </span>
                                <p className="text-xs text-muted leading-relaxed">
                                  {q.explanation}
                                </p>
                              </div>
                            )}

                            {/* User's Answer & Evaluation Feedback */}
                            {q.answer ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                                <div className="space-y-1.5">
                                  <span className="text-xs font-bold text-foreground">Your Submitted Answer:</span>
                                  <div className="bg-card border border-border rounded p-3 text-xs text-muted max-h-[120px] overflow-y-auto leading-relaxed">
                                    {q.answer}
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <span className="text-xs font-bold text-foreground flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-accent" /> Evaluation Feedback:</span>
                                  <div className="bg-card border border-border rounded p-3 text-xs space-y-2">
                                    <p className="text-muted leading-relaxed italic">"{q.feedback || 'No feedback available.'}"</p>
                                    
                                    {/* Strengths & Improvements */}
                                    {((q.strengths && q.strengths.length > 0) || (q.improvements && q.improvements.length > 0)) && (
                                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border-light">
                                        <div>
                                          <span className="text-[10px] font-bold text-green-700 block">Strengths</span>
                                          {q.strengths && q.strengths.map((s, i) => (
                                            <span key={i} className="text-[9px] text-green-600 block mt-0.5 truncate" title={s}>• {s}</span>
                                          ))}
                                        </div>
                                        <div>
                                          <span className="text-[10px] font-bold text-amber-700 block">Improvements</span>
                                          {q.improvements && q.improvements.map((s, i) => (
                                            <span key={i} className="text-[9px] text-amber-600 block mt-0.5 truncate" title={s}>• {s}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-muted border-t border-border pt-3 italic">
                                Question was skipped or not answered during the session.
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted italic">No questions details available for this session.</p>
                      )}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-secondary/10 flex justify-end">
                <button 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-medium rounded-lg cursor-pointer"
                >
                  Close Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 pt-8 pb-4 text-sm text-muted border-t border-border-light">
        <span>© 2026 IntervuAI</span>
        <span>•</span><a href="#" className="hover:text-foreground">Privacy Policy</a>
        <span>•</span><a href="#" className="hover:text-foreground">Terms of Service</a>
        <span>•</span><span className="flex items-center gap-1"><span className="w-2 h-2 bg-success rounded-full" /> Systems Operational</span>
        <span>•</span><a href="#" className="hover:text-foreground">Priority Support</a>
      </motion.footer>
    </motion.div>
  );
}
