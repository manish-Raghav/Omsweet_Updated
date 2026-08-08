import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Banknote } from "lucide-react";
import { selectCart, cartCleared } from "../store/cartSlice";
import { selectAllKnownProducts, fetchProducts } from "../store/productsSlice";
import { selectCheckoutAddress } from "../store/checkoutSlice";
import { placeOrder } from "../store/ordersSlice";
import "./Checkout.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;
const DELIVERY_FEE = 40;
const FREE_DELIVERY_OVER = 999;

export default function Payment() {
  const cart = useSelector(selectCart);
  const products = useSelector(selectAllKnownProducts);
  const address = useSelector(selectCheckoutAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [method, setMethod] = useState("card");
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
      .filter((i) => i.product && i.qty > 0);
  }, [cart, products]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!address) {
      navigate("/checkout/address", { replace: true });
    } else if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [address, items.length, navigate]);

  if (!address || items.length === 0) return null;

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handlePay = () => {
    setPaying(true);
    setPayError("");

    const orderItems = items.map((i) => ({ id: i.product.id, qty: i.qty }));
    const minDelay = new Promise((resolve) => setTimeout(resolve, 900)); // brief "processing" feel

    Promise.all([
      dispatch(placeOrder({ items: orderItems, address, paymentMethod: method })).unwrap(),
      minDelay,
    ])
      .then(([order]) => {
        dispatch(fetchProducts()); // pick up updated sold-counts for "top sold" sections
        dispatch(cartCleared());
        navigate("/order-success", { state: { order } });
      })
      .catch((err) => setPayError(err.message || "Payment couldn't be completed. Please try again."))
      .finally(() => setPaying(false));
  };

  return (
    <div className="page-shell">
      <button className="back-link" onClick={() => navigate("/checkout/address")}><ArrowLeft size={16} /> Back to details</button>
      <h1 className="page-title">Payment</h1>
      <p className="page-sub">Choose how you'd like to pay.</p>
      {payError && <div className="auth-error">{payError}</div>}

      <div className="payment-grid">
        <div className="method-panel">
          <div className="method-tabs">
            <button className={method === "card" ? "active" : ""} onClick={() => setMethod("card")}>
              <CreditCard size={16} /> Card
            </button>
            <button className={method === "upi" ? "active" : ""} onClick={() => setMethod("upi")}>
              <Smartphone size={16} /> UPI
            </button>
            <button className={method === "cod" ? "active" : ""} onClick={() => setMethod("cod")}>
              <Banknote size={16} /> Cash on delivery
            </button>
          </div>

          {method === "card" && (
            <div className="card compact">
              <label className="field">
                <span>Card number</span>
                <input
                  value={cardForm.number}
                  onChange={(e) => setCardForm((f) => ({ ...f, number: formatCardNumber(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  maxLength={19}
                />
              </label>
              <label className="field">
                <span>Name on card</span>
                <input value={cardForm.name} onChange={(e) => setCardForm((f) => ({ ...f, name: e.target.value }))} placeholder="Anjali Sharma" />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Expiry</span>
                  <input value={cardForm.expiry} onChange={(e) => setCardForm((f) => ({ ...f, expiry: e.target.value }))} placeholder="MM/YY" maxLength={5} />
                </label>
                <label className="field">
                  <span>CVV</span>
                  <input value={cardForm.cvv} onChange={(e) => setCardForm((f) => ({ ...f, cvv: e.target.value }))} placeholder="123" maxLength={3} inputMode="numeric" />
                </label>
              </div>
            </div>
          )}

          {method === "upi" && (
            <div className="card compact">
              <label className="field">
                <span>UPI ID</span>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" />
              </label>
              <p className="hint-text">You'll get a payment request on your UPI app to approve.</p>
            </div>
          )}

          {method === "cod" && (
            <div className="card compact">
              <p className="hint-text">
                Pay <strong>{inr(total)}</strong> in cash when your box arrives. Please keep exact change ready for our delivery partner.
              </p>
            </div>
          )}
        </div>

        <div className="summary-panel card">
          <h3>Order summary</h3>
          <div className="summary-items">
            {items.map(({ product, qty }) => (
              <div className="summary-item" key={product.id}>
                <span className="summary-item-name">
                  <img src={product.image} alt="" className="summary-item-thumb" />
                  {product.name} <em>&times;{qty}</em>
                </span>
                <span>{inr(product.price * qty)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="row"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="row muted"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : inr(deliveryFee)}</span></div>
            <div className="row total"><span>Total</span><span>{inr(total)}</span></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={handlePay} disabled={paying}>
            {paying ? "Processing\u2026" : `Pay ${inr(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
