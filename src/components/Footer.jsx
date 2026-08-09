import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { CATEGORIES } from "../data/seed";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-om">Om</span>
            <span className="logo-sweet">Sweet</span>
          </div>
          <p>Mithai, bakes &amp; chilled drinks made the old way, since 1978. Delivered fresh to your door.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">My box</Link>
        </div>

        <div className="footer-col">
          <h4>Shop by category</h4>
          {CATEGORIES.map((c) => (
            <Link to="/" key={c.key}>{c.label}</Link>
          ))}
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <span className="footer-contact-item"><MapPin size={14} /> MG Road, Dadri, UP 203207</span>
          <span className="footer-contact-item"><Phone size={14} /> +91 98765 43210</span>
          <span className="footer-contact-item"><Mail size={14} /> hello@omsweet.example</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} OmSweet. All rights reserved.</span>
        <span>Made fresh, delivered warm.</span>
      </div>
    </footer>
  );
}
