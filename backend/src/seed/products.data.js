const { foodCardImage } = require("../utils/foodCardImage");

const img = (emoji, cat) => foodCardImage(emoji, cat);


const SEED_PRODUCTS = [
   

    {
        cat: "sweets",
        name: "Kaju Katli",
        desc: "Diamond-cut cashew fudge, silver-leafed and made in small batches every morning with pure ghee.",
        price: 520,
        unit: "500g box",
        image: "https://ahmedabadshopping.com/wp-content/uploads/2026/01/kaju-katli-indian-sweet-600x900.webp",
        tag: "Bestseller",
        sold: 1840,
        rating: 4.9
    },

    {
        cat: "sweets",
        name: "Motichoor Ladoo",
        desc: "Pearl-drop besan boondi, slow-fried and bound with cardamom and saffron syrup.",
        price: 380,
        unit: "500g box",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        tag: "Popular",
        sold: 1520,
        rating: 4.8
    },

    {
        cat: "sweets",
        name: "Gulab Jamun",
        desc: "Soft khoya dumplings, deep fried golden and soaked in rose-scented sugar syrup.",
        price: 320,
        unit: "12 pcs",
        image: "https://images.unsplash.com/photo-1666190094766-5f6b7c6c5e0f",
        tag: null,
        sold: 1275,
        rating: 4.7
    },

    {
        cat: "sweets",
        name: "Rasgulla",
        desc: "Spongy chhena balls simmered in a light sugar syrup, served chilled.",
        price: 300,
        unit: "12 pcs",
        image: "https://images.unsplash.com/photo-1605196560546-1c6f9e0f7d5c",
        tag: null,
        sold: 980,
        rating: 4.6
    },

    {
        cat: "sweets",
        name: "Kalakand",
        desc: "Milk-solid squares, slow-set on a low flame for that classic grainy melt-in-mouth texture.",
        price: 450,
        unit: "500g box",
        image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7",
        tag: "New",
        sold: 640,
        rating: 4.8
    },

    {
        cat: "sweets",
        name: "Soan Papdi",
        desc: "Flaky gram-flour threads folded into delicate layers and dusted with crushed pistachio.",
        price: 260,
        unit: "400g box",
        image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb",
        tag: null,
        sold: 410,
        rating: 4.5
    },


   

    {
        cat: "bakery",
        name: "Butter Croissant",
        desc: "36-layer laminated dough, hand-rolled and baked to order until golden and flaky.",
        price: 90,
        unit: "1 pc",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
        tag: "New",
        sold: 1420,
        rating: 4.7
    },

    {
        cat: "bakery",
        name: "Chocolate Pastry",
        desc: "Dark cocoa sponge layered with silky ganache and finished with chocolate shavings.",
        price: 140,
        unit: "1 pc",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        tag: "Popular",
        sold: 1690,
        rating: 4.8
    },

    {
        cat: "bakery",
        name: "Multigrain Loaf",
        desc: "Stone-milled grains, slow fermented and baked in a wood-fired oven for a crisp crust.",
        price: 110,
        unit: "400g loaf",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
        tag: null,
        sold: 730,
        rating: 4.5
    },

    {
        cat: "bakery",
        name: "Assorted Cookies",
        desc: "Oatmeal raisin, double chocolate and almond crisp, baked fresh and packed together.",
        price: 220,
        unit: "box of 8",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
        tag: "Bestseller",
        sold: 1350,
        rating: 4.7
    },

    {
        cat: "bakery",
        name: "Vanilla Cupcake",
        desc: "Madagascar vanilla bean sponge topped with a swirl of cream-cheese frosting.",
        price: 75,
        unit: "1 pc",
        image: "https://images.unsplash.com/photo-1587668178277-295251f900ce",
        tag: null,
        sold: 590,
        rating: 4.6
    },

    {
        cat: "bakery",
        name: "Glazed Donut",
        desc: "Pillow-soft yeasted dough, fried to order and finished with a honey glaze.",
        price: 65,
        unit: "1 pc",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
        tag: null,
        sold: 480,
        rating: 4.4
    },


    // ==================== DRINKS ====================

    {
        cat: "drinks",
        name: "Mango Lassi",
        desc: "Alphonso mango pulp whisked with yogurt and a pinch of salt, served chilled.",
        price: 110,
        unit: "500ml",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41",
        tag: "Bestseller",
        sold: 1120,
        rating: 4.9
    },

    {
        cat: "drinks",
        name: "Thandai",
        desc: "Almond, fennel and saffron infused milk, chilled and finished with a sprinkle of nuts.",
        price: 130,
        unit: "500ml",
        image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7",
        tag: "New",
        sold: 520,
        rating: 4.8
    },

    {
        cat: "drinks",
        name: "Cold Coffee",
        desc: "Slow-brewed coffee blended with vanilla ice cream and a dusting of cocoa.",
        price: 120,
        unit: "500ml",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        tag: "Popular",
        sold: 860,
        rating: 4.7
    }
];

module.exports = SEED_PRODUCTS;


