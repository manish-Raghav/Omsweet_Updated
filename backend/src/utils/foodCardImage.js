// Generates an attractive gradient card with a large emoji as a data: URI,
// so every product has a nice-looking image even without a real photo -
// used for seed data, and as the fallback when an admin adds a product
// without uploading an image or pasting a URL.

const CATEGORY_COLORS = {
  sweets: { from: "#E7A33E", to: "#93611A" },
  bakery: { from: "#C1622E", to: "#7E3E1B" },
  drinks: { from: "#2F8F7F", to: "#195A4E" },
};

function foodCardImage(emoji, cat) {
  const { from, to } = CATEGORY_COLORS[cat] || CATEGORY_COLORS.sweets;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="520" viewBox="0 0 700 520">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="700" height="520" fill="url(#g)"/>
  <circle cx="350" cy="260" r="150" fill="#ffffff" fill-opacity="0.92"/>
  <text x="350" y="278" font-size="160" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

module.exports = { foodCardImage, CATEGORY_COLORS };
