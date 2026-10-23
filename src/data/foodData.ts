// ─────────────────────────────────────────────
// TYPE DEFINITIONS & FOOD ATLAS DATA
// ─────────────────────────────────────────────

export interface Dish {
  id: string;
  name: string;
  alternateName?: string;
  state: string;
  regionClassification?: "State" | "Union Territory";
  category: "grain-bread" | "curry-stew" | "fermented-steamed" | "roast-fried" | "sweet-dessert" | "beverage";
  description: string;
  ingredients: string[];
  tasteProfile: string;
  era: string;
  keyTechnique: string;
  hasPilot3D?: boolean;
}

export interface StateFood {
  tagline: string;
  classification: "State" | "Union Territory";
  dishes: Dish[];
}

export const SHORT_NAMES: Record<string, string> = {
  "Jammu and Kashmir": "J&K",
  Ladakh: "LA",
  "Himachal Pradesh": "HP",
  Punjab: "PB",
  Haryana: "HR",
  Delhi: "DL",
  Rajasthan: "RJ",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  Bihar: "BR",
  Jharkhand: "JH",
  "West Bengal": "WB",
  Sikkim: "SK",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Nagaland: "NL",
  Manipur: "MN",
  Mizoram: "MZ",
  Tripura: "TR",
  Meghalaya: "ML",
  Odisha: "OR",
  "Madhya Pradesh": "MP",
  Chhattisgarh: "CG",
  Gujarat: "GJ",
  Maharashtra: "MH",
  Goa: "GA",
  Telangana: "TG",
  "Andhra Pradesh": "AP",
  Karnataka: "KA",
  "Tamil Nadu": "TN",
  Kerala: "KL",
  "Andaman and Nicobar Islands": "AN",
  Chandigarh: "CH",
  Puducherry: "PY",
  Lakshadweep: "LD",
  "Dadra and Nagar Haveli and Daman and Diu": "DN",
};

export const STATE_EMOJIS: Record<string, string> = {
  "Andhra Pradesh": "🌶️",
  "Arunachal Pradesh": "🎋",
  Assam: "🍵",
  Bihar: "🫓",
  Chhattisgarh: "🌾",
  Goa: "🥥",
  Gujarat: "🧆",
  Haryana: "🧈",
  "Himachal Pradesh": "🥟",
  Jharkhand: "🫔",
  Karnataka: "☕",
  Kerala: "🥥",
  "Madhya Pradesh": "🍲",
  Maharashtra: "🥪",
  Manipur: "🥗",
  Meghalaya: "🍄",
  Mizoram: "🌿",
  Nagaland: "🌶️",
  Odisha: "🥘",
  Punjab: "🫓",
  Rajasthan: "🍛",
  Sikkim: "🥟",
  "Tamil Nadu": "🥞",
  Telangana: "🍖",
  Tripura: "🐟",
  "Uttar Pradesh": "🍢",
  Uttarakhand: "🫘",
  "West Bengal": "🍮",
  "Jammu and Kashmir": "🫖",
  Ladakh: "🍵",
  Delhi: "🍢",
  "Andaman and Nicobar Islands": "🦐",
  Puducherry: "🍲",
};

