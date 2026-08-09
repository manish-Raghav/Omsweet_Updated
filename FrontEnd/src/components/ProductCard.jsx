import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, ImageOff, Flame } from "lucide-react";
import { CATEGORIES } from "../data/seed";
import "./ProductCard.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;

export default function ProductCard({ product, qty, onAdd, onInc, onDec, showSold = false }) {
  const cat = CATEGORIES.find((c) => c.key === product.cat) || CATEGORIES[0];
  const navigate = useNavigate();

  const goToDetail = () => navigate(`/product/${product.id}`);
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      className="product-card"
      style={{ "--accent": cat.accent, "--accent-dark": cat.dark }}
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goToDetail()}
    >
      <div className="product-media">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        ) : (
          <div className="product-image-fallback"><ImageOff size={22} /></div>
        )}
        <span className="cat-strip" />
        {product.tag && <span className="tag-badge">{product.tag}</span>}
        {showSold && product.sold > 0 && (
          <span className="sold-badge"><Flame size={11} /> {product.sold.toLocaleString("en-IN")}+ sold</span>
        )}
      </div>
      <div className="scallop" aria-hidden="true" />
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-foot">
          <div className="price-block">
            <span className="price">{inr(product.price)}</span>
            <span className="unit">{product.unit}</span>
          </div>
          {qty > 0 ? (
            <div className="stepper" onClick={stop(() => {})}>
              <button aria-label={`Remove one ${product.name}`} onClick={stop(() => onDec(product.id))}><Minus size={14} /></button>
              <span>{qty}</span>
              <button aria-label={`Add one more ${product.name}`} onClick={stop(() => onInc(product.id))}><Plus size={14} /></button>
            </div>
          ) : (
            <button className="add-btn" onClick={stop(() => onAdd(product.id))}>
              <Plus size={15} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
