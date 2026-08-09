import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Image as ImageIcon, Upload, X } from "lucide-react";
import { addProduct } from "../../store/productsSlice";
import { CATEGORIES } from "../../data/seed";
import "./Admin.css";

const MAX_FILE_BYTES = 1.5 * 1024 * 1024; // 1.5MB - keeps localStorage usage sane

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    cat: "sweets",
    price: "",
    unit: "",
    desc: "",
    image: "",
    tag: "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((er) => ({ ...er, image: "Please choose an image file." }));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrors((er) => ({ ...er, image: "Image is too large \u2014 please use a file under 1.5MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }));
      setFileName(file.name);
      setErrors((er) => ({ ...er, image: undefined }));
    };
    reader.onerror = () => {
      setErrors((er) => ({ ...er, image: "Couldn't read that file. Try again." }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((f) => ({ ...f, image: "" }));
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter a product name";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (!form.unit.trim()) e.unit = "Enter a unit, e.g. 500g box";
    if (!form.desc.trim()) e.desc = "Enter a short description";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const product = {
      name: form.name.trim(),
      cat: form.cat,
      price: Number(form.price),
      unit: form.unit.trim(),
      desc: form.desc.trim(),
      image: form.image.trim(),
      tag: form.tag.trim() || null,
    };

    setSubmitting(true);
    setServerError("");
    dispatch(addProduct(product))
      .unwrap()
      .then((created) => {
        setSaved(created);
        setForm({ name: "", cat: "sweets", price: "", unit: "", desc: "", image: "", tag: "" });
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setSaved(null), 2200);
      })
      .catch((err) => setServerError(err.message || "Couldn't add the product. Please try again."))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="page-shell">
      <button className="back-link" onClick={() => navigate("/admin")}><ArrowLeft size={16} /> Back to dashboard</button>
      <h1 className="page-title">Add a product</h1>
      <p className="page-sub">New items appear on the shop page immediately.</p>

      {saved && (
        <div className="save-toast card">
          <Package size={16} /> <strong>{saved.name}</strong> was added to the catalogue.
        </div>
      )}
      {serverError && <div className="auth-error">{serverError}</div>}

      <form className="card checkout-form" onSubmit={submit}>
        <label className="field">
          <span>Product name</span>
          <input value={form.name} onChange={update("name")} placeholder="Besan Ladoo" />
          {errors.name && <em>{errors.name}</em>}
        </label>

        <div className="field-row">
          <label className="field">
            <span>Category</span>
            <select value={form.cat} onChange={update("cat")}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Price (\u20B9)</span>
            <input value={form.price} onChange={update("price")} placeholder="350" inputMode="numeric" />
            {errors.price && <em>{errors.price}</em>}
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span>Unit / pack size</span>
            <input value={form.unit} onChange={update("unit")} placeholder="500g box" />
            {errors.unit && <em>{errors.unit}</em>}
          </label>
          <label className="field">
            <span>Badge (optional)</span>
            <input value={form.tag} onChange={update("tag")} placeholder="New, Bestseller, Popular..." />
          </label>
        </div>

        <div className="field">
          <span><ImageIcon size={14} /> Product image</span>

          <div className="image-upload-row">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} /> Upload from device
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-file-input"
            />
            {fileName && <span className="file-name">{fileName}</span>}
          </div>

          <div className="or-divider"><span>or paste an image URL</span></div>

          <input
            value={form.image.startsWith("data:") ? "" : form.image}
            onChange={update("image")}
            placeholder="https://... (leave everything blank to auto-generate one)"
            disabled={form.image.startsWith("data:")}
          />
          {errors.image && <em>{errors.image}</em>}
        </div>

        {form.image && (
          <div className="image-preview-wrap">
            <img src={form.image} alt="Preview" className="image-preview" onError={(e) => (e.currentTarget.style.display = "none")} />
            <button type="button" className="clear-image-btn" onClick={clearImage} aria-label="Remove image">
              <X size={13} />
            </button>
          </div>
        )}

        <label className="field">
          <span>Description</span>
          <textarea rows={3} value={form.desc} onChange={update("desc")} placeholder="Short, appetising description" />
          {errors.desc && <em>{errors.desc}</em>}
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Adding\u2026" : "Add product"}
        </button>
      </form>
    </div>
  );
}