export const FOOD_DATA: Record<string, StateFood> = {
  "Andhra Pradesh": {
    tagline: "Land of fire and spice — India's spiciest cuisine",
    classification: "State",
    dishes: [
      {
        id: "pesarattu",
        name: "Pesarattu",
        alternateName: "Green Gram Crepe",
        state: "Andhra Pradesh",
        category: "fermented-steamed",
        description: "Crispy whole green moong dal crepes seasoned with cumin, ginger, and green chillies, traditionally stuffed with upma and paired with ginger allam pachadi.",
        ingredients: ["Green moong dal", "Rice", "Ginger", "Green chillies", "Onion", "Cumin"],
        tasteProfile: "Savory & Mildly Spiced",
        era: "7th Century CE",
        keyTechnique: "Stone-Ground Unfermented Batter & Cast Iron Tawa Roasting",
      },
      {
        id: "gongura-mutton",
        name: "Gongura Mutton",
        alternateName: "Sorrel Leaf Meat Braise",
        state: "Andhra Pradesh",
        category: "curry-stew",
        description: "Tender mutton slow-braised with sour sorrel leaves (gongura), fiery Guntur red chillies, and aromatic roasted spices in cold-pressed sesame oil.",
        ingredients: ["Mutton", "Gongura leaves", "Guntur red chillies", "Onion", "Coriander seeds", "Garlic"],
        tasteProfile: "Tangy & Fiery",
        era: "Kakatiya Dynasty (12th Century CE)",
        keyTechnique: "Slow Brass Handi Braising with Leaf Reduction",
      },
    ],
  },

  "Arunachal Pradesh": {
    tagline: "Tribal highlands meet bamboo-scented mountain cuisine",
    classification: "State",
    dishes: [
      {
        id: "thukpa",
        name: "Thukpa",
        alternateName: "Himalayan Noodle Broth",
        state: "Arunachal Pradesh",
        category: "curry-stew",
        description: "Hearty handmade wheat noodles steeped in a warming clear broth infused with indigenous mountain herbs, ginger, garlic, and wild greens.",
        ingredients: ["Handmade wheat noodles", "Mountain vegetables", "Yak/pork broth", "Ginger", "Garlic", "Sichuan pepper"],
        tasteProfile: "Savory, Warming & Mild",
        era: "8th Century Tibetan Trade Routes",
        keyTechnique: "Clear Broth Infusion & Clay Pot Simmering",
      },
      {
        id: "bamboo-shoot-pork",
        name: "Bamboo Shoot Pork",
        alternateName: "Eeku Pork",
        state: "Arunachal Pradesh",
        category: "meat",
        description: "Tender country pork slow-cooked with fresh shredded bamboo shoots, King Chillies, and indigenous wild mountain coriander in bamboo hollows.",
        ingredients: ["Fresh bamboo shoots", "Country pork", "Bird's eye chilli", "Wild garlic", "Ginger"],
        tasteProfile: "Earthy, Smoky & Spicy",
        era: "Indigenous Tribal Antiquity",
        keyTechnique: "Flame Roasting Inside Green Bamboo Internodes",
      },
    ],
  },

  Assam: {
    tagline: "Where mustard oil, fish and the Brahmaputra define every meal",
    classification: "State",
    dishes: [
      {
        id: "masor-tenga",
        name: "Masor Tenga",
        alternateName: "Sour River Fish Broth",
        state: "Assam",
        category: "curry-stew",
        description: "A bright, light, golden fish broth made sour with fresh tomatoes and ou tenga (elephant apple), tempered gently in pure pungent cold-pressed mustard oil.",
        ingredients: ["Brahmaputra Rohu fish", "Elephant apple (Ou tenga)", "Tomatoes", "Mustard oil", "Turmeric", "Green chillies"],
        tasteProfile: "Tangy, Light & Sour",
        era: "Ahom Kingdom Era (13th Century CE)",
        keyTechnique: "Minimal Oil Tempering & Natural Acid Simmer",
      },
      {
        id: "khar",
        name: "Khar",
        alternateName: "Alkaline Ash Delicacy",
        state: "Assam",
        category: "curry-stew",
        description: "A ceremonial starter prepared by filtering water through the ash of sun-dried sun-charred Bhim banana peels, simmered with raw papaya and mustard oil.",
        ingredients: ["Raw papaya", "Burnt banana peel filtrate (Khar)", "Mustard oil", "Ginger", "Green chillies"],
        tasteProfile: "Earthy, Alkaline & Mild",
        era: "Vedic & Pre-Ahom Antiquity",
        keyTechnique: "Sun-Dry Peeling, Charcoal Leaching & Slow Emulsification",
      },
    ],
  },

  Bihar: {
    tagline: "Ancient land of simple, soulful flavors rooted in tradition",
    classification: "State",
    dishes: [
      {
        id: "litti-chokha",
        name: "Litti Chokha",
        alternateName: "Ember-Baked Sattu Dough Balls",
        state: "Bihar",
        category: "grain-bread",
        description: "Rustic whole-wheat dough spheres stuffed with spiced roasted Bengal gram flour (sattu), baked over cow-dung ember fires and dipped in golden cow ghee, served with smoked brinjal chokha.",
        ingredients: ["Whole wheat flour", "Roasted sattu", "Cow ghee", "Ajwain", "Kalonji", "Smoked brinjal", "Mustard oil"],
        tasteProfile: "Smoky, Nutty & Hearty",
        era: "Magadha Empire & 1857 War Feasts",
        keyTechnique: "Cow-Dung Wood Ember Baking & Ghee Immersion",
      },
      {
        id: "thekua",
        name: "Thekua",
        alternateName: "Chhath Puja Holy Cookie",
        state: "Bihar",
        category: "sweet-dessert",
        description: "Sacred crisp wheat cookies patterned on carved wooden moulds (saancha), sweetened with date jaggery, scented with crushed green cardamom and fennel, deep-fried in pure ghee.",
        ingredients: ["Whole wheat flour", "Sugarcane jaggery", "Ghee", "Fennel seeds", "Dry coconut", "Cardamom"],
        tasteProfile: "Sweet, Nutty & Aromatic",
        era: "Ancient Vedic Sun Worship Traditions",
        keyTechnique: "Wood Saancha Embossing & Deep Ghee Confection",
      },
    ],
  },

  Chhattisgarh: {
    tagline: "The rice bowl of India — tribal flavors, forest ingredients",
    classification: "State",
    dishes: [
      {
        id: "chhattisgarhi-chila",
        name: "Chila",
        alternateName: "Rice & Urad Morning Crepe",
        state: "Chhattisgarh",
        category: "grain-bread",
        description: "Thin, crispy golden crepes made from indigenous Chhattisgarh rice batter, sprinkled with roasted sesame and served with fiery green tomato coriander chutney.",
        ingredients: ["Rice batter", "Urad dal", "Sesame seeds", "Green chillies", "Coriander", "Mustard oil"],
        tasteProfile: "Savory, Crispy & Light",
        era: "Pre-Historic Rice Domestication (Mahanadi Basin)",
        keyTechnique: "Clay Tawa Roasting with Sesame Crust",
      },
      {
        id: "fara",
        name: "Fara",
        alternateName: "Steamed Rice Dumplings",
        state: "Chhattisgarh",
        category: "fermented-steamed",
        description: "Crescent-shaped steamed dumplings made from fresh rice flour stuffed with a spicy chana dal and garlic herb paste, lightly pan-tossed in mustard and curry leaves.",
        ingredients: ["Rice flour", "Chana dal", "Garlic", "Green chillies", "Mustard seeds", "Curry leaves"],
        tasteProfile: "Mild, Savory & Steamed",
        era: "Ancient Tribal Agrarian Festivals",
        keyTechnique: "Clay Steaming & Crisp Pan Tempering",
      },
    ],
  },

  Goa: {
    tagline: "Portuguese-spiced, coconut-kissed, ocean-fresh coastal paradise",
    classification: "State",
    dishes: [
      {
        id: "goan-fish-curry",
        name: "Goan Fish Curry",
        alternateName: "Xitt Kodi",
        state: "Goa",
        category: "curry-stew",
        description: "Fresh coastal kingfish or mackerel simmered in freshly extracted thick coconut milk, brightened by tart sun-dried kokum rinds and fiery Kashmiri chillies.",
        ingredients: ["Kingfish / Mackerel", "Fresh grated coconut", "Kokum", "Kashmiri chillies", "Coriander seeds", "Turmeric"],
        tasteProfile: "Tangy, Coconutty & Spiced",
        era: "Pre-Colonial Saraswat & Maritime Heritage",
        keyTechnique: "Clay Pot Simmering & Stone Ground Masala",
      },
      {
        id: "pork-vindaloo",
        name: "Pork Vindaloo",
        alternateName: "Carne de Vinha d'Alhos Transformation",
        state: "Goa",
        category: "curry-stew",
        description: "A masterwork of Indo-Portuguese culinary fusion: pork marinated overnight in palm toddy vinegar, garlic cloves, cinnamon, and fiery dried red chillies.",
        ingredients: ["Pork shoulder", "Goan palm vinegar", "Garlic", "Kashmiri red chillies", "Cinnamon", "Cloves", "Cumin"],
        tasteProfile: "Fiery, Sour & Complex",
        era: "16th Century Portuguese Maritime Exchange",
        keyTechnique: "Toddy Vinegar Acid Cure & Slow Copper Pot Braise",
      },
    ],
  },

  Gujarat: {
    tagline: "Sweetness in every bite — the jewel of vegetarian cuisine",
    classification: "State",
    dishes: [
      {
        id: "dhokla",
        name: "Dhokla",
        alternateName: "Khaman & Chana Sponges",
        state: "Gujarat",
        category: "fermented-steamed",
        description: "Porous, pillow-soft steamed savoury sponge cakes made from fermented split chickpea batter, tempered with crackling mustard seeds, green chillies, and fresh coriander.",
        ingredients: ["Gram flour (Besan)", "Fermented curd", "Ginger-chilli paste", "Mustard seeds", "Curry leaves", "Asafoetida"],
        tasteProfile: "Tangy, Light & Spongy",
        era: "11th Century Jain Manuscript Mentions (Dukkha)",
        keyTechnique: "Aerated Fermentation & Steam Vapor Lift",
      },
      {
        id: "undhiyu",
        name: "Undhiyu",
        alternateName: "Earthen Pot Winter Bake",
        state: "Gujarat",
        category: "curry-stew",
        description: "Surat's legendary winter one-pot casserole of tender baby eggplants, purple yam, Surti papdi beans, and fenugreek muthias slow-cooked upside down under earthen pit fires.",
        ingredients: ["Surti papdi", "Kand (purple yam)", "Baby eggplants", "Methi muthia", "Fresh coconut", "Green garlic"],
        tasteProfile: "Herbaceous, Sweet & Savory",
        era: "Medieval Agrarian Harvest Celebrations",
        keyTechnique: "Matka Inversion (Undhu) Under Charcoal Embers",
      },
    ],
  },

  Haryana: {
    tagline: "Agricultural heartland — wholesome dairy-rich comfort food",
    classification: "State",
    dishes: [
      {
        id: "bajra-khichdi",
        name: "Bajra Khichdi",
        alternateName: "Pearl Millet & Moong Porridge",
        state: "Haryana",
        category: "grain-bread",
        description: "Nutritious whole pearl millet pounded in stone mortars, simmered for hours with yellow moong lentils and crowned with a generous pool of freshly churned white butter.",
        ingredients: ["Bajra (Pearl millet)", "Moong dal", "Desi butter / Ghee", "Cumin", "Garlic", "Rock salt"],
        tasteProfile: "Earthy, Warm & Nutty",
        era: "Harappan & Vedic Agrarian Antiquity",
        keyTechnique: "Mortar De-husking & Slow Earthen Pot Hearth Simmer",
      },
      {
        id: "haryanvi-kadhi",
        name: "Kadhi Pakora",
        alternateName: "Spiced Buttermilk Stew",
        state: "Haryana",
        category: "curry-stew",
        description: "A golden, tangy stew of churned sour buttermilk and chickpea flour slow-simmered with fenugreek seeds, holding crisp onion-spinach pakoras, topped with ghee tadka.",
        ingredients: ["Sour buttermilk", "Gram flour", "Fenugreek seeds", "Dried red chillies", "Ghee", "Onion pakoras"],
        tasteProfile: "Tangy, Creamy & Savory",
        era: "Ancient Dairy Pastoral Traditions",
        keyTechnique: "Prolonged Simmering (Kadhna) to Prevent Curdling",
      },
    ],
  },

  "Himachal Pradesh": {
    tagline: "Mountain serenity on a plate — simple, hearty highland fare",
    classification: "State",
    dishes: [
      {
        id: "siddu",
        name: "Siddu",
        alternateName: "Stuffed Himalayan Steamed Bread",
        state: "Himachal Pradesh",
        category: "grain-bread",
        description: "A pillowy, crescent-shaped fermented wheat dough bread filled with a rich paste of toasted local walnuts, poppy seeds, and wild herbs, drenched in hot desi ghee.",
        ingredients: ["Fermented wheat flour", "Crushed walnuts", "Poppy seeds (Khus Khus)", "Pure ghee", "Wild herbs"],
        tasteProfile: "Nutty, Mild & Comforting",
        era: "Ancient Western Himalayan Pastoral Era",
        keyTechnique: "Yeast Fermentation & Alpine Herbal Steaming",
      },
      {
        id: "himachali-dham",
        name: "Himachali Dham",
        alternateName: "Sacred Festive Feast",
        state: "Himachal Pradesh",
        category: "curry-stew",
        description: "A ceremonial sattvic temple banquet cooked exclusively by hereditary 'Botis' in heavy brass degs, starring slow-simmered rajma madra cooked in rich spiced curd and dried fruits.",
        ingredients: ["Chamba Rajma", "Thick curd", "Ghee", "Dried raisins", "Cloves", "Cardamom"],
        tasteProfile: "Rich, Aromatic & Creamy",
        era: "Raja Jaistambh Reign (c. 10th Century CE)",
        keyTechnique: "Wood-Fire Brass Deg Simmering Without Onion-Garlic",
      },
    ],
  },

  Jharkhand: {
    tagline: "Tribal wisdom, forest bounty — earthy and nourishing",
    classification: "State",
    dishes: [
      {
        id: "dhuska",
        name: "Dhuska",
        alternateName: "Fried Rice & Lentil Cakes",
        state: "Jharkhand",
        category: "grain-bread",
        description: "Deep-golden crispy pancakes prepared by soaking and grinding short-grain rice and chana dal into a thick batter, fried in mustard oil and served with spicy aloo-chana sabzi.",
        ingredients: ["Short-grain rice", "Chana dal", "Ginger", "Green chillies", "Cumin", "Mustard oil"],
        tasteProfile: "Crispy, Savory & Earthy",
        era: "Indigenous Chota Nagpur Tribal Heritage",
        keyTechnique: "Wet-Stone Grinding & Rapid Immersion Frying",
      },
      {
        id: "chilka-roti",
        name: "Chilka Roti",
        alternateName: "Indigenous Red Rice Flatbread",
        state: "Jharkhand",
        category: "grain-bread",
        description: "Traditional delicate tribal flatbreads prepared from coarse unpolished red rice and chana dal batter, poured on earthen tawas greased with sal leaf twigs.",
        ingredients: ["Unpolished red rice", "Chana dal", "Water", "Sal tree seed oil", "Salt"],
        tasteProfile: "Rustic, Nutty & Delicate",
        era: "Santhal & Munda Pre-Historic Antiquity",
        keyTechnique: "Earthen Tawa Pouring with Botanical Swab",
      },
    ],
  },

  Karnataka: {
    tagline: "Bisi bele to Neer dosa — diversity on every banana leaf",
    classification: "State",
    dishes: [
      {
        id: "masala-dosa",
        name: "Masala Dosa",
        alternateName: "Mysore Masala Dosa",
        state: "Karnataka",
        category: "grain-bread",
        description: "World-renowned golden crisp fermented rice and black gram crepe, smeared inside with red garlic-chilli chutney, rolled around spiced potato palya, served on a green banana leaf.",
        ingredients: ["Sona Masuri rice", "Urad dal", "Fenugreek seeds", "Potatoes", "Mustard seeds", "Curry leaves", "Butter"],
        tasteProfile: "Crispy, Golden & Savory",
        era: "12th Century CE (King Someshvara III's Manasollasa)",
        keyTechnique: "Stone-Ground Natural Fermentation & Iron Tawa Crisp-Folding",
        hasPilot3D: true,
      },
      {
        id: "bisi-bele-bath",
        name: "Bisi Bele Bath",
        alternateName: "Hot Lentil Rice",
        state: "Karnataka",
        category: "curry-stew",
        description: "A comforting royal Mysore palace preparation of short-grain rice, toor dal, tamarind extract, and 30-spice bisi bele powder, enriched with fried cashews and pure ghee.",
        ingredients: ["Rice", "Toor dal", "Tamarind pulp", "Byadagi chillies", "Kapok buds (Marathi moggu)", "Ghee", "Cashews"],
        tasteProfile: "Spicy, Tangy & Hearty",
        era: "Wodeyar Dynasty (16th Century CE Mysore Court)",
        keyTechnique: "Layered Spice Roasting & Unified One-Pot Ghee Simmer",
      },
    ],
  },

  Kerala: {
    tagline: "God's Own Country — land of coconut, spices and backwater flavors",
    classification: "State",
    dishes: [
      {
        id: "appam-stew",
        name: "Appam with Vegetable Stew",
        alternateName: "Palappam & Ishtu",
        state: "Kerala",
        category: "grain-bread",
        description: "Bowl-shaped fermented rice hoppers with gossamer lacy edges and soft, spongy steamed centers, paired with a fragrant coconut milk stew perfumed with green peppercorn and cinnamon.",
        ingredients: ["Raw rice", "Coconut toddy/yeast", "Fresh coconut milk", "Black peppercorns", "Cinnamon", "Curry leaves"],
        tasteProfile: "Delicate, Sweet-Tangy & Creamy",
        era: "1st Century CE Syrian Christian & Malabar Maritime Heritage",
        keyTechnique: "Deep Appachatti Swirl & Dual Coconut Milk Extraction",
      },
      {
        id: "fish-molee",
        name: "Kerala Fish Molee",
        alternateName: "Meen Moolie",
        state: "Kerala",
        category: "curry-stew",
        description: "Tender Karimeen (pearl spot) fish fillets gently poached in silky fresh coconut milk, golden turmeric, mild green chillies, and curry leaves with zero heavy browning.",
        ingredients: ["Karimeen / Seer fish", "First & second press coconut milk", "Green chillies", "Curry leaves", "Turmeric", "Tomatoes"],
        tasteProfile: "Mild, Aromatic & Velvety",
        era: "17th Century Portuguese-Dutch Malabar Trade",
        keyTechnique: "Delicate Fish Poach in Layered Coconut Milk Presses",
      },
    ],
  },

  "Madhya Pradesh": {
    tagline: "Heart of India — dal baati to street food royalty",
    classification: "State",
    dishes: [
      {
        id: "indori-poha",
        name: "Indori Poha",
        alternateName: "Steamed Flaked Rice",
        state: "Madhya Pradesh",
        category: "grain-bread",
        description: "Fragrant flattened rice steamed over water pots, tempered with fennel seeds and turmeric, crowned with crispy Ratlami sev, pomegranate jewels, and jeeravan spice powder.",
        ingredients: ["Thick flattened rice", "Fennel seeds", "Mustard seeds", "Ratlami sev", "Pomegranate", "Jeeravan masala"],
        tasteProfile: "Light, Tangy & Savory",
        era: "Holkar Dynasty (18th Century CE Indore)",
        keyTechnique: "Steam-Pot Hydration & Jeeravan Masala Dusting",
      },
      {
        id: "bhutte-ka-kees",
        name: "Bhutte Ka Kees",
        alternateName: "Grated Corn Milk Braise",
        state: "Madhya Pradesh",
        category: "curry-stew",
        description: "Tender sweet corn kernels grated fresh and slow-cooked in full-cream milk with asafoetida, green chillies, and mustard, garnished with fresh coconut and lemon.",
        ingredients: ["Fresh sweet corn", "Full cream milk", "Mustard seeds", "Green chillies", "Asafoetida", "Grated coconut"],
        tasteProfile: "Sweet, Creamy & Savory",
        era: "Malwa Plateau Royal Kitchens",
        keyTechnique: "Fine Grating & Slow Milk-Emulsion Braise",
      },
    ],
  },

  Maharashtra: {
    tagline: "From coastal Konkan to Vidarbha heat — bold, diverse and proud",
    classification: "State",
    dishes: [
      {
        id: "vada-pav",
        name: "Vada Pav",
        alternateName: "Mumbai's Working-Class Icon",
        state: "Maharashtra",
        category: "snack",
        description: "Golden spiced mashed potato ball encased in a crisp chickpea batter shell, tucked inside a fresh bakery pav slathered with fiery dry garlic-peanut chutney and green chilli.",
        ingredients: ["Potatoes", "Besan (Gram flour)", "Mustard seeds", "Garlic", "Peanuts", "Kashmiri chilli", "Ladi Pav"],
        tasteProfile: "Spiced, Garlicky & Satisfying",
        era: "1966 CE (Dadar Station Creation by Ashok Vaidya)",
        keyTechnique: "Tempered Potato Mash & Precision Deep Frying",
      },
      {
        id: "puran-poli",
        name: "Puran Poli",
        alternateName: "Sweet Lentil Stuffed Flatbread",
        state: "Maharashtra",
        category: "grain-bread",
        description: "Paper-thin festive wheat flatbread rolled with a decadent core of slow-cooked Bengal gram and organic jaggery perfumed with nutmeg and cardamom, griddled with pure ghee.",
        ingredients: ["Chana dal", "Organic jaggery", "Whole wheat flour", "Nutmeg", "Cardamom", "Pure ghee"],
        tasteProfile: "Sweet, Fragrant & Velvety",
        era: "12th Century CE (Mentions in Bhavartha Deepika)",
        keyTechnique: "Puran Stone-Straining & Translucent Rolling",
      },
    ],
  },

  Manipur: {
    tagline: "Valley of jewels — fermented flavors and tribal culinary art",
    classification: "State",
    dishes: [
      {
        id: "eromba",
        name: "Eromba",
        alternateName: "Fermented Fish & Tuber Mash",
        state: "Manipur",
        category: "curry-stew",
        description: "Iconic Meitei dish of boiled mountain potatoes, tree beans (yongchak), and water greens mashed with toasted sun-dried fermented fish (ngari) and fiery king chillies.",
        ingredients: ["Ngari (Fermented fish)", "Mountain potatoes", "Yongchak (Tree beans)", "Ghost chillies", "Spring onions"],
        tasteProfile: "Pungent, Fiery & Umami-Rich",
        era: "Ancient Meitei Valley Antiquity",
        keyTechnique: "Dry Earthen Pot Roasting of Ngari & Hand Mashing",
      },
      {
        id: "singju",
        name: "Singju",
        alternateName: "Herbal Mountain Salad",
        state: "Manipur",
        category: "snack",
        description: "A fiery raw tribal salad featuring crunchy lotus stems, shredded cabbage, and seasonal herbs tossed with roasted black sesame, perilla seeds, and toasted ngari.",
        ingredients: ["Lotus stems", "Cabbage", "Roasted perilla seeds (Thoiding)", "Roasted chickpea powder", "Ngari", "Chillies"],
        tasteProfile: "Crisp, Tangy & Aromatic",
        era: "Indigenous Herbal Foraging Traditions",
        keyTechnique: "Raw Julian Chiffonade & Dry Seed Dressing",
      },
    ],
  },

  Meghalaya: {
    tagline: "Abode of clouds — pork, rice and Khasi tradition on every table",
    classification: "State",
    dishes: [
      {
        id: "jadoh",
        name: "Jadoh",
        alternateName: "Khasi Red Rice & Pork",
        state: "Meghalaya",
        category: "meat",
        description: "The revered ceremonial centrepiece of Khasi celebrations: aromatic indigenous short red hill rice cooked with succulent cuts of pork, ginger paste, and toasted black sesame.",
        ingredients: ["Jaintia red rice", "Pork belly", "Black sesame paste", "Ginger", "Bay leaves", "Local onions"],
        tasteProfile: "Savory, Nutty & Earthy",
        era: "Ancient Khasi Matrilineal Feast Traditions",
        keyTechnique: "Rendered Pork Fat Rice Braising & Sesame Glaze",
      },
      {
        id: "dohneiiong",
        name: "Dohneiiong",
        alternateName: "Black Sesame Braised Pork",
        state: "Meghalaya",
        category: "meat",
        description: "Tender pork cubes braised in a dark, thick paste made from stone-ground roasted black sesame seeds (neiiong), mountain ginger, and garlic with earthy mineral depths.",
        ingredients: ["Pork", "Black sesame seeds (Neiiong)", "Garlic", "Ginger", "Mustard oil", "Green chillies"],
        tasteProfile: "Rich, Nutty & Deeply Savory",
        era: "Khasi & Garo Tribal Antiquity",
        keyTechnique: "Dry Seed Roasting, Stone Pounding & Long Braise",
      },
    ],
  },

  Mizoram: {
    tagline: "Fresh bamboo, smoked meats and mountain simplicity",
    classification: "State",
    dishes: [
      {
        id: "mizo-bai",
        name: "Mizo Bai",
        alternateName: "Herbal Vegetable & Bamboo Stew",
        state: "Mizoram",
        category: "curry-stew",
        description: "The soul of Mizo daily sustenance: a completely oil-free clear soup made by simmering mountain greens, pork rind, and fresh fermented bamboo shoots in alkaline water.",
        ingredients: ["Wild mustard greens", "Fermented bamboo shoots", "Pork skin / Smoked meat", "Alkaline cooking soda", "Salt"],
        tasteProfile: "Mild, Earthy & Botanical",
        era: "Highland Forest Foraging Antiquity",
        keyTechnique: "Oil-Free Alkaline Water Simmering",
      },
      {
        id: "sawhchiar",
        name: "Sawhchiar",
        alternateName: "Mizo Slow-Simmered Meat Congee",
        state: "Mizoram",
        category: "grain-bread",
        description: "A thick, comforting highland rice porridge slow-cooked with bone-in chicken or country pork, seasoned simply with crushed ginger root, garlic, and wild black pepper.",
        ingredients: ["Indigenous sticky rice", "Country chicken / Pork", "Crushed ginger", "Garlic cloves", "Black peppercorns"],
        tasteProfile: "Hearty, Warming & Soulful",
        era: "Community Hunting Feast Traditions",
        keyTechnique: "Continuous Wood-Fire Stirring to Creamy Rice Gel",
      },
    ],
  },

  Nagaland: {
    tagline: "Fierce, smoky and fearless — Naga cuisine for the bold",
    classification: "State",
    dishes: [
      {
        id: "naga-smoked-pork",
        name: "Naga Smoked Pork with Bamboo Shoots",
        alternateName: "Smoked Meat with Raja Mircha",
        state: "Nagaland",
        category: "meat",
        description: "Wood-hearth smoked pork cured over kitchen rafters for weeks, stewed with sour fermented bamboo shoots (bastenga) and fresh Naga King Chillies (Bhut Jolokia).",
        ingredients: ["Hearth-smoked pork", "Fermented bamboo shoots", "Bhut Jolokia (King Chilli)", "Garlic cloves", "Ginger root"],
        tasteProfile: "Intensely Smoky, Fiery & Tangy",
        era: "Pre-Colonial Naga Warrior Tradition",
        keyTechnique: "Multi-Week Kitchen Hearth Smoking & Water Braise",
      },
      {
        id: "galho",
        name: "Galho",
        alternateName: "Naga Khichdi with Axone",
        state: "Nagaland",
        category: "grain-bread",
        description: "A wholesome one-pot porridge of broken local hill rice, smoked pork cuts, seasonal wild greens, and pungent fermented soybeans (axone) lending rich umami.",
        ingredients: ["Short hill rice", "Smoked meat scraps", "Axone (Fermented soybeans)", "Mountain greens", "Bird's eye chilli"],
        tasteProfile: "Smoky, Savory & Deep Umami",
        era: "Angami & Ao Tribal Agrarian Heritage",
        keyTechnique: "Slow Simmering with Fermented Bean Emulsification",
      },
    ],
  },

  Odisha: {
    tagline: "Temple offerings, ocean harvest and the most beloved pitha culture",
    classification: "State",
    dishes: [
      {
        id: "dalma",
        name: "Dalma",
        alternateName: "Sacred Jagannath Temple Lentils",
        state: "Odisha",
        category: "curry-stew",
        description: "The divine offering of Puri Jagannath temple: yellow split pigeon peas (toor dal) simmered with raw papaya, colocasia, and plantain, tempered with roasted cumin-chilli powder and pure ghee.",
        ingredients: ["Toor dal", "Raw banana", "Papaya", "Panch phoran", "Desi ghee", "Fresh coconut", "Roasted cumin powder"],
        tasteProfile: "Mild, Earthy & Sattvic",
        era: "12th Century CE (Jagannath Mahaprasad Heritage)",
        keyTechnique: "Earthen Kudua Pot Steam Layering",
      },
      {
        id: "chhena-poda",
        name: "Chhena Poda",
        alternateName: "Caramelized Baked Cheese",
        state: "Odisha",
        category: "sweet-dessert",
        description: "India's unique indigenous cheese dessert: fresh cow-milk chhena kneaded with sugar, cardamom, and semolina, wrapped in sal tree leaves and baked over dying coal embers until a mahogany caramel crust forms.",
        ingredients: ["Fresh cow milk chhena", "Cardamom powder", "Semolina", "Sugar", "Desi ghee", "Sal tree leaves"],
        tasteProfile: "Caramelized, Rich & Creamy",
        era: "Early 20th Century (Nayagarh Innovation)",
        keyTechnique: "Sal Leaf Wrapping & Residual Coal Oven Caramelization",
      },
    ],
  },

  Punjab: {
    tagline: "Land of butter, tandoor and indomitable flavors",
    classification: "State",
    dishes: [
      {
        id: "makki-di-roti-sarson-saag",
        name: "Makki di Roti & Sarson da Saag",
        alternateName: "Mustard Greens & Corn Flatbread",
        state: "Punjab",
        category: "grain-bread",
        description: "Stone-ground yellow cornmeal flatbreads patted by hand, paired with winter mustard and bathua greens slow-churned for hours with corn flour, finished with a melting mountain of fresh white butter.",
        ingredients: ["Mustard greens (Sarson)", "Bathua leaves", "Maize flour (Makki atta)", "White butter (Makhan)", "Ginger-garlic", "Jaggery"],
        tasteProfile: "Earthy, Slightly Bitter & Rich",
        era: "Vedic Punjab & 16th Century Agrarian Hearth",
        keyTechnique: "Clay Pot Churning (Ghotna) & Hand-Patted Tawa Griddling",
      },
      {
        id: "butter-chicken",
        name: "Butter Chicken",
        alternateName: "Murgh Makhani",
        state: "Punjab",
        category: "curry-stew",
        description: "Tandoor-charred succulent chicken pieces gently simmered in a velvety, silk-smooth gravy of strained ripe tomatoes, churned butter, fresh cream, and fragrant dried fenugreek leaves (kasuri methi).",
        ingredients: ["Tandoori chicken", "Vine tomatoes", "White butter", "Fresh dairy cream", "Kasuri methi", "Kashmiri chilli"],
        tasteProfile: "Creamy, Mildly Spiced & Velvety",
        era: "Post-Partition 1950s (Moti Mahal / Kundan Lal Gujral)",
        keyTechnique: "Clay Tandoor Roasting & Silky Tomato-Butter Emulsion",
      },
    ],
  },

  Rajasthan: {
    tagline: "Desert royalty — where scarcity inspired culinary genius",
    classification: "State",
    dishes: [
      {
        id: "dal-baati-churma",
        name: "Dal Baati Churma",
        alternateName: "Desert Warrior Triad",
        state: "Rajasthan",
        category: "grain-bread",
        description: "Hard wheat dumplings baked over dried cow-dung embers and cracked open into pools of piping hot ghee, paired with five-lentil panchmel dal and sweet powdered wheat churma.",
        ingredients: ["Whole wheat flour", "Panchmel lentils (Five dals)", "Pure cow ghee", "Ajwain seeds", "Jaggery / Bura", "Cardamom"],
        tasteProfile: "Smoky, Rich & Decadent",
        era: "8th Century Mewar Military Campaigns (Bappa Rawal)",
        keyTechnique: "Sand / Ember Baking & Saturated Ghee Dunking",
      },
      {
        id: "laal-maas",
        name: "Laal Maas",
        alternateName: "Royal Red Game Curry",
        state: "Rajasthan",
        category: "meat",
        description: "The fiery crown jewel of Rajput royal hunting expeditions: game meat slow-cooked in pure ghee with an abundance of smoky Mathania red chillies, garlic paste, and crushed spices.",
        ingredients: ["Mutton / Wild game", "Mathania dried red chillies", "Pure desi ghee", "Garlic paste", "Cloves", "Black cardamom"],
        tasteProfile: "Fiery, Smoky & Bold",
        era: "10th Century Rajput Royal Shikar (Hunting) Camps",
        keyTechnique: "Slow Ghee Braise & Mathania Chilli Extraction",
      },
    ],
  },

  Sikkim: {
    tagline: "Himalayan serenity — momos, thukpa and organic mountain bounty",
    classification: "State",
    dishes: [
      {
        id: "sikkimese-momos",
        name: "Sikkimese Momos",
        alternateName: "Steamed Himalayan Dumplings",
        state: "Sikkim",
        category: "fermented-steamed",
        description: "Delicate pleated parcels of hand-rolled dough filled with seasoned pork mince or mountain vegetables and ginger, steamed over boiling herb water, served with fiery dalle khursani dip.",
        ingredients: ["Wheat flour", "Minced pork / local greens", "Ginger", "Garlic", "Dalle Khursani chillies", "Fermented bamboo"],
        tasteProfile: "Juicy, Savory & Fiery Dip",
        era: "Ancient Trans-Himalayan Buddhist Trade Routes",
        keyTechnique: "Thin Pleated Pinching & Tiered Aluminium/Bamboo Steaming",
      },
      {
        id: "gundruk-soup",
        name: "Gundruk Soup",
        alternateName: "Fermented Greens Broth",
        state: "Sikkim",
        category: "curry-stew",
        description: "Sun-dried fermented mustard and radish leaves slow-simmered with tomatoes, green chillies, and ginger into a sour, mineral-dense curative alpine soup.",
        ingredients: ["Gundruk (Fermented sun-dried greens)", "Tomatoes", "Garlic", "Ginger", "Himalayan rock salt", "Mustard oil"],
        tasteProfile: "Sour, Tangy & Earthy",
        era: "Ancient Himalayan Winter Preservation Traditions",
        keyTechnique: "Earthen Jar Fermentation, Sun Dehydration & Clear Broth Boil",
      },
    ],
  },

  "Tamil Nadu": {
    tagline: "Temple food, banana leaf feasts and filter coffee culture",
    classification: "State",
    dishes: [
      {
        id: "chettinad-chicken",
        name: "Chettinad Chicken Curry",
        alternateName: "Kozhi Varuval / Kuzhambu",
        state: "Tamil Nadu",
        category: "curry-stew",
        description: "An intoxicatingly aromatic curry from the wealthy mercantile Nattukotai Chettiars, prepared with 18 freshly stone-roasted spices including black stone flower (kalpasi), star anise, and peppercorns.",
        ingredients: ["Country chicken", "Kalpasi (Black stone flower)", "Tellicherry black peppercorns", "Star anise", "Fennel seeds", "Shallots"],
        tasteProfile: "Intensely Spiced & Complex",
        era: "19th Century Maritime Spice Merchants (Chettinad)",
        keyTechnique: "Whole Spice Dry Roasting & Heavy Cast Bronze Uruli Simmer",
      },
      {
        id: "idli-sambar",
        name: "Idli Sambar",
        alternateName: "Steamed Rice Cakes & Lentil Stew",
        state: "Tamil Nadu",
        category: "fermented-steamed",
        description: "Cloud-soft steamed pillows of fermented rice and dehusked black gram batter, submerged in a fragrant, piping hot toor dal stew simmered with shallots, drumsticks, and tamarind.",
        ingredients: ["Parboiled idli rice", "Urad dal", "Toor dal", "Shallots (Madras onions)", "Drumsticks", "Tamarind", "Curry leaves"],
        tasteProfile: "Savory, Pillowy & Tangy",
        era: "Sangam Literature & 10th Century Kannada Mention (Iddalige)",
        keyTechnique: "Wet Stone Grinding, Overnight Aeration & Wet Cloth Steaming",
      },
    ],
  },

  Telangana: {
    tagline: "Pearl city cuisine — bold, rustic and deeply satisfying",
    classification: "State",
    dishes: [
      {
        id: "hyderabadi-biryani",
        name: "Hyderabadi Dum Biryani",
        alternateName: "Kacchi Gosht ki Biryani",
        state: "Telangana",
        category: "rice",
        description: "The undisputed monarch of Indian culinary art: raw spiced marinated meat layered with 70% parboiled aged basmati rice, saffron milk, and caramelized onions, sealed in a handi with dough and slow-cooked over wood embers.",
        ingredients: ["Aged Basmati rice", "Tender marinated meat", "Pure saffron", "Fried onions (Birista)", "Yoghurt", "Whole spices", "Mint & coriander"],
        tasteProfile: "Rich, Aromatic & Regal",
        era: "Asaf Jahi Dynasty (18th Century Hyderabad)",
        keyTechnique: "Kacchi Yakhni Layering & Dough-Sealed Dum Pukht",
        hasPilot3D: true,
      },
      {
        id: "hyderabadi-haleem",
        name: "Hyderabadi Haleem",
        alternateName: "Slow-Pounded Royal Meat & Wheat Stew",
        state: "Telangana",
        category: "meat",
        description: "A GI-tagged royal delicacy: broken whole wheat, lentils, and tender meat pounded continuously with wooden mallets (ghotni) in copper cauldrons for 12 hours until transformed into an intensely rich paste.",
        ingredients: ["Whole wheat", "Mutton", "Chana dal & Moong dal", "Pure desi ghee", "Fried onions", "Almonds & cashews", "Rose petals"],
        tasteProfile: "Rich, Warming & Silky",
        era: "Yemeni Chaush Migration & Nizams of Hyderabad",
        keyTechnique: "12-Hour Degchi Simmer & Wooden Mallet Pounding",
      },
    ],
  },

  Tripura: {
    tagline: "Royal bamboo forests meet Bengali and tribal food traditions",
    classification: "State",
    dishes: [
      {
        id: "mui-borok",
        name: "Mui Borok",
        alternateName: "Berma Steamed Fish",
        state: "Tripura",
        category: "curry-stew",
        description: "The traditional staple of the indigenous Borok people: fresh river catch simmered with oil-free berma (sun-dried fermented fish paste), fresh mountain chillies, and indigenous wild leaves.",
        ingredients: ["River fish", "Berma (Fermented fish paste)", "Green chillies", "Garlic", "Wild coriander", "Lemon basil"],
        tasteProfile: "Pungent, Smoky & Umami",
        era: "Tripuri Manikya Kingdom Antiquity",
        keyTechnique: "Zero-Oil Earthen Pot Boil with Fermented Berma",
      },
      {
        id: "chakhwi",
        name: "Chakhwi",
        alternateName: "Alkaline Bamboo Shoot & Pork Stew",
        state: "Tripura",
        category: "curry-stew",
        description: "A cherished ceremonial preparation of tender bamboo shoots, pork cuts, and jackfruit seeds simmered in an indigenous natural alkaline extract prepared from burnt bamboo ash.",
        ingredients: ["Fresh bamboo shoots", "Pork", "Natural bamboo ash extract (Khar/Khang)", "Jackfruit seeds", "Ginger"],
        tasteProfile: "Alkaline, Savory & Earthy",
        era: "Indigenous Borok Forest Traditions",
        keyTechnique: "Bamboo Ash Filtration & Forest Root Simmer",
      },
    ],
  },

  "Uttar Pradesh": {
    tagline: "Mughal grandeur meets Awadhi dum — refinement on a plate",
    classification: "State",
    dishes: [
      {
        id: "galouti-kebab",
        name: "Awadhi Galouti Kebab",
        alternateName: "Nawabi Melt-in-Mouth Patties",
        state: "Uttar Pradesh",
        category: "roast-fried",
        description: "Legendary melt-in-the-mouth smoked minced meat patties infused with 160 secret botanical aromatics, raw green papaya tenderizer, and pure ghee, originally created for toothless Nawab Asad-ud-Daula.",
        ingredients: ["Finely ground meat", "Raw green papaya", "Potli masala (160 spices)", "Pure desi ghee", "Rose water", "Saffron"],
        tasteProfile: "Velvety, Aromatic & Deeply Spiced",
        era: "1784 CE (Court of Nawab Asad-ud-Daula, Lucknow)",
        keyTechnique: "Multiple Sil-Batta Grindings, Smoke Infusion (Dhungar) & Mahi Tawa Griddling",
      },
      {
        id: "banarasi-kachori",
        name: "Banarasi Kachori Sabzi",
        alternateName: "Crisp Urad Dal Puffed Bread",
        state: "Uttar Pradesh",
        category: "grain-bread",
        description: "Golden flaky deep-fried breads stuffed with a seasoned paste of black lentils (urad dal) and asafoetida, served on leaf donas with a tart, unpeeled potato curry simmered with whole fenugreek.",
        ingredients: ["Whole wheat flour", "Spiced urad dal paste", "Baby potatoes", "Asafoetida (Hing)", "Fenugreek seeds", "Mustard oil"],
        tasteProfile: "Crispy, Tangy & Fiery",
        era: "Ancient Varanasi Morning Rituals (Kashi Ghats)",
        keyTechnique: "Deep Immersion Frying & Slow Fenugreek-Hing Potato Tempering",
      },
    ],
  },

  Uttarakhand: {
    tagline: "Pahadi simplicity — altitude-adapted mountain cuisine with soul",
    classification: "State",
    dishes: [
      {
        id: "kafuli",
        name: "Kafuli",
        alternateName: "Garhwali Wild Spinach Mash",
        state: "Uttarakhand",
        category: "curry-stew",
        description: "A velvety, iron-rich emerald green gravy made of wild mountain spinach and fresh fenugreek leaves slow-cooked in iron pots, thickened with rice flour and tempered in cold-pressed mustard oil with jakhiya seeds.",
        ingredients: ["Mountain spinach", "Fenugreek leaves", "Rice flour paste", "Jakhiya seeds (Wild mustard)", "Mustard oil", "Garlic"],
        tasteProfile: "Earthy, Creamy & Slightly Bitter",
        era: "Garhwal & Kumaon Himalayan Pastoral Antiquity",
        keyTechnique: "Cast Iron Kadhai Boiling & Wood Churning (Mathani)",
      },
      {
        id: "bal-mithai",
        name: "Bal Mithai",
        alternateName: "Almora's Coated Khoya Fudge",
        state: "Uttarakhand",
        category: "sweet-dessert",
        description: "A GI-tagged chocolate-brown chewy fudge made by roasting pure hill-cow milk khoya and cane sugar for 10 hours until deep caramelization, rolled in tiny white sugar-coated poppy beads.",
        ingredients: ["Hill-cow milk khoya", "Cane sugar", "Small sugar-coated beads (Khas-khas dana)", "Pure ghee"],
        tasteProfile: "Caramelized, Rich & Crunchy",
        era: "Early 20th Century (Lala Joga Sah of Almora)",
        keyTechnique: "10-Hour Khoya Dark Roasting & Sugar Seed Enrobing",
      },
    ],
  },

  "West Bengal": {
    tagline: "Fish, mishti doi and the poetry of Bengali cuisine",
    classification: "State",
    dishes: [
      {
        id: "shorshe-ilish",
        name: "Shorshe Ilish",
        alternateName: "Hilsa in Pungent Mustard Gravy",
        state: "West Bengal",
        category: "curry-stew",
        description: "The undisputed empress of Bengali gastronomy: prized silver Padma/Ganga Hilsa fish gently simmered in a freshly stone-ground paste of pungent black and yellow mustard seeds, green chillies, and raw mustard oil.",
        ingredients: ["Hilsa fish (Ilish)", "Black and yellow mustard seeds", "Cold-pressed mustard oil", "Slit green chillies", "Turmeric powder"],
        tasteProfile: "Pungent, Rich & Silky",
        era: "Mangalkavya Medieval Bengali Literature (15th Century CE)",
        keyTechnique: "Shil-Nora Mustard Grinding & Raw Mustard Oil Finish",
      },
      {
        id: "mishti-doi",
        name: "Mishti Doi",
        alternateName: "Caramelized Terracotta Sweet Yoghurt",
        state: "West Bengal",
        category: "sweet-dessert",
        description: "Thick full-cream milk boiled down with date palm jaggery (nolen gur) until reduced to half its volume, seeded with active culture and set slowly in unglazed porous terracotta earthen pots that wick excess moisture.",
        ingredients: ["Full-cream milk", "Date palm jaggery (Nolen gur)", "Active yoghurt culture", "Terracotta earthen pot"],
        tasteProfile: "Sweet, Earthy & Caramelized",
        era: "19th Century Nadia / Bogra Confectionery Tradition",
        keyTechnique: "Slow Milk Reduction & Unglazed Terracotta Moisture Wicking",
      },
    ],
  },

  "Jammu and Kashmir": {
    tagline: "Wazwan royalty — a 36-course feast of Kashmiri opulence",
    classification: "Union Territory",
    dishes: [
      {
        id: "rogan-josh",
        name: "Rogan Josh",
        alternateName: "Wazwan Crimson Lamb Braise",
        state: "Jammu and Kashmir",
        category: "curry-stew",
        description: "The crown jewel of the royal 36-course Wazwan feast: tender lamb cuts slow-braised in mustard oil, infused with fennel seed powder (saunf), dried ginger (sonth), and the vivid red essence of ratan jot (alkanet root) and Kashmiri chillies.",
        ingredients: ["Tender lamb cuts", "Kashmiri red chillies", "Fennel seed powder (Saunf)", "Dried ginger (Sonth)", "Ratan jot (Alkanet root)", "Mustard oil", "Asafoetida"],
        tasteProfile: "Mildly Spiced, Rich & Deeply Aromatic",
        era: "15th Century (Reign of Zain-ul-Abidin & Mughal Wazwan)",
        keyTechnique: "Ratan Jot Color Extraction & Slow Copper Degchi Braise",
      },
      {
        id: "kashmiri-dum-aloo",
        name: "Kashmiri Dum Aloo",
        alternateName: "Pandit Spiced Potato Jewel",
        state: "Jammu and Kashmir",
        category: "curry-stew",
        description: "Pricked baby potatoes deep-fried in mustard oil until crisp, then slow-cooked on dum in a velvety yoghurt sauce intensely flavored with Kashmiri chillies, dried ginger, and fennel with no onion or garlic.",
        ingredients: ["Baby potatoes", "Kashmiri red chilli paste", "Whisked yoghurt", "Fennel seed powder", "Dry ginger powder (Sonth)", "Mustard oil"],
        tasteProfile: "Tangy, Aromatic & Fiery",
        era: "Ancient Kashmiri Pandit Culinary Tradition",
        keyTechnique: "Potato Pricking, Deep Crisp Frying & Sealed Curd Dum",
      },
    ],
  },

  Delhi: {
    tagline: "Mughal heritage meets street food chaos — flavors from every corner of India",
    classification: "Union Territory",
    dishes: [
      {
        id: "delhi-nihari",
        name: "Old Delhi Nihari",
        alternateName: "Slow Overnight Shank Stew",
        state: "Delhi",
        category: "curry-stew",
        description: "The legendary pre-dawn breakfast of Old Delhi's Jama Masjid: shank meat and marrow bones slow-simmered in large cauldrons through the cold night with over 50 spices, thickened gently with wheat flour.",
        ingredients: ["Mutton shank & bone marrow", "Wheat flour (Atta)", "Ghee", "Fried onions", "Ginger juliennes", "Potli spices", "Kewra water"],
        tasteProfile: "Intensely Savory, Rich & Velvety",
        era: "Late Mughal Era (Reign of Shah Jahan, 17th Century)",
        keyTechnique: "Overnight Sealed Cauldron Simmer & Bone Marrow Melt",
      },
      {
        id: "delhi-chaat",
        name: "Chandni Chowk Papdi Chaat",
        alternateName: "The Symphony of Sweet, Sour & Spice",
        state: "Delhi",
        category: "snack",
        description: "Crispy whole-wheat papdis layered with boiled potatoes, soft chickpeas, thick whisked sweet yoghurt, tangy date-tamarind chutney, spicy green mint chutney, and roasted cumin chaat masala.",
        ingredients: ["Crisp papdi wafers", "Boiled potatoes", "Whisked sweetened curd", "Tamarind chutney", "Mint-coriander chutney", "Chaat masala", "Pomegranate"],
        tasteProfile: "Sweet, Tangy, Spicy & Crisp",
        era: "Shahjahanabad Royal Street Confectioners (17th Century)",
        keyTechnique: "Layered Chutney Balance & Fresh Crisp Assembly",
      },
    ],
  },

  Ladakh: {
    tagline: "High-altitude Tibetan-Himalayan soul food & warming butter tea",
    classification: "Union Territory",
    dishes: [
      {
        id: "ladakhi-skyu",
        name: "Ladakhi Skyu",
        alternateName: "Hand-Pinched Thumb Pasta Stew",
        state: "Ladakh",
        category: "grain-bread",
        description: "Traditional handmade whole-wheat dough pinched into tiny thumb-sized hollow bowls, slow-simmered in a rich, warming broth with root potatoes, turnips, wild mountain caraway, and tender meat.",
        ingredients: ["Whole wheat flour", "Mountain potatoes", "Turnips", "Wild mountain caraway", "Garlic", "Meat / Vegetable broth"],
        tasteProfile: "Hearty, Warming & Soulful",
        era: "Ancient Tibetan-Ladakhi Silk Route Caravans",
        keyTechnique: "Thumb-Indent Pasta Shaping & Sustained Broth Simmer",
      },
      {
        id: "gur-gur-cha-khambir",
        name: "Gur Gur Cha & Khambir",
        alternateName: "Yak Butter Tea & Hearth Sourdough",
        state: "Ladakh",
        category: "beverage",
        description: "A restorative high-altitude pairing: brick tea churned vigorously with pure yak butter and rock salt in a wooden chandong cylinder, served alongside thick coal-toasted sourdough hearth bread.",
        ingredients: ["Tibetan brick tea", "Yak butter", "Himalayan rock salt", "Fermented sourdough flour", "Water"],
        tasteProfile: "Salty, Creamy, Toasty & Earthy",
        era: "Ancient Himalayan Pastoral Nomad Antiquity",
        keyTechnique: "Wooden Chandong Piston Churning & Hot Ember Toasting",
      },
    ],
  },

  "Andaman and Nicobar Islands": {
    tagline: "Island seafood feast spiced by coastal traditions",
    classification: "Union Territory",
    dishes: [
      {
        id: "andaman-coconut-prawn",
        name: "Andaman Coconut Prawn Curry",
        alternateName: "Island Bay Prawn Simmer",
        state: "Andaman and Nicobar Islands",
        category: "curry-stew",
        description: "Succulent freshly harvested Andaman sea prawns poached gently in thick island coconut cream, mustard seeds, curry leaves, and spicy green chillies.",
        ingredients: ["Fresh sea prawns", "Island coconut cream", "Mustard seeds", "Curry leaves", "Green chillies", "Turmeric"],
        tasteProfile: "Creamy, Tangy & Mildly Spiced",
        era: "Indigenous Coastal Settlement Traditions",
        keyTechnique: "Quick High-Heat Poaching in Fresh Coconut Cream",
      },
      {
        id: "island-crab-masala",
        name: "Island Mud Crab Masala",
        alternateName: "Crushed Black Pepper Crab",
        state: "Andaman and Nicobar Islands",
        category: "meat",
        description: "Wild mangrove mud crabs tossed vigorously in crushed Tellicherry black pepper, shallots, roasted coriander, and fresh tamarind pulp over blazing wood fires.",
        ingredients: ["Mangrove mud crabs", "Crushed black peppercorns", "Shallots", "Garlic", "Tamarind pulp", "Coconut oil"],
        tasteProfile: "Fiery, Peppery & Sweet Crab Meat",
        era: "Island Settler & Maritime Foraging Traditions",
        keyTechnique: "Cast Iron Wok Tossing with Pepper Tempering",
      },
    ],
  },

  Puducherry: {
    tagline: "French Creole elegance meets coastal Tamil heritage",
    classification: "Union Territory",
    dishes: [
      {
        id: "pondicherry-fish-curry",
        name: "Pondicherry Fish Curry",
        alternateName: "Meen Kozhambu Franco-Tamil",
        state: "Puducherry",
        category: "curry-stew",
        description: "Tender ocean catch simmered in coconut milk, fenugreek, tamarind, and a subtle French-influenced aniseed and vadouvan spice bouquet.",
        ingredients: ["Seer fish", "Fresh coconut milk", "Tamarind", "Fenugreek", "Aniseed", "Vadouvan spices", "Curry leaves"],
        tasteProfile: "Aromatic, Tangy & Coconut-Infused",
        era: "French East India Company (17th–18th Century Pondicherry)",
        keyTechnique: "French Bouquet Garni Fusion with Tamil Tamarind Base",
      },
      {
        id: "koli-kari",
        name: "Koli Kari",
        alternateName: "Creole Chicken Stew",
        state: "Puducherry",
        category: "curry-stew",
        description: "Rich Franco-Tamil fusion chicken stew prepared with freshly grated nutmeg, cloves, saffron-scented potatoes, and velvety coconut cream.",
        ingredients: ["Country chicken", "Coconut cream", "Nutmeg", "Cloves", "Saffron", "Baby potatoes", "Shallots"],
        tasteProfile: "Rich, Warm & Fragrant",
        era: "French Creole Elite Kitchens of White Town",
        keyTechnique: "Gentle Wine/Cream Style Velouté with Tropical Spices",
      },
    ],
  },
};

