import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { login } from "../store/authSlice";
import "./Auth.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    dispatch(login(form))
      .unwrap()
      .then((user) => {
        navigate(user.role === "admin" ? "/admin" : redirect, { replace: true });
      })
      .catch((err) => setError(err.message || "Couldn't log in. Please try again."))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">Welcome back</div>
        <h1>Log in to OmSweet</h1>
        <p className="sub">Pick up your box right where you left it.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <label className="field">
            <span><Mail size={14} /> Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            <span><Lock size={14} /> Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in\u2026" : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New to OmSweet? <Link to="/signup">Create an account</Link>
        </p>

        <div className="demo-hint">
          Demo admin login &mdash; email: <strong>admin@omsweet.com</strong>, password: <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}
