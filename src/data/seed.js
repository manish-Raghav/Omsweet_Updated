

export const SEED_ADMIN = {
  name: "Om Admin",
  email: "admin@omsweet.com",
  password: "admin123", 
  role: "admin",
};

export const CATEGORIES = [
  { key: "sweets", label: "Sweets", tagline: "Mithai made fresh, daily", accent: "var(--sweets)", dark: "var(--sweets-dark)" },
  { key: "bakery", label: "Bakery", tagline: "Baked golden, every morning", accent: "var(--bakery)", dark: "var(--bakery-dark)" },
  { key: "drinks", label: "Cold Drinks", tagline: "Chilled & poured to order", accent: "var(--drinks)", dark: "var(--drinks-dark)" },
];


const img = (seed) => `https://picsum.photos/seed/omsweet-${seed}/700/520`;

export const SEED_PRODUCTS = [
  { id: "s1", cat: "sweets", name: "Kaju Katli", desc: "Diamond-cut cashew fudge, silver-leafed and made in small batches every morning with pure ghee.", price: 520, unit: "500g box", image: img("s1"), tag: "Bestseller", sold: 1840, rating: 4.9 },
  { id: "s2", cat: "sweets", name: "Motichoor Ladoo", desc: "Pearl-drop besan boondi, slow-fried and bound with cardamom and saffron syrup.", price: 380, unit: "500g box", image: img("s2"), tag: "Popular", sold: 1520, rating: 4.8 },
  { id: "s3", cat: "sweets", name: "Gulab Jamun", desc: "Soft khoya dumplings, deep fried golden and soaked in rose-scented sugar syrup.", price: 320, unit: "12 pcs", image: img("s3"), tag: null, sold: 1275, rating: 4.7 },
  { id: "s4", cat: "sweets", name: "Rasgulla", desc: "Spongy chhena balls simmered in a light sugar syrup, served chilled.", price: 300, unit: "12 pcs", image: img("s4"), tag: null, sold: 980, rating: 4.6 },
  { id: "s5", cat: "sweets", name: "Kalakand", desc: "Milk-solid squares, slow-set on a low flame for that classic grainy melt-in-mouth texture.", price: 450, unit: "500g box", image: img("s5"), tag: "New", sold: 640, rating: 4.8 },
  { id: "s6", cat: "sweets", name: "Soan Papdi", desc: "Flaky gram-flour threads folded into delicate layers and dusted with crushed pistachio.", price: 260, unit: "400g box", image: img("s6"), tag: null, sold: 410, rating: 4.5 },
  { id: "b1", cat: "bakery", name: "Butter Croissant", desc: "36-layer laminated dough, hand-rolled and baked to order until golden and flaky.", price: 90, unit: "1 pc", image: img("b1"), tag: "New", sold: 1420, rating: 4.7 },
  { id: "b2", cat: "bakery", name: "Chocolate Pastry", desc: "Dark cocoa sponge layered with silky ganache and finished with chocolate shavings.", price: 140, unit: "1 pc", image: img("b2"), tag: "Popular", sold: 1690, rating: 4.8 },
  { id: "b3", cat: "bakery", name: "Multigrain Loaf", desc: "Stone-milled grains, slow fermented and baked in a wood-fired oven for a crisp crust.", price: 110, unit: "400g loaf", image: img("b3"), tag: null, sold: 730, rating: 4.5 },
  { id: "b4", cat: "bakery", name: "Assorted Cookies", desc: "Oatmeal raisin, double chocolate and almond crisp, baked fresh and packed together.", price: 220, unit: "box of 8", image: img("b4"), tag: "Bestseller", sold: 1350, rating: 4.7 },
  { id: "b5", cat: "bakery", name: "Vanilla Cupcake", desc: "Madagascar vanilla bean sponge topped with a swirl of cream-cheese frosting.", price: 75, unit: "1 pc", image: img("b5"), tag: null, sold: 590, rating: 4.6 },
  { id: "b6", cat: "bakery", name: "Glazed Donut", desc: "Pillow-soft yeasted dough, fried to order and finished with a honey glaze.", price: 65, unit: "1 pc", image: img("b6"), tag: null, sold: 480, rating: 4.4 },
  { id: "d1", cat: "drinks", name: "Mango Lassi", desc: "Alphonso mango pulp whisked with yogurt and a pinch of salt, served chilled.", price: 110, unit: "500ml", image: img("d1"), tag: "Bestseller", sold: 1120, rating: 4.9 },
  { id: "d2", cat: "drinks", name: "Thandai", desc: "Almond, fennel and saffron infused milk, chilled and finished with a sprinkle of nuts.", price: 130, unit: "500ml", image: img("d2"), tag: "New", sold: 520, rating: 4.8 },
  { id: "d3", cat: "drinks", name: "Cold Coffee", desc: "Slow-brewed coffee blended with vanilla ice cream and a dusting of cocoa.", price: 120, unit: "500ml", image: img("d3"), tag: "Popular", sold: 860, rating: 4.7 },
];
