import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Plus, Minus, ShoppingBag, Star, Flame, Truck, ShieldCheck } from "lucide-react";
import { selectProductById, selectAllProducts } from "../store/productsSlice";
import { selectCart, itemAdded, itemIncremented, itemDecremented } from "../store/cartSlice";
import { CATEGORIES } from "../data/seed";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import "./ProductDetail.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector(selectProductById(id));
  const cart = useSelector(selectCart);
  const products = useSelector(selectAllProducts);
  const [toast, setToast] = useState(null);

  const category = useMemo(() => CATEGORIES.find((c) => c.key === product?.cat), [product]);
  const relatedItems = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 4);
  }, [products, product]);
  const qty = cart[id] || 0;

  if (!product) return <Navigate to="/" replace />;

  const handleAdd = () => {
    dispatch(itemAdded({ id: product.id }));
    setToast(`${product.name} added to your box`);
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <div className="product-detail-page">
      <div className="page-shell wide">
        <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>

        <div className="detail-grid">
          <div className="detail-media">
            <img src={product.image} alt={product.name} />
            {product.tag && <span className="detail-tag">{product.tag}</span>}
          </div>

          <div className="detail-info">
            <Link to={`/category/${product.cat}`} className="detail-cat-link" style={{ color: category?.dark }}>
              {category?.label}
            </Link>
            <h1>{product.name}</h1>

            <div className="detail-meta-row">
              {product.rating && (
                <span className="detail-rating"><Star size={14} fill="currentColor" strokeWidth={0} /> {product.rating}</span>
              )}
              {product.sold > 0 && (
                <span className="detail-sold"><Flame size={14} /> {product.sold.toLocaleString("en-IN")}+ sold</span>
              )}
            </div>

            <p className="detail-desc">{product.desc}</p>

            <div className="detail-price-row">
              <span className="detail-price">{inr(product.price)}</span>
              <span className="detail-unit">/ {product.unit}</span>
            </div>

            <div className="detail-actions">
              {qty > 0 ? (
                <div className="stepper large">
                  <button onClick={() => dispatch(itemDecremented(product.id))} aria-label="Decrease quantity"><Minus size={16} /></button>
                  <span>{qty}</span>
                  <button onClick={() => dispatch(itemIncremented(product.id))} aria-label="Increase quantity"><Plus size={16} /></button>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={handleAdd}>
                  <ShoppingBag size={16} /> Add to box
                </button>
              )}
              <Link to="/cart" className="btn btn-outline">View box</Link>
            </div>

            <div className="detail-perks">
              <span><Truck size={15} /> Delivered in 45&ndash;60 minutes</span>
              <span><ShieldCheck size={15} /> Made fresh, same-day</span>
            </div>
          </div>
        </div>

        {relatedItems.length > 0 && (
          <section className="related-section">
            <h2>More from {category?.label}</h2>
            <div className="product-grid">
              {relatedItems.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  qty={cart[p.id] || 0}
                  onAdd={(pid) => dispatch(itemAdded({ id: pid }))}
                  onInc={(pid) => dispatch(itemIncremented(pid))}
                  onDec={(pid) => dispatch(itemDecremented(pid))}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