export function getTasteColor(taste: string): string {
  const t = taste.toLowerCase();
  if (t.includes("sweet")) return "bg-amber-100 text-amber-900 border-amber-300";
  if (t.includes("fiery") || t.includes("spicy") || t.includes("intense")) return "bg-rose-100 text-rose-900 border-rose-300";
  if (t.includes("tangy") || t.includes("sour") || t.includes("tart")) return "bg-lime-100 text-lime-900 border-lime-300";
  if (t.includes("smoky")) return "bg-stone-200 text-stone-800 border-stone-300";
  if (t.includes("creamy") || t.includes("rich")) return "bg-yellow-100 text-yellow-900 border-yellow-300";
  if (t.includes("earthy")) return "bg-emerald-100 text-emerald-900 border-emerald-300";
  if (t.includes("mild") || t.includes("light") || t.includes("delicate")) return "bg-sky-100 text-sky-900 border-sky-300";
  if (t.includes("aromatic") || t.includes("fragrant") || t.includes("floral")) return "bg-purple-100 text-purple-900 border-purple-300";
  return "bg-orange-100 text-orange-900 border-orange-300";
}

export const CULINARY_REGIONS: Record<string, { name: string; states: string[]; color: string; description: string }> = {
  north: {
    name: "Northern Flavors",
    description: "Hearty flatbreads, rich gravies, slow-cooked clay oven tandoors & Himalayan herbs",
    color: "#3b82f6",
    states: ["Jammu and Kashmir", "Ladakh", "Himachal Pradesh", "Punjab", "Haryana", "Delhi", "Uttarakhand", "Uttar Pradesh"],
  },
  south: {
    name: "Southern Spices",
    description: "Fermented rice crepes, fresh coconut, curry leaves, tamarind & pungent black pepper",
    color: "#10b981",
    states: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry"],
  },
  west: {
    name: "Western Heritage",
    description: "Coastal kokum & seafood, fiery Kolhapuri spices, royal Rajasthani curries & sweet Gujarati thalis",
    color: "#f59e0b",
    states: ["Rajasthan", "Gujarat", "Maharashtra", "Goa"],
  },
  east: {
    name: "Eastern Delicacies",
    description: "Pungent mustard oil, freshwater fish, poppy seeds (posto) & legendary milk sweets",
    color: "#ec4899",
    states: ["West Bengal", "Bihar", "Jharkhand", "Odisha"],
  },
  northeast: {
    name: "Northeastern Highlands",
    description: "Fresh bamboo shoots, smoky ghost peppers (Bhut Jolokia), aromatic indigenous herbs & fermentation",
    color: "#06b6d4",
    states: ["Assam", "Arunachal Pradesh", "Meghalaya", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"],
  },
  central: {
    name: "Central Heartlands",
    description: "Tribal forest harvests, roasted gram flour (sattu), wholesome millets & rich royal stews",
    color: "#8b5cf6",
    states: ["Madhya Pradesh", "Chhattisgarh"],
  },
  islands: {
    name: "Island Territories",
    description: "Pristine ocean catch, wild pepper, virgin coconut oil & indigenous mangrove coastal harvest",
    color: "#14b8a6",
    states: ["Andaman and Nicobar Islands"],
  },
};

export function getAllDishes(): Dish[] {
  const dishes: Dish[] = [];
  Object.values(FOOD_DATA).forEach((stateData) => {
    dishes.push(...stateData.dishes);
  });
  return dishes;
}

export function getDishById(id: string): Dish | undefined {
  return getAllDishes().find((d) => d.id === id);
}

export function getStateByDishId(id: string): string | undefined {
  for (const [stateName, stateData] of Object.entries(FOOD_DATA)) {
    if (stateData.dishes.some((d) => d.id === id)) {
      return stateName;
    }
  }
  return undefined;
}
