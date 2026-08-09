import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { selectAllProducts, removeProduct } from "../../store/productsSlice";
import { CATEGORIES } from "../../data/seed";
import "./Admin.css";

const inr = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;

export default function ManageProducts() {
  const products = useSelector(selectAllProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="page-shell wide">
      <button className="back-link" onClick={() => navigate("/admin")}><ArrowLeft size={16} /> Back to dashboard</button>
      <div className="admin-header">
        <div>
          <h1 className="page-title">Manage products</h1>
          <p className="page-sub">{products.length} items in the catalogue.</p>
        </div>
        <Link to="/admin/add-product" className="btn btn-primary"><Plus size={16} /> Add product</Link>
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Sold</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="thumb-cell"><img src={p.image} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>{CATEGORIES.find((c) => c.key === p.cat)?.label || p.cat}</td>
                <td>{inr(p.price)}</td>
                <td>{p.unit}</td>
                <td>{(p.sold || 0).toLocaleString("en-IN")}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (confirm(`Remove "${p.name}" from the catalogue?`)) dispatch(removeProduct(p.id));
                    }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
