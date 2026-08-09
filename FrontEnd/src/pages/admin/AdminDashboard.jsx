import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Users, IndianRupee, Plus, ListChecks } from "lucide-react";
import { selectAllProducts } from "../../store/productsSlice";
import { selectAllOrdersAdmin, fetchAllOrders } from "../../store/ordersSlice";
import { selectAllUsers, fetchAllUsers } from "../../store/authSlice";
import "./Admin.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const orders = useSelector(selectAllOrdersAdmin);
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const customerCount = users.filter((u) => u.role !== "admin").length;

  const stats = [
    { label: "Total products", value: products.length, icon: Package },
    { label: "Total orders", value: orders.length, icon: ShoppingCart },
    { label: "Registered users", value: customerCount, icon: Users },
    { label: "Revenue", value: inr(revenue), icon: IndianRupee },
  ];

  return (
    <div className="page-shell wide">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin dashboard</h1>
          <p className="page-sub">Overview of OmSweet's catalogue and orders.</p>
        </div>
        <div className="admin-actions">
          <Link to="/admin/add-product" className="btn btn-primary"><Plus size={16} /> Add product</Link>
          <Link to="/admin/products" className="btn btn-outline"><ListChecks size={16} /> Manage products</Link>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card card" key={s.label}>
            <div className="stat-icon"><s.icon size={18} /></div>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card recent-orders">
        <h3>Recent orders</h3>
        {orders.length === 0 ? (
          <p className="hint-text">No orders placed yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.userName}</td>
                  <td>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td>{inr(o.total)}</td>
                  <td><span className="badge badge-gold">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
