import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ChevronRight, ArrowLeft } from "lucide-react";
import { selectCart, itemIncremented, itemDecremented, itemRemoved } from "../store/cartSlice";
import { selectAllKnownProducts } from "../store/productsSlice";
import { selectCurrentUser } from "../store/authSlice";
import "./Cart.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;
const DELIVERY_FEE = 40;
const FREE_DELIVERY_OVER = 999;

export default function Cart() {
  const cart = useSelector(selectCart);
  const products = useSelector(selectAllKnownProducts);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
      .filter((i) => i.product && i.qty > 0);
  }, [cart, products]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const goToCheckout = () => {
    if (!user) {
      navigate("/login?redirect=" + encodeURIComponent("/checkout/address"));
      return;
    }
    navigate("/checkout/address");
  };

  return (
    <div className="page-shell">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Continue shopping</Link>
      <h1 className="page-title">Your box</h1>
      <p className="page-sub">Review your items before checkout.</p>

      {items.length === 0 ? (
        <div className="empty-block">
          <span className="emoji">&#129833;</span>
          <strong>Your box is empty.</strong>
          Add some mithai, bakes or a chilled drink to get started.
          <div style={{ marginTop: 18 }}>
            <Link to="/" className="btn btn-primary">Browse the shop</Link>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items card">
            {items.map(({ product, qty }) => (
              <div className="cart-row" key={product.id}>
                <div className="cart-row-emoji">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="cart-row-info">
                  <p className="ci-name">{product.name}</p>
                  <p className="ci-unit">{product.unit}</p>
                </div>
                <div className="stepper">
                  <button onClick={() => dispatch(itemDecremented(product.id))} aria-label={`Decrease ${product.name}`}><Minus size={13} /></button>
                  <span>{qty}</span>
                  <button onClick={() => dispatch(itemIncremented(product.id))} aria-label={`Increase ${product.name}`}><Plus size={13} /></button>
                </div>
                <div className="cart-row-right">
                  <span className="ci-price">{inr(product.price * qty)}</span>
                  <button className="remove-btn" onClick={() => dispatch(itemRemoved(product.id))} aria-label={`Remove ${product.name}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3>Order summary</h3>
            <div className="row"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="row muted"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : inr(deliveryFee)}</span></div>
            {subtotal > 0 && subtotal < FREE_DELIVERY_OVER && (
              <p className="free-hint">Add {inr(FREE_DELIVERY_OVER - subtotal)} more for free delivery</p>
            )}
            <div className="row total"><span>Total</span><span>{inr(total)}</span></div>
            <button className="btn btn-primary btn-block" onClick={goToCheckout}>
              Proceed to checkout <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
