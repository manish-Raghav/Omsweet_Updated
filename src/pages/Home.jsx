import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Search, Sparkles, ChevronRight, MapPin, Phone, Clock3, Heart, Leaf, Award } from "lucide-react";
import {
  selectAllProducts,
  selectFilteredProducts,
  selectFilteredStatus,
  fetchFilteredProducts,
} from "../store/productsSlice";
import { selectCart, itemAdded, itemIncremented, itemDecremented } from "../store/cartSlice";
import { CATEGORIES } from "../data/seed";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const products = useSelector(selectAllProducts);
  const searchResults = useSelector(selectFilteredProducts);
  const searchStatus = useSelector(selectFilteredStatus);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  const [activeCat, setActiveCat] = useState("all");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const isSearching = query.trim().length > 0;

  // Debounce the search box, then hit the backend search/filter endpoint.
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 350);
    return () => clearTimeout(t);
  }, [queryInput]);

  useEffect(() => {
    if (!isSearching) return;
    dispatch(fetchFilteredProducts({ search: query, cat: activeCat !== "all" ? activeCat : undefined }));
  }, [dispatch, query, activeCat, isSearching]);

  // When not searching, group the already-cached full catalogue by category.
  const grouped = useMemo(() => {
    if (isSearching) return [];
    return products.filter((p) => activeCat === "all" || p.cat === activeCat);
  }, [products, activeCat, isSearching]);

  const handleAdd = (id) => {
    dispatch(itemAdded({ id }));
    const p = products.find((x) => x.id === id) || searchResults.find((x) => x.id === id);
    setToast(`${p?.name || "Item"} added to your box`);
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div>
          <div className="hero-eyebrow"><Sparkles size={14} /> Since 1978 &middot; Pure ghee, fresh cream</div>
          <h1>Mithai, bakes &amp; chilled drinks, <em>made the old way.</em></h1>
          <p>Three kitchens under one roof &mdash; sweets, bakery and a chaat counter &mdash; delivered to your door within the hour.</p>
          <div className="hero-search">
            <Search size={16} />
            <input
              placeholder="Search for kaju katli, croissants, lassi..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
            />
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-ring" />
          <div className="hero-center">Fresh &amp;<br />handmade<br />daily</div>
        </div>
      </section>

      <div className="cat-strip">
        <button
          className={`cat-pill ${activeCat === "all" ? "active" : ""}`}
          style={activeCat === "all" ? { background: "var(--maroon)" } : {}}
          onClick={() => setActiveCat("all")}
        >
          All items
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`cat-pill ${activeCat === c.key ? "active" : ""}`}
            style={activeCat === c.key ? { background: c.dark } : {}}
            onClick={() => setActiveCat(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isSearching ? (
        searchStatus === "loading" && searchResults.length === 0 ? (
          <div className="empty-block">Searching&hellip;</div>
        ) : searchResults.length === 0 ? (
          <div className="empty-block">
            <span className="emoji">&#128269;</span>
            <strong>No items match &ldquo;{query}&rdquo;</strong>
            Try a different search or category.
          </div>
        ) : (
          <section className="cat-section">
            <div className="cat-section-head">
              <div>
                <h2>Search results</h2>
                <span>{searchResults.length} item{searchResults.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;</span>
              </div>
            </div>
            <div className="product-grid">
              {searchResults.map((p) => (
                <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={handleAdd} onInc={(id) => dispatch(itemIncremented(id))} onDec={(id) => dispatch(itemDecremented(id))} />
              ))}
            </div>
          </section>
        )
      ) : grouped.length === 0 ? (
        <div className="empty-block">
          <span className="emoji">&#128269;</span>
          <strong>No items in this category yet.</strong>
        </div>
      ) : activeCat !== "all" ? (
        <section className="cat-section">
          <div className="cat-section-head">
            <div>
              <h2>{CATEGORIES.find((c) => c.key === activeCat)?.label}</h2>
              <span>{CATEGORIES.find((c) => c.key === activeCat)?.tagline}</span>
            </div>
            <Link to={`/category/${activeCat}`} className="see-all-link">See all <ChevronRight size={15} /></Link>
          </div>
          <div className="product-grid">
            {grouped.map((p) => (
              <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={handleAdd} onInc={(id) => dispatch(itemIncremented(id))} onDec={(id) => dispatch(itemDecremented(id))} />
            ))}
          </div>
        </section>
      ) : (
        CATEGORIES.map((c) => {
          const items = grouped.filter((p) => p.cat === c.key);
          if (items.length === 0) return null;
          return (
            <section className="cat-section" key={c.key}>
              <div className="cat-section-head">
                <div>
                  <h2>{c.label}</h2>
                  <span>{c.tagline}</span>
                </div>
                <Link to={`/category/${c.key}`} className="see-all-link">See all <ChevronRight size={15} /></Link>
              </div>
              <div className="product-grid">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={handleAdd} onInc={(id) => dispatch(itemIncremented(id))} onDec={(id) => dispatch(itemDecremented(id))} />
                ))}
              </div>
            </section>
          );
        })
      )}

      <section className="story-section">
        <div className="story-media">
          <img src="https://as2.ftcdn.net/jpg/08/24/93/01/1000_F_824930172_EDHlBbHEBgbIfo4AQt2XMPR324ICg7La.jpg" alt="Inside the OmSweet kitchen" />
          <div className="story-badge"><Award size={16} /> Est. 1978</div>
        </div>
        <div className="story-copy">
          <div className="hero-eyebrow"><Heart size={14} /> Our story</div>
          <h2>Three generations, one mithai counter.</h2>
          <p>
            OmSweet began as a single sweet counter run by our grandfather in 1978. Today the same
            recipes are made fresh every morning &mdash; no shortcuts, no preservatives, just pure ghee,
            fresh milk and a lot of patience.
          </p>
          <div className="story-stats">
            <div>
              <strong>45+</strong>
              <span>years of craft</span>
            </div>
            <div>
              <strong>60+</strong>
              <span>sweets &amp; bakes</span>
            </div>
            <div>
              <strong>1M+</strong>
              <span>boxes delivered</span>
            </div>
          </div>
          <div className="story-values">
            <span><Leaf size={14} /> No preservatives</span>
            <span><Heart size={14} /> Family recipes</span>
          </div>
          <Link to="/about" className="btn btn-primary">
            Read our full story <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <section className="contact-teaser">
        <div className="contact-teaser-copy">
          <div className="hero-eyebrow"><MapPin size={14} /> Visit or reach us</div>
          <h2>We'd love to see you at the store.</h2>
          <p>Have a custom order, a bulk gifting request, or just a question about an ingredient? We're a call, email or short drive away.</p>
          <div className="contact-teaser-grid">
            <div className="contact-teaser-item">
              <MapPin size={18} />
              <div>
                <strong>Flagship store</strong>
                <span>MG Road, Dadri, Uttar Pradesh 203207</span>
              </div>
            </div>
            <div className="contact-teaser-item">
              <Phone size={18} />
              <div>
                <strong>Call us</strong>
                <span>+91 98765 43210</span>
              </div>
            </div>
            <div className="contact-teaser-item">
              <Clock3 size={18} />
              <div>
                <strong>Open daily</strong>
                <span>8:00 AM &ndash; 10:00 PM</span>
              </div>
            </div>
          </div>
          <Link to="/contact" className="btn btn-gold">
            Get in touch <ChevronRight size={16} />
          </Link>
        </div>
        <div className="contact-teaser-map">
          <iframe
            title="OmSweet store location"
            src="https://www.google.com/maps?q=Dadri,Uttar+Pradesh,India&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
