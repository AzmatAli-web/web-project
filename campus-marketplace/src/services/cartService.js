import client from "../api/axiosClient";
import { normalizeProduct } from "../api/config";
const normalize = (cart) => ({
  ...cart,
  items: (cart.items || [])
    .filter((i) => i.product)
    .map((i) => ({ ...i, product: normalizeProduct(i.product) })),
});
const cartService = {
  getCart: async () => normalize((await client.get("/cart")).data),
  addToCart: async (productId, quantity = 1) =>
    normalize((await client.post("/cart/add", { productId, quantity })).data),
  removeFromCart: async (id) =>
    normalize((await client.delete(`/cart/${encodeURIComponent(id)}`)).data),
  clearCart: async () => normalize((await client.delete("/cart")).data),
  createCheckoutSession: async () =>
    (await client.post("/cart/create-checkout-session")).data,
};
export default cartService;
