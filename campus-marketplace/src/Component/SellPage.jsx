import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/authService";
import productService from "../services/productService";
import { categories } from "./CategoryGrid";
import Icon from "./Icon";
const empty = {
  name: "",
  category: "books",
  price: "",
  description: "",
  contact: "",
  location: "",
};
export default function SellPage() {
  const [params] = useSearchParams();
  const id = params.get("edit");
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [existing, setExisting] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  useEffect(() => {
    if (!id || !authService.isAuthenticated()) return;
    let active = true;
    setLoading(true);
    productService
      .getProductById(id)
      .then((p) => {
        if (!active) return;
        const current = authService.getCurrentUser();
        if (
          String(p.seller?._id || p.seller) !==
          String(current?.id || current?._id)
        )
          throw new Error("You can only edit your own listings.");
        setForm({ ...empty, ...p });
        setExisting(p.image ? p.imageUrl : "");
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!user) return <Navigate to="/login" replace />;
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file && !existing && !id) {
      setError("Please choose a photo for your listing.");
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      for (const key of Object.keys(empty)) data.append(key, form[key]);
      if (file) data.append("image", file);
      else if (removeImage) data.append("removeImage", "true");
      const result = id
        ? await productService.updateProduct(id, data)
        : await productService.createProduct(data);
      navigate(`/product/${result.product._id}`);
    } catch (err) {
      setError(err.message || "Could not save this listing.");
    } finally {
      setSaving(false);
    }
  };
  const pick = (e) => {
    const image = e.target.files[0];
    if (!image) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(image.type) ||
      image.size > 4 * 1024 * 1024
    ) {
      setError("Choose a JPEG, PNG, or WebP image under 4 MB.");
      e.target.value = "";
      return;
    }
    setError("");
    setFile(image);
    setRemoveImage(false);
  };
  return (
    <main className="site-width sell-page">
      <div className="page-intro">
        <span className="eyebrow">GIVE IT A SECOND CHAPTER</span>
        <h1>{id ? "A little refresh." : "Someone needs what you don’t."}</h1>
        <p>
          {id
            ? "Keep your listing looking its best."
            : "A few details. A good photo. A new home for something great."}
        </p>
      </div>
      {loading ? (
        <p role="status">Loading your listing…</p>
      ) : (
        <form onSubmit={submit} className="sell-form">
          <section className="photo-panel">
            <span className="eyebrow">01 / THE FIRST IMPRESSION</span>
            <h2>Show its good side.</h2>
            <label className="photo-upload">
              {preview || existing ? (
                <img src={preview || existing} alt="Listing preview" />
              ) : (
                <span>
                  <Icon name="plus" size={36} />
                  <strong>Add a photo</strong>
                  <small>JPEG, PNG or WebP · up to 4 MB</small>
                </span>
              )}
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={pick}
                disabled={saving || loadFailed}
              />
            </label>
            {(preview || existing) && (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setFile(null);
                  setExisting("");
                  setRemoveImage(true);
                }}
              >
                Remove photo
              </button>
            )}
            <p>
              Natural light and a clear background go a long way. Show the
              actual item you're selling.
            </p>
          </section>
          <section className="sell-fields">
            <span className="eyebrow">02 / THE LITTLE DETAILS</span>
            <h2>Tell us about your find.</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <label className="field-label" htmlFor="item-name">
              Item name
            </label>
            <input
              id="item-name"
              name="name"
              value={form.name}
              onChange={change}
              className="form-control"
              placeholder="e.g. Calculus textbook, 12th edition"
              maxLength={120}
              required
            />
            <div className="field-pair">
              <div>
                <label className="field-label" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={change}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="price">
                  Price (Rs.)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={change}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <label className="field-label" htmlFor="description">
              Description & condition
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={change}
              className="form-control"
              rows="4"
              placeholder="What should the next owner know?"
              maxLength={5000}
            />
            <label className="field-label" htmlFor="contact">
              Contact details
            </label>
            <input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={change}
              className="form-control"
              placeholder="Phone or preferred contact method"
              maxLength={160}
            />
            <label className="field-label" htmlFor="location">
              Campus / collection area
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={change}
              className="form-control"
              placeholder="e.g. Abbottabad campus, main library"
              maxLength={160}
            />
            <p className="safety-note">
              <Icon name="shield" />
              Your listing and contact details will be visible to marketplace
              visitors.
            </p>
            <button
              className="button button-dark w-100"
              disabled={saving || loadFailed}
            >
              {saving
                ? "Saving your listing…"
                : id
                  ? "Save changes"
                  : "Publish your listing"}
              <Icon name="arrow" />
            </button>
          </section>
        </form>
      )}
    </main>
  );
}
