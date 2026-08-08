import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LayoutDashboard, LogOut, User } from "lucide-react";
import { selectCurrentUser, sessionEnded } from "../store/authSlice";
import { selectCartCount } from "../store/cartSlice";
import "./Header.css";

export default function Header() {
  const user = useSelector(selectCurrentUser);
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(sessionEnded());
    navigate("/");
  };

  return (
    <header className="site-header">
      <Link to="/" className="logo">
        <span className="logo-om">Om</span>
        <span className="logo-sweet">Sweet</span>
      </Link>

      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/category/sweets">Sweet</Link>
        <Link to="/category/bakery">Bakery</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {user && <Link to="/orders">My orders</Link>}
        {user?.role === "admin" && (
          <Link to="/admin" className="admin-link">
            <LayoutDashboard size={15} /> Admin
          </Link>
        )}
      </nav>

      <div className="header-right">
        <Link to="/cart" className="cart-btn">
          <ShoppingBag size={17} /> Box
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>

        {user ? (
          <div className="user-chip">
            <span className="user-avatar"><User size={14} /></span>
            <span className="user-name">{user.name.split(" ")[0]}</span>
            <button className="icon-btn" onClick={handleLogout} aria-label="Log out">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
