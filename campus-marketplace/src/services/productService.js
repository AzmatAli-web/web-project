import client from "../api/axiosClient";
import { normalizeProduct, normalizeProducts } from "../api/config";
const list = async (url, config) =>
  normalizeProducts((await client.get(url, config)).data);
const productService = {
  getAllProducts: () => list("/products"),
  getProductById: async (id) =>
    normalizeProduct(
      (await client.get(`/products/${encodeURIComponent(id)}`)).data,
    ),
  getProductsByCategory: (category) =>
    list(`/products/category/${encodeURIComponent(category)}`),
  searchProducts: (query) =>
    query.trim()
      ? list("/products/search", { params: { q: query.trim() } })
      : Promise.resolve([]),
  createProduct: async (data) => (await client.post("/products", data)).data,
  updateProduct: async (id, data) =>
    (await client.put(`/products/${encodeURIComponent(id)}`, data)).data,
  deleteProduct: async (id) =>
    (await client.delete(`/products/${encodeURIComponent(id)}`)).data,
  getMyProducts: () => list("/users/my-products"),
  getUserProducts: (id) => list(`/products/user/${encodeURIComponent(id)}`),
};
export default productService;
