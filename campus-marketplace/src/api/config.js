export const FALLBACK_IMAGE = "/images/product-placeholder.svg";
export function normalizeApiUrl(value = "") {
  const base = value.trim().replace(/\/+$/, "");
  if (!base) return "/api";
  return base.endsWith("/api") ? base : `${base}/api`;
}
export const API_URL = normalizeApiUrl(import.meta.env?.VITE_API_URL);
export function resolveImageUrl(value, apiUrl = API_URL) {
  if (!value || typeof value !== "string") return FALLBACK_IMAGE;
  const image = value.replace(/\\/g, "/");
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/images/") || image.startsWith("/images2/"))
    return image;
  const origin = /^https?:\/\//i.test(apiUrl) ? new URL(apiUrl).origin : "";
  const filename = image.replace(/^\/?(?:uploads\/)+/, "");
  return `${origin}/uploads/${filename.split("/").pop()}`;
}
export function normalizeProduct(product) {
  return {
    ...product,
    imageUrl: resolveImageUrl(product.imageUrl || product.image),
  };
}
export function normalizeProducts(payload) {
  const products = Array.isArray(payload) ? payload : payload?.products;
  if (!Array.isArray(products))
    throw new Error(
      "The server returned an invalid listing response. Please check the API deployment.",
    );
  return products.map(normalizeProduct);
}
