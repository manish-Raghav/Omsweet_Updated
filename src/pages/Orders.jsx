import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Package, Clock } from "lucide-react";
import { selectMyOrders, fetchMyOrders } from "../store/ordersSlice";
import "./Orders.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;

export default function Orders() {
  const dispatch = useDispatch();
  const myOrders = useSelector(selectMyOrders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="page-shell wide">
      <h1 className="page-title">My orders</h1>
      <p className="page-sub">Everything you've ordered from OmSweet.</p>

      {myOrders.length === 0 ? (
        <div className="empty-block">
          <span className="emoji">&#128230;</span>
          <strong>No orders yet.</strong>
          Once you place an order, it'll show up here.
          <div style={{ marginTop: 18 }}>
            <Link to="/" className="btn btn-primary">Browse the shop</Link>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {myOrders.map((o) => (
            <div className="card order-row" key={o.id}>
              <div className="order-row-head">
                <div>
                  <p className="order-id"><Package size={15} /> {o.id}</p>
                  <p className="order-date"><Clock size={12} /> {new Date(o.date).toLocaleString("en-IN")}</p>
                </div>
                <span className="badge badge-gold">{o.status}</span>
              </div>
              <div className="order-items">
                {o.items.map((it) => (
                  <span key={it.id} className="order-item-chip">{it.name} &times;{it.qty}</span>
                ))}
              </div>
              <div className="row total"><span>Total</span><span>{inr(o.total)}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
