export interface AiProduct {
  title: string;
  priceUSD: number;
  image: string;
  desc: string;
  category: string;
}

export const AI_CATALOG: AiProduct[] = [
  {
    title: "Haldiram's Royal Kaju Katli Box",
    priceUSD: 22,
    category: "sweets",
    image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=500&q=80",
    desc: "Pure ghee handcrafted kaju katli with doorstep delivery."
  },
  {
    title: "Bikanervala Gulab Jamun & Rasgulla Tin",
    priceUSD: 18,
    category: "sweets",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=500&q=80",
    desc: "Classic Indian festive sweets packed fresh for family."
  },
  {
    title: "Motichoor Ladoo Festive Gift Pack",
    priceUSD: 15,
    category: "sweets",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80",
    desc: "Saffron-infused boondi ladoos in golden box."
  },
  {
    title: "Kashmiri Almond & Cashew Hamper",
    priceUSD: 24,
    category: "dryfruits",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=500&q=80",
    desc: "Roasted salted cashews, almonds & pistachios."
  },
  {
    title: "Saffron Pistachio Luxury Gift Box",
    priceUSD: 28,
    category: "dryfruits",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
    desc: "Premium NRI-favorite dry fruit assortment."
  },
  {
    title: "Handcrafted Brass Diya & Puja Thali",
    priceUSD: 19,
    category: "puja",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=500&q=80",
    desc: "Traditional brass diya set with roli-chawal & bell."
  },
  {
    title: "Sandalwood Incense & Toran Decor",
    priceUSD: 14,
    category: "puja",
    image: "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&w=500&q=80",
    desc: "Festive marigold doorway toran & pure agarbatti."
  },
  {
    title: "Silver-Plated Laxmi Ganesh Coin",
    priceUSD: 35,
    category: "puja",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=500&q=80",
    desc: "Auspicious 10g silver-plated keepsake coin."
  },
  {
    title: "Banarasi Silk Festive Stole",
    priceUSD: 32,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80",
    desc: "Handwoven zari border silk dupatta gift."
  },
  {
    title: "Kundan Pearl Jhumka Gift Box",
    priceUSD: 16,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80",
    desc: "Elegant festive earrings in velvet gift box."
  },
  {
    title: "Traditional Shagun Envelope ($21)",
    priceUSD: 21,
    category: "shagun",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=500&q=80",
    desc: "Instant PayPal Shagun + WhatsApp festive card."
  },
  {
    title: "Grand Family Shagun ($51)",
    priceUSD: 51,
    category: "shagun",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238bd60?auto=format&fit=crop&w=500&q=80",
    desc: "Auspicious +$1 blessing for parents & elders."
  },
  {
    title: "Annadanam Mid-Day Meals Seva",
    priceUSD: 5,
    category: "seva",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80",
    desc: "Sponsor 10 warm meals for children in India."
  }
];

export const QUICK_PROMPTS = [
  "Show all gifts",
  "Sweets under $25",
  "Dry fruits hamper",
  "Puja & Diyas",
  "Fashion & Jewelry",
  "Family Shagun",
  "Seva donation"
];

export function matchAiProducts(query: string): { reply: string; items: AiProduct[] } {
  const q = query.toLowerCase().trim();

  if (/^(hi|hello|hey|namaste|hii|hola)/.test(q)) {
    return {
      reply: "Namaste! Aap niche diye options me se choose kar sakte hain ya apna budget bol sakte hain (jaise 'gifts under $25'):",
      items: AI_CATALOG.slice(0, 4),
    };
  }

  // Extract budget like "under $25" or "below 20"
  const budgetMatch = q.match(/(?:under|below|less than|max|upto)\s*\$?\s*(\d+)/);
  const maxPrice = budgetMatch ? parseFloat(budgetMatch[1]) : null;

  let filtered = AI_CATALOG;

  if (q.includes("sweet") || q.includes("mithai") || q.includes("ladoo") || q.includes("katli")) {
    filtered = filtered.filter((p) => p.category === "sweets");
  } else if (q.includes("dry") || q.includes("fruit") || q.includes("nut") || q.includes("almond") || q.includes("hamper")) {
    filtered = filtered.filter((p) => p.category === "dryfruits" || p.category === "sweets");
  } else if (q.includes("puja") || q.includes("diya") || q.includes("decor") || q.includes("coin") || q.includes("diwali")) {
    filtered = filtered.filter((p) => p.category === "puja" || p.category === "sweets");
  } else if (q.includes("fashion") || q.includes("cloth") || q.includes("kurta") || q.includes("silk") || q.includes("jewelry") || q.includes("jhumka")) {
    filtered = filtered.filter((p) => p.category === "fashion");
  } else if (q.includes("shagun") || q.includes("money") || q.includes("cash") || q.includes("envelope")) {
    filtered = filtered.filter((p) => p.category === "shagun");
  } else if (q.includes("seva") || q.includes("donat") || q.includes("charity") || q.includes("meal")) {
    filtered = filtered.filter((p) => p.category === "seva");
  }

  if (maxPrice !== null) {
    filtered = filtered.filter((p) => p.priceUSD <= maxPrice);
  }

  if (filtered.length === 0) {
    return {
      reply: `Mujhe "${query}" ke exact match nahi mile, par yeh popular options dekhein:`,
      items: AI_CATALOG.slice(0, 4),
    };
  }

  return {
    reply: `Yeh rahe "${query}" ke liye ${filtered.length} best options (1-click PayPal checkout):`,
    items: filtered.slice(0, 6),
  };
}
