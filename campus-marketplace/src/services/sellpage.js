import axiosClient from '../api/axiosClient';

export const listingService = {
  getAllListings: async () => {
    const response = await axiosClient.get('/listings');
    return response.data;
  },

  approveListing: async (listingId) => {
    const response = await axiosClient.patch(`/listings/${listingId}/approve`);
    return response.data;
  },

  deleteListing: async (listingId) => {
    const response = await axiosClient.delete(`/listings/${listingId}`);
    return response.data;
  }
};

export default listingService;