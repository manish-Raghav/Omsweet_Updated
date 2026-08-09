import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock3, Send } from "lucide-react";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Tell us a little about your query";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Frontend-only demo: there's no backend to send this to, so we just
    // acknowledge it here. Wire this up to an email/API service in production.
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3200);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="hero-eyebrow"><Mail size={14} /> Contact</div>
        <h1>We'd love to hear from you.</h1>
        <p>Questions, bulk orders, feedback, or just craving recommendations &mdash; reach out any way that's easy for you.</p>
      </section>

      <section className="contact-grid">
        <div className="contact-info">
          <div className="info-card">
            <MapPin size={20} />
            <div>
              <h3>Visit the store</h3>
              <p>MG Road, Dadri, Uttar Pradesh 203207, India</p>
            </div>
          </div>
          <div className="info-card">
            <Phone size={20} />
            <div>
              <h3>Call us</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>
          <div className="info-card">
            <Mail size={20} />
            <div>
              <h3>Email us</h3>
              <p>hello@omsweet.example</p>
            </div>
          </div>
          <div className="info-card">
            <Clock3 size={20} />
            <div>
              <h3>Store hours</h3>
              <p>Every day, 8:00 AM &ndash; 10:00 PM</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <h3>Send us a message</h3>
          {sent && <div className="sent-note">Thanks! Your message has been noted &mdash; we'll get back to you soon.</div>}
          <label className="field">
            <span>Your name</span>
            <input value={form.name} onChange={update("name")} placeholder="Anjali Sharma" />
            {errors.name && <em>{errors.name}</em>}
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
            {errors.email && <em>{errors.email}</em>}
          </label>
          <label className="field">
            <span>Message</span>
            <textarea rows={4} value={form.message} onChange={update("message")} placeholder="How can we help?" />
            {errors.message && <em>{errors.message}</em>}
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            <Send size={15} /> Send message
          </button>
        </form>
      </section>

      <section className="contact-map-section">
        <iframe
          title="OmSweet location on the map"
          src="https://www.google.com/maps?q=Dadri,Uttar+Pradesh,India&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
