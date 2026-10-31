function imagePath(image) {
  if (!image) return null;
  const value = String(image).replace(/\\/g, "/");
  if (/^https?:\/\//i.test(value)) return value;
  if (/^\/images2?\//.test(value)) return value;
  return `/uploads/${value.split("/").pop()}`;
}
const addImageUrls = (product) => ({
  ...product,
  imageUrl: imagePath(product.image),
});
const serializeCart = (cart) => {
  const result = cart.toObject ? cart.toObject() : cart;
  return {
    ...result,
    items: (result.items || [])
      .filter((item) => item.product)
      .map((item) => ({ ...item, product: addImageUrls(item.product) })),
  };
};
module.exports = { imagePath, addImageUrls, serializeCart };
