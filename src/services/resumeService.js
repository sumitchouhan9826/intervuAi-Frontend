import api from './api';

export const resumeService = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  analyzeResume: (data) => api.post('/resume/analyze', data),

  getAnalyses: () => api.get('/resume/analyses'),

  getAnalysis: (id) => api.get(`/resume/analyses/${id}`),
};

export default resumeService;
