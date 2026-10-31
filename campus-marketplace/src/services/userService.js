import client from "../api/axiosClient";
import { normalizeProducts } from "../api/config";
export default {
  getProfile: async () => (await client.get("/users/me")).data,
  updateProfile: async (data) =>
    (await client.put("/users/profile", data)).data,
  getUserProducts: async (id) =>
    normalizeProducts((await client.get(`/products/user/${id}`)).data),
  getAllUsers: async () => (await client.get("/users")).data,
  getUsers: async () => (await client.get("/users")).data,
  approveUser: async (id) => (await client.put(`/users/${id}/approve`)).data,
  deleteUser: async (id) => (await client.delete(`/users/${id}`)).data,
  updateUserRole: async (id, role) =>
    (await client.put(`/users/${id}/role`, { role })).data,
  getUserById: async (id) => (await client.get(`/users/${id}`)).data,
  deleteAccount: async () => (await client.delete("/users/me")).data,
};
