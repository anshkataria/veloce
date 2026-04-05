export const mockProducts = [
  {
    id: 1,
    name: "Lamborghini Huracán EVO",
    price: 32500000,
    originalPrice: 35000000,
    category: "supercars",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
    ],
    sizes: ["Standard", "Spyder"],
    description:
      "5.2L V10 naturally aspirated engine producing 630 hp. 0–100 km/h in 2.9 seconds. The pinnacle of Italian engineering.",
    inStock: true,
    isNew: true,
  },
  {
    id: 2,
    name: "Mercedes-AMG GT Black Series",
    price: 28900000,
    originalPrice: 30000000,
    category: "supercars",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
    ],
    sizes: ["Standard"],
    description:
      "4.0L biturbo V8, 730 hp. The most powerful AMG production car ever built. Track-focused, road-legal.",
    inStock: true,
    isNew: false,
  },
  {
    id: 3,
    name: "Porsche 911 GT3 RS",
    price: 23500000,
    originalPrice: 25000000,
    category: "sportscars",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    ],
    sizes: ["Coupe"],
    description:
      "4.0L flat-six, 525 hp, naturally aspirated. Aerodynamics borrowed from motorsport. The purist's choice.",
    inStock: true,
    isNew: true,
  },
  {
    id: 4,
    name: "Ferrari SF90 Stradale",
    price: 55000000,
    originalPrice: 58000000,
    category: "supercars",
    images: [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=80",
    ],
    sizes: ["Coupe", "Spider"],
    description:
      "Hybrid V8, 1000 hp total system output. Ferrari's most powerful road car. Plug-in hybrid meets hypercar performance.",
    inStock: true,
    isNew: false,
  },
  {
    id: 5,
    name: "BMW M4 Competition",
    price: 9800000,
    originalPrice: 10500000,
    category: "sportscars",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    ],
    sizes: ["Coupe", "Convertible", "xDrive"],
    description:
      "3.0L inline-six twin-turbo, 510 hp. The ultimate expression of BMW M performance. Daily driver meets track weapon.",
    inStock: true,
    isNew: false,
  },
  {
    id: 6,
    name: "Rolls-Royce Ghost",
    price: 68000000,
    originalPrice: 70000000,
    category: "luxury",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80",
    ],
    sizes: ["Standard", "Extended"],
    description:
      "6.75L twin-turbo V12, 563 hp. Whisper-quiet cabin, bespoke everything. The definitive luxury saloon.",
    inStock: true,
    isNew: false,
  },
  {
    id: 7,
    name: "Aston Martin DB12",
    price: 26500000,
    originalPrice: 28000000,
    category: "luxury",
    images: [
      "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&q=80",
    ],
    sizes: ["Coupe", "Volante"],
    description:
      "4.0L twin-turbo V8, 671 hp. The world's first super tourer. British elegance meets supercar performance.",
    inStock: true,
    isNew: true,
  },
  {
    id: 8,
    name: "McLaren 720S",
    price: 29500000,
    originalPrice: 31000000,
    category: "supercars",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    sizes: ["Coupe", "Spider"],
    description:
      "4.0L twin-turbo V8, 720 hp. Carbon fibre MonoCell II chassis. 0–100 in 2.9s. Pure McLaren DNA.",
    inStock: true,
    isNew: false,
  },
];

export const mockCategories = [
  {
    id: 1,
    name: "Supercars",
    slug: "supercars",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
    count: 12,
  },
  {
    id: 2,
    name: "Sportscars",
    slug: "sportscars",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    count: 8,
  },
  {
    id: 3,
    name: "Luxury cars",
    slug: "luxury",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80",
    count: 6,
  },
];
