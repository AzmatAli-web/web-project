import axiosClient from '../api/axiosClient';

export const userService = {
  getAllUsers: async () => {
    const response = await axiosClient.get('/admin/users');
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosClient.delete(`/admin/users/${userId}`);
    return response.data;
  }
};

export default userService;