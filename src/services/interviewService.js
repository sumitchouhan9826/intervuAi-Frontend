import api from './api';

export const interviewService = {
  generateInterview: (data) => api.post('/interviews/generate', data),

  submitAnswer: (id, data) => api.post(`/interviews/${id}/answer`, data),

  completeInterview: (id) => api.post(`/interviews/${id}/complete`),

  getInterviews: (params) => api.get('/interviews', { params }),

  getInterview: (id) => api.get(`/interviews/${id}`),

  getStats: () => api.get('/interviews/stats'),

  deleteInterview: (id) => api.delete(`/interviews/${id}`),
};

export default interviewService;
