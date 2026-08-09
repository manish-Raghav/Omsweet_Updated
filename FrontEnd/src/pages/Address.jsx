import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin } from "lucide-react";
import { selectCurrentUser } from "../store/authSlice";
import { selectCheckoutAddress, addressSaved } from "../store/checkoutSlice";
import "./Checkout.css";

export default function Address() {
  const user = useSelector(selectCurrentUser);
  const address = useSelector(selectCheckoutAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(
    address || { name: user?.name || "", phone: "", address: "", city: "", pincode: "" }
  );
  const [errors, setErrors] = useState({});

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) e.address = "Enter your address";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(addressSaved(form));
    navigate("/checkout/payment");
  };

  return (
    <div className="page-shell">
      <button className="back-link" onClick={() => navigate("/cart")}><ArrowLeft size={16} /> Back to box</button>
      <h1 className="page-title">Delivery details</h1>
      <p className="page-sub">Tell us where to send your box.</p>

      <form className="card checkout-form" onSubmit={submit}>
        <label className="field">
          <span><User size={14} /> Full name</span>
          <input value={form.name} onChange={update("name")} placeholder="Anjali Sharma" />
          {errors.name && <em>{errors.name}</em>}
        </label>
        <label className="field">
          <span><Phone size={14} /> Phone number</span>
          <input value={form.phone} onChange={update("phone")} placeholder="98765 43210" inputMode="numeric" />
          {errors.phone && <em>{errors.phone}</em>}
        </label>
        <label className="field">
          <span><MapPin size={14} /> Address</span>
          <input value={form.address} onChange={update("address")} placeholder="House no., street, landmark" />
          {errors.address && <em>{errors.address}</em>}
        </label>
        <div className="field-row">
          <label className="field">
            <span>City</span>
            <input value={form.city} onChange={update("city")} placeholder="Dadri" />
            {errors.city && <em>{errors.city}</em>}
          </label>
          <label className="field">
            <span>Pincode</span>
            <input value={form.pincode} onChange={update("pincode")} placeholder="203207" inputMode="numeric" />
            {errors.pincode && <em>{errors.pincode}</em>}
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Continue to payment</button>
      </form>
    </div>
  );
}
