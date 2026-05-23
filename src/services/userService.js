import api from './api';

export const userService = {
  syncUser: (data) => api.post('/users/sync', data),

  getProfile: () => api.get('/users/profile'),

  updateProfile: (data) => api.put('/users/profile', data),

  getActivity: () => api.get('/users/activity'),
};

export default userService;
