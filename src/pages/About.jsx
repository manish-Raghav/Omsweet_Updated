import React from "react";
import { Link } from "react-router-dom";
import { Heart, Leaf, Award, Users, ChevronRight, Sparkles } from "lucide-react";
import "./About.css";

const TIMELINE = [
  { year: "1978", text: "Started as a single sweet counter in the old market, run by our grandfather." },
  { year: "1996", text: "Added a wood-fired bakery to the shop after years of neighbourhood requests." },
  { year: "2011", text: "Opened our second outlet and began catering for weddings and festivals." },
  { year: "2024", text: "Brought the full menu online, so every box can be delivered to your door." },
];

const VALUES = [
  { icon: Leaf, title: "No preservatives", text: "Everything is made same-day with fresh milk, seasonal fruit and pure ghee." },
  { icon: Heart, title: "Family recipes", text: "Every recipe is handed down, taste-tested and approved by three generations." },
  { icon: Award, title: "Quality first", text: "We'd rather sell out by evening than compromise on what goes in a box." },
  { icon: Users, title: "Community roots", text: "We source from local farms and dairies within a 50km radius of the shop." },
];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <div className="hero-eyebrow"><Sparkles size={14} /> Our story</div>
          <h1>Made with ghee, memory &amp; a little stubbornness.</h1>
          <p>
            OmSweet has been sweetening celebrations since 1978. What started as one counter in a
            crowded market has grown into a full sweets, bakery and cold-drinks kitchen &mdash; but
            the recipes, and the reason we do this, haven't changed.
          </p>
          <Link to="/contact" className="btn btn-primary">Get in touch <ChevronRight size={16} /></Link>
        </div>
        <div className="about-hero-media">
          <img src="https://as2.ftcdn.net/jpg/10/89/93/97/1000_F_1089939703_SUVFI3lL3fX23fmlvR6EGQnbMBCU1Q8F.jpg" alt="OmSweet sweet counter" />
        </div>
      </section>

      <section className="about-timeline-section">
        <h2>How we got here</h2>
        <div className="timeline">
          {TIMELINE.map((t) => (
            <div className="timeline-item" key={t.year}>
              <div className="timeline-year">{t.year}</div>
              <div className="timeline-line" />
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-values-section">
        <h2>What we stand for</h2>
        <div className="values-grid">
          {VALUES.map((v) => (
            <div className="value-card" key={v.title}>
              <div className="value-icon"><v.icon size={20} /></div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-gallery-section">
        <h2>Inside the kitchen</h2>
        <div className="gallery-grid">
          <img src="https://as2.ftcdn.net/jpg/09/21/54/73/1000_F_921547326_dweKaE1rf2CgiNilrSJaDOZA9jJrJAZU.jpg" alt="Sweets being prepared" />
          <img src="https://as2.ftcdn.net/jpg/20/96/32/31/1000_F_2096323174_HhUtYo8X1F7mv5NEuMsUqf796xmue2wl.jpg" alt="Fresh bakes on trays" />
          <img src="https://as2.ftcdn.net/jpg/19/64/77/23/1000_F_1964772390_r4zaF00x5hwguVnwioZY9ZRZHponqgkm.jpg" alt="Packing a mithai box" />
          <img src="https://c7.alamy.com/comp/AXXPJK/indian-sweets-on-sale-and-displayed-in-an-indian-sweet-shop-AXXPJK.jpg" alt="The OmSweet storefront" />
        </div>
      </section>

      <section className="about-cta">
        <h2>Hungry already?</h2>
        <p>Your box is a few taps away.</p>
        <Link to="/" className="btn btn-gold">Start shopping <ChevronRight size={16} /></Link>
      </section>
    </div>
  );
}
