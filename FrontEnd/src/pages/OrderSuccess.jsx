import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle2, Clock, Truck } from "lucide-react";
import "./OrderSuccess.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="page-shell success-shell">
      <div className="success-icon"><CheckCircle2 size={56} strokeWidth={1.5} /></div>
      <h1 className="page-title">Order confirmed</h1>
      <p className="page-sub">Your box is being packed with care.</p>
      <div className="card order-card">
        <div className="row"><span>Order ID</span><span>{order.id}</span></div>
        <div className="row"><span>Amount paid</span><span>{inr(order.total)}</span></div>
        <div className="row"><span>Delivering to</span><span>{order.address.city}, {order.address.pincode}</span></div>
        <div className="row"><span><Clock size={14} /> Estimated arrival</span><span>45&ndash;60 minutes</span></div>
        <div className="row"><span><Truck size={14} /> Status</span><span>{order.status}</span></div>
      </div>
      <button className="btn btn-primary" onClick={() => navigate("/")}>Continue shopping</button>
    </div>
  );
}
