import api from './api';

export const jdService = {
  analyzeJD: (data) => api.post('/jd/analyze', data),

  getAnalyses: () => api.get('/jd/analyses'),

  getAnalysis: (id) => api.get(`/jd/analyses/${id}`),
};

export default jdService;
