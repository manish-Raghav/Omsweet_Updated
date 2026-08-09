import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Flame, SlidersHorizontal, Search, ArrowLeft } from "lucide-react";
import {
  selectFilteredProducts,
  selectFilteredStatus,
  selectTopSoldFor,
  fetchFilteredProducts,
  fetchTopSold,
} from "../store/productsSlice";
import { selectCart, itemAdded, itemIncremented, itemDecremented } from "../store/cartSlice";
import { CATEGORIES } from "../data/seed";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import "./CategoryPage.css";

const PRICE_BUCKETS = [
  { key: "all", label: "Any price" },
  { key: "under100", label: "Under \u20B9100", maxPrice: 99 },
  { key: "100to300", label: "\u20B9100 \u2013 \u20B9300", minPrice: 100, maxPrice: 300 },
  { key: "300to500", label: "\u20B9300 \u2013 \u20B9500", minPrice: 301, maxPrice: 500 },
  { key: "above500", label: "Above \u20B9500", minPrice: 501 },
];

const SORTS = [
  { key: "top-sold", label: "Top sold" },
  { key: "price-low", label: "Price: Low to High" },
  { key: "price-high", label: "Price: High to Low" },
  { key: "name", label: "Name: A to Z" },
];

export default function CategoryPage() {
  const { catKey } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const products = useSelector(selectFilteredProducts);
  const status = useSelector(selectFilteredStatus);
  const topSold = useSelector(selectTopSoldFor(catKey));

  const [priceBucket, setPriceBucket] = useState("all");
  const [sortBy, setSortBy] = useState("top-sold");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const category = CATEGORIES.find((c) => c.key === catKey);

  // Debounce the search box so we're not firing a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset local filters whenever the category itself changes.
  useEffect(() => {
    setPriceBucket("all");
    setSortBy("top-sold");
    setSearchInput("");
    setSearch("");
  }, [catKey]);

  useEffect(() => {
    if (!category) return;
    dispatch(fetchTopSold({ cat: catKey, limit: 4 }));
  }, [dispatch, catKey, category]);

  useEffect(() => {
    if (!category) return;
    const bucket = PRICE_BUCKETS.find((b) => b.key === priceBucket);
    dispatch(
      fetchFilteredProducts({
        cat: catKey,
        search: search || undefined,
        minPrice: bucket?.minPrice,
        maxPrice: bucket?.maxPrice,
        sort: sortBy,
      })
    );
  }, [dispatch, catKey, category, priceBucket, sortBy, search]);

  const handleAdd = (id) => dispatch(itemAdded({ id }));

  const emptyMessage = useMemo(() => {
    if (search) return `No ${category?.label.toLowerCase()} match \u201c${search}\u201d.`;
    return `No ${category?.label.toLowerCase()} match these filters.`;
  }, [search, category]);

  if (!category) return <Navigate to="/" replace />;

  return (
    <div className="category-page">
      <div className="category-hero" style={{ "--accent": category.accent, "--accent-dark": category.dark }}>
        <Link to="/" className="back-link light"><ArrowLeft size={16} /> Back to home</Link>
        <h1>{category.label}</h1>
        <p>{category.tagline}</p>
      </div>

      {topSold.length > 0 && (
        <section className="top-sold-section">
          <div className="top-sold-head">
            <Flame size={18} />
            <h2>Top selling {category.label.toLowerCase()}</h2>
          </div>
          <div className="top-sold-row">
            {topSold.map((p, i) => (
              <div className="top-sold-card" key={p.id}>
                <span className="rank-badge">#{i + 1}</span>
                <ProductCard
                  product={p}
                  qty={cart[p.id] || 0}
                  onAdd={handleAdd}
                  onInc={(id) => dispatch(itemIncremented(id))}
                  onDec={(id) => dispatch(itemDecremented(id))}
                  showSold
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="filter-bar">
        <div className="filter-group search-group">
          <span className="filter-label"><Search size={14} /> Search</span>
          <input
            className="category-search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Search ${category.label.toLowerCase()}...`}
          />
        </div>
        <div className="filter-group">
          <span className="filter-label"><SlidersHorizontal size={14} /> Price</span>
          <div className="filter-pills">
            {PRICE_BUCKETS.map((b) => (
              <button
                key={b.key}
                className={`filter-pill ${priceBucket === b.key ? "active" : ""}`}
                onClick={() => setPriceBucket(b.key)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </section>

      {status === "loading" && products.length === 0 ? (
        <div className="empty-block">Loading&hellip;</div>
      ) : products.length === 0 ? (
        <div className="empty-block">
          <span className="emoji">&#128269;</span>
          <strong>{emptyMessage}</strong>
          Try a different search or price range.
        </div>
      ) : (
        <section className="cat-section">
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={cart[p.id] || 0}
                onAdd={handleAdd}
                onInc={(id) => dispatch(itemIncremented(id))}
                onDec={(id) => dispatch(itemDecremented(id))}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
