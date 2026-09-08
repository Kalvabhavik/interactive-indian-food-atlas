import { useState, useCallback, useEffect } from "react";
import { UtensilsCrossed, MapPin, ChefHat, Flame, Leaf, Star, X } from "lucide-react";

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────
interface Dish {
  name: string;
  description: string;
  ingredients: string[];
  tasteProfile: string;
}

interface StateFood {
  tagline: string;
  dishes: Dish[];
}

// ─────────────────────────────────────────────
// COMPREHENSIVE FOOD DATA – ALL INDIAN STATES
// ─────────────────────────────────────────────
const FOOD_DATA: Record<string, StateFood> = {
  "Andhra Pradesh": {
    tagline: "Land of fire and spice — India's spiciest cuisine",
    dishes: [
      {
        name: "Pesarattu",
        description: "Crispy green moong dal crepes served with ginger chutney and upma stuffing. A beloved Andhra breakfast staple made from whole green lentils ground into a batter.",
        ingredients: ["Green moong dal", "Rice", "Ginger", "Green chillies", "Onion", "Cumin"],
        tasteProfile: "Savory & Mildly Spiced",
      },
      {
        name: "Gongura Mutton",
        description: "Tender mutton slow-cooked with the tangy sorrel leaves (gongura), chillies and spices unique to Andhra. The sourness of gongura perfectly balances the richness of the meat.",
        ingredients: ["Mutton", "Gongura leaves", "Dry red chillies", "Onion", "Coconut", "Tamarind"],
        tasteProfile: "Tangy & Fiery",
      },
      {
        name: "Hyderabadi Dum Biryani",
        description: "Aromatic layered rice dish where marinated meat is cooked under a sealed lid (dum), allowing steam to infuse saffron, rose water and spice flavours into every grain.",
        ingredients: ["Basmati rice", "Mutton", "Saffron", "Fried onions", "Yoghurt", "Whole spices"],
        tasteProfile: "Rich, Aromatic & Warm",
      },
      {
        name: "Avakaya Pickle",
        description: "Raw mango pickle made with mustard powder, red chilli, fenugreek and sesame oil — a quintessential Andhra condiment eaten year-round with rice and dal.",
        ingredients: ["Raw mango", "Mustard seeds", "Red chilli powder", "Fenugreek", "Sesame oil", "Salt"],
        tasteProfile: "Fiery, Pungent & Tangy",
      },
      {
        name: "Punugulu",
        description: "Deep-fried fritters made from fermented idli/dosa batter, crispy on outside and soft inside. Served with coconut chutney and peanut chutney as a popular street snack.",
        ingredients: ["Idli batter", "Rice flour", "Onion", "Green chillies", "Curry leaves", "Ginger"],
        tasteProfile: "Crispy & Savory",
      },
    ],
  },
  "Arunachal Pradesh": {
    tagline: "Tribal highlands meet bamboo-scented mountain cuisine",
    dishes: [
      {
        name: "Thukpa",
        description: "Hearty noodle soup originating from Tibetan influence, with vegetables or meat in a clear broth seasoned with local herbs. A warming staple in the cold mountain climate.",
        ingredients: ["Wheat noodles", "Vegetables", "Yak meat", "Ginger", "Garlic", "Local herbs"],
        tasteProfile: "Savory, Warming & Mild",
      },
      {
        name: "Apong (Rice Beer)",
        description: "Traditional fermented rice beverage brewed in bamboo containers. An integral part of Arunachali tribal culture and celebrations, with a slightly sweet and sour flavour.",
        ingredients: ["Glutinous rice", "Millet", "Fermentation starter", "Water", "Bamboo vessel"],
        tasteProfile: "Sweet, Fermented & Earthy",
      },
      {
        name: "Bamboo Shoot Curry",
        description: "Tender young bamboo shoots cooked with pork or dried fish and seasoned with local spices. The unique earthy-bitter taste of bamboo is central to Arunachali cooking.",
        ingredients: ["Fresh bamboo shoots", "Pork", "Dried fish", "Chillies", "Ginger", "Garlic"],
        tasteProfile: "Earthy, Smoky & Spicy",
      },
      {
        name: "Pika Pila",
        description: "A tangy and spicy pickle made from bamboo shoots mixed with pork fat and chillies. Often aged for weeks to develop complex sour and smoky flavours.",
        ingredients: ["Bamboo shoots", "Pork fat", "Dried chillies", "Salt", "Fermented soybean"],
        tasteProfile: "Sour, Spicy & Fermented",
      },
    ],
  },
  Assam: {
    tagline: "Where mustard oil, fish and the Brahmaputra define every meal",
    dishes: [
      {
        name: "Masor Tenga",
        description: "A light, tangy fish curry made with tomatoes, lemon, ou tenga (elephant apple) or raw mango. This sour fish preparation is iconic to Assamese cuisine and eaten with rice.",
        ingredients: ["Rohu fish", "Tomatoes", "Elephant apple", "Mustard oil", "Turmeric", "Green chillies"],
        tasteProfile: "Tangy, Light & Sour",
      },
      {
        name: "Khar",
        description: "A unique alkaline dish cooked using khar — a filtrate from burnt banana peel ash — with raw papaya, lentils or fish. The defining starter of an Assamese thali.",
        ingredients: ["Raw papaya", "Dried banana peel ash (khar)", "Mustard oil", "Ginger", "Green chillies"],
        tasteProfile: "Earthy, Alkaline & Mild",
      },
      {
        name: "Pitha",
        description: "Assamese rice cakes made during Bihu festival in many varieties — steamed, fried or roasted with jaggery and sesame fillings. A celebration of harvest and tradition.",
        ingredients: ["Rice flour", "Coconut", "Jaggery", "Sesame seeds", "Banana leaves"],
        tasteProfile: "Sweet & Fragrant",
      },
      {
        name: "Aloo Pitika",
        description: "Mashed potatoes tempered with mustard oil, raw onions, green chillies and fresh coriander. A simple but beloved Assamese comfort side dish paired with dal and rice.",
        ingredients: ["Boiled potatoes", "Mustard oil", "Raw onion", "Green chillies", "Coriander", "Salt"],
        tasteProfile: "Pungent, Fresh & Savory",
      },
      {
        name: "Duck Meat Curry",
        description: "Duck slow-cooked with ash gourd, sesame seeds, coconut and a medley of aromatic spices. A festive delicacy especially popular during Bihu and winter months in Assam.",
        ingredients: ["Duck", "Ash gourd", "Sesame seeds", "Coconut", "Ginger-garlic paste", "Whole spices"],
        tasteProfile: "Rich, Nutty & Aromatic",
      },
    ],
  },
  Bihar: {
    tagline: "Ancient land of simple, soulful flavors rooted in tradition",
    dishes: [
      {
        name: "Litti Chokha",
        description: "Wheat dough balls stuffed with roasted sattu (bengal gram flour) and spices, baked over coal embers and dunked in ghee. Served with spiced mashed brinjal and tomato chokha.",
        ingredients: ["Wheat flour", "Sattu (roasted gram flour)", "Ghee", "Ajwain", "Brinjal", "Tomatoes"],
        tasteProfile: "Smoky, Nutty & Hearty",
      },
      {
        name: "Khaja",
        description: "A layered, flaky sweet pastry made from refined flour deep-fried and soaked in sugar syrup. This crispy dessert originated in Silao and is a cherished Bihari mithai.",
        ingredients: ["Refined flour", "Ghee", "Sugar", "Cardamom", "Saffron"],
        tasteProfile: "Sweet & Crunchy",
      },
      {
        name: "Thekua",
        description: "Crunchy whole-wheat cookies flavoured with jaggery, fennel and coconut. A sacred Chhath Puja offering prepared in every Bihari household during the sun-worship festival.",
        ingredients: ["Whole wheat flour", "Jaggery", "Fennel seeds", "Coconut", "Ghee"],
        tasteProfile: "Sweet, Nutty & Aromatic",
      },
      {
        name: "Sattu Paratha",
        description: "Unleavened flatbreads stuffed with seasoned roasted sattu mixed with raw onion, green chillies and mustard oil. A high-protein, sustaining breakfast eaten across Bihar.",
        ingredients: ["Whole wheat flour", "Roasted sattu", "Mustard oil", "Onion", "Green chillies", "Ajwain"],
        tasteProfile: "Savory & Earthy",
      },
      {
        name: "Chana Ghuguni",
        description: "Spiced black chickpea curry cooked with onion, tomato, ginger and a blend of aromatic spices. Often served as street food with puri or as a standalone snack in Bihar.",
        ingredients: ["Black chickpeas", "Onion", "Tomatoes", "Ginger", "Cumin", "Coriander"],
        tasteProfile: "Spicy & Hearty",
      },
    ],
  },
  Chhattisgarh: {
    tagline: "The rice bowl of India — tribal flavors, forest ingredients",
    dishes: [
      {
        name: "Chila",
        description: "Savory rice flour crepes similar to dosas, topped with a spiced lentil mixture and vegetables. A popular breakfast item in Chhattisgarh served with green chutney.",
        ingredients: ["Rice flour", "Chana dal", "Onion", "Green chillies", "Coriander", "Tomato"],
        tasteProfile: "Savory & Light",
      },
      {
        name: "Fara",
        description: "Steamed rice flour dumplings with a savory chana dal filling, served with coconut-coriander chutney. This light and healthy dish is a Chhattisgarhi breakfast staple.",
        ingredients: ["Rice flour", "Chana dal", "Onion", "Green chillies", "Ginger", "Mustard seeds"],
        tasteProfile: "Mild, Savory & Steamed",
      },
      {
        name: "Aamat",
        description: "A sour-spiced soup made from mixed vegetables, bamboo shoots and tamarind popular among Bastar tribal communities. A uniquely local, forest-foraged preparation.",
        ingredients: ["Mixed vegetables", "Bamboo shoots", "Tamarind", "Chillies", "Forest spices", "Garlic"],
        tasteProfile: "Tangy, Sour & Rustic",
      },
      {
        name: "Muthia",
        description: "Steamed dumplings made from bottle gourd or colocasia leaves, gram flour and spices. A wholesome tribal dish eaten with mustard oil-tempered side vegetables.",
        ingredients: ["Bottle gourd", "Gram flour", "Turmeric", "Ajwain", "Green chillies", "Sesame seeds"],
        tasteProfile: "Savory, Mild & Wholesome",
      },
    ],
  },
  Goa: {
    tagline: "Portuguese-spiced, coconut-kissed, ocean-fresh coastal paradise",
    dishes: [
      {
        name: "Fish Curry & Rice",
        description: "Goa's national dish: fresh fish simmered in a spiced coconut milk curry with Kokum (garcinia) for sourness. Served with plain parboiled rice — simple yet extraordinary.",
        ingredients: ["Mackerel or kingfish", "Coconut milk", "Kokum", "Kashmiri chillies", "Turmeric", "Onion"],
        tasteProfile: "Tangy, Coconutty & Spiced",
      },
      {
        name: "Xacuti",
        description: "A complex Goan curry made with large whole spices, poppy seeds, roasted coconut and red chillies. Cooked with chicken or lamb — deeply aromatic with Portuguese influence.",
        ingredients: ["Chicken", "Roasted coconut", "Poppy seeds", "Dried red chillies", "Cloves", "Star anise"],
        tasteProfile: "Rich, Spicy & Deeply Aromatic",
      },
      {
        name: "Sorpotel",
        description: "A fiery pork dish made from offal and meat marinated in vinegar, red chillies and spices, slow-cooked for hours. This Portuguese-influenced dish improves with age.",
        ingredients: ["Pork", "Pork liver", "Vinegar", "Kashmiri chillies", "Ginger", "Garlic"],
        tasteProfile: "Fiery, Sour & Bold",
      },
      {
        name: "Bebinca",
        description: "A traditional Goan layered dessert of coconut milk, egg yolks, sugar and flour baked one layer at a time. Often called the 'Queen of Goan Desserts'.",
        ingredients: ["Coconut milk", "Egg yolks", "Sugar", "Refined flour", "Ghee", "Cardamom"],
        tasteProfile: "Rich, Sweet & Eggy",
      },
      {
        name: "Choriz Pav",
        description: "Spicy Goan chouriço sausage pan-fried with onions and served in soft local bread rolls (pav). A beloved street food reflecting Goa's Portuguese culinary heritage.",
        ingredients: ["Goan chouriço", "Onions", "Vinegar", "Local pav", "Garlic", "Green chillies"],
        tasteProfile: "Spicy, Tangy & Smoky",
      },
    ],
  },
  Gujarat: {
    tagline: "Sweetness in every bite — the jewel of vegetarian cuisine",
    dishes: [
      {
        name: "Dhokla",
        description: "Soft, spongy steamed savory cakes made from fermented chickpea batter, tempered with mustard seeds, curry leaves and garnished with fresh coconut and coriander.",
        ingredients: ["Chickpea flour", "Yoghurt", "Green chillies", "Ginger", "Mustard seeds", "Curry leaves"],
        tasteProfile: "Tangy, Light & Savory",
      },
      {
        name: "Undhiyu",
        description: "A mixed seasonal vegetable casserole cooked upside-down in earthen pots. Made with winter vegetables, fenugreek dumplings and fresh coconut — a Uttarayan delicacy.",
        ingredients: ["Surti papdi", "Raw banana", "Sweet potato", "Fenugreek dumplings", "Coconut", "Green garlic"],
        tasteProfile: "Sweet, Savory & Herbaceous",
      },
      {
        name: "Thepla",
        description: "Thin spiced flatbreads made from whole wheat flour, fenugreek leaves and a blend of spices. A versatile Gujarati staple enjoyed for breakfast or as travel food with pickle.",
        ingredients: ["Whole wheat flour", "Fresh fenugreek leaves", "Yoghurt", "Turmeric", "Red chilli", "Ajwain"],
        tasteProfile: "Mildly Spiced & Slightly Bitter",
      },
      {
        name: "Dal Dhokli",
        description: "Spiced wheat flour dumplings simmered in a sweet-tangy toor dal, garnished with ghee, peanuts and fresh coriander. A one-pot Gujarati meal that is both comforting and festive.",
        ingredients: ["Toor dal", "Wheat flour", "Jaggery", "Tamarind", "Peanuts", "Ghee"],
        tasteProfile: "Sweet, Tangy & Savory",
      },
      {
        name: "Khandvi",
        description: "Delicate rolls made from gram flour and buttermilk cooked to a smooth paste, spread thin and rolled up. Tempered with sesame and mustard, these melt-in-mouth rolls are legendary.",
        ingredients: ["Gram flour", "Buttermilk", "Turmeric", "Ginger paste", "Sesame seeds", "Coconut"],
        tasteProfile: "Tangy, Savory & Silky",
      },
    ],
  },
  Haryana: {
    tagline: "Agricultural heartland — wholesome dairy-rich comfort food",
    dishes: [
      {
        name: "Bajra Khichdi",
        description: "Pearl millet and moong dal slowly simmered to a thick, comforting porridge, served with a generous spoonful of pure desi ghee. A winter staple across Haryanvi villages.",
        ingredients: ["Bajra (pearl millet)", "Moong dal", "Ghee", "Cumin", "Garlic", "Salt"],
        tasteProfile: "Earthy, Warm & Nutty",
      },
      {
        name: "Hara Dhania Cholia",
        description: "Green coriander seeds tempered with onion, tomatoes and spices to make a fragrant dry sabzi. Eaten with makki ki roti during the winter harvest season in Haryana.",
        ingredients: ["Green coriander seeds", "Onion", "Tomatoes", "Ginger", "Garlic", "Cumin"],
        tasteProfile: "Herbaceous, Savory & Fresh",
      },
      {
        name: "Kadhi Pakora",
        description: "Crispy gram flour fritters dunked in a tart, spiced yoghurt-based gravy and tempered with ghee, dried chilli and cumin. A beloved Haryanvi comfort dish served with rice.",
        ingredients: ["Yoghurt", "Gram flour", "Turmeric", "Dried red chillies", "Cumin", "Ghee"],
        tasteProfile: "Tangy, Creamy & Savory",
      },
      {
        name: "Singri ki Sabzi",
        description: "A dry curry of dried desert beans (sangri/keriya) soaked and cooked with mustard seeds, dry chillies and spices. Originally a Rajasthani-Haryanvi border delicacy.",
        ingredients: ["Dried sangri beans", "Dried ker berries", "Mustard seeds", "Dry red chillies", "Cumin", "Asafoetida"],
        tasteProfile: "Earthy, Slightly Bitter & Savory",
      },
    ],
  },
  "Himachal Pradesh": {
    tagline: "Mountain serenity on a plate — simple, hearty highland fare",
    dishes: [
      {
        name: "Dham",
        description: "A festive Himachali meal served on leaf plates at weddings and celebrations. It features steamed rice, rajma curry, dal with yoghurt-based madra, sour boor ki kari and mittha.",
        ingredients: ["Rice", "Rajma", "Chana dal", "Yoghurt", "Dried fruits", "Whole spices"],
        tasteProfile: "Rich, Savory & Festive",
      },
      {
        name: "Siddu",
        description: "Soft, steamed wheat flour buns stuffed with walnuts, poppy seeds and dry fruits. Eaten with ghee or mutton curry, this beloved Himachali bread is a cold-season delicacy.",
        ingredients: ["Wheat flour", "Walnuts", "Poppy seeds", "Yeast", "Ghee", "Dry fruits"],
        tasteProfile: "Nutty, Mild & Hearty",
      },
      {
        name: "Tudkiya Bhath",
        description: "A slow-cooked flavored rice dish made with lentils, potato, yoghurt and a special blend of spices from Chamba district. Resembles a Himachali-style biryani with distinct mountain flavors.",
        ingredients: ["Rice", "Lentils", "Potatoes", "Yoghurt", "Cloves", "Bay leaf"],
        tasteProfile: "Mildly Spiced & Aromatic",
      },
      {
        name: "Chha Gosht",
        description: "Lamb marinated in yoghurt and gram flour, cooked with a blend of fragrant spices until tender and coated in a thick, cling-worthy gravy. A Himachali celebration meat dish.",
        ingredients: ["Lamb", "Yoghurt", "Gram flour", "Fennel", "Cardamom", "Cinnamon"],
        tasteProfile: "Rich, Aromatic & Creamy",
      },
    ],
  },
  Jharkhand: {
    tagline: "Tribal wisdom, forest bounty — earthy and nourishing",
    dishes: [
      {
        name: "Dhuska",
        description: "Crispy deep-fried pancakes made from ground rice and chana dal batter. A Jharkhand street food served with aloo-chana sabzi or a spiced vegetable gravy.",
        ingredients: ["Rice", "Chana dal", "Green chillies", "Ginger", "Cumin", "Oil"],
        tasteProfile: "Crispy, Savory & Earthy",
      },
      {
        name: "Litti Chokha",
        description: "Shared with Bihar, Jharkhand's version of coal-baked sattu balls dunked generously in ghee with a side of spiced mashed roasted vegetables — robust and filling.",
        ingredients: ["Wheat flour", "Sattu", "Ghee", "Brinjal", "Tomatoes", "Mustard oil"],
        tasteProfile: "Smoky, Nutty & Rustic",
      },
      {
        name: "Handia",
        description: "A traditional tribal rice beer fermented using ranu tablets (herbal starter). Brewed by Adivasi communities and consumed during festivals and ceremonies in Jharkhand.",
        ingredients: ["Broken rice", "Ranu herb tablets", "Water", "Mahua flowers"],
        tasteProfile: "Earthy, Fermented & Mildly Sweet",
      },
      {
        name: "Chilka Roti",
        description: "Flatbreads made from rice flour using the outer layer (chilka) of rice, served with chutney or curries. A staple tribal bread in rural Jharkhand communities.",
        ingredients: ["Coarse rice flour", "Water", "Salt", "Cumin", "Green chillies"],
        tasteProfile: "Rustic, Nutty & Mild",
      },
    ],
  },
  Karnataka: {
    tagline: "Bisi bele to Neer dosa — diversity on every banana leaf",
    dishes: [
      {
        name: "Bisi Bele Bath",
        description: "A one-pot comforting dish of rice, toor dal, vegetables and tamarind slow-cooked with a special spice powder (bisi bele bath powder), topped with crispy fried cashews and ghee.",
        ingredients: ["Rice", "Toor dal", "Tamarind", "Mixed vegetables", "Ghee", "Cashews"],
        tasteProfile: "Spicy, Tangy & Hearty",
      },
      {
        name: "Neer Dosa",
        description: "Delicate, paper-thin rice crepes made from a thin water-based batter with no fermentation required. A coastal Karnataka specialty served with coconut milk curry or chutney.",
        ingredients: ["Raw rice", "Coconut", "Water", "Salt"],
        tasteProfile: "Light, Delicate & Neutral",
      },
      {
        name: "Mangalorean Fish Curry",
        description: "A fiery, coconut-based fish curry made with Byadagi chillies and tamarind typical of the Tulu Nadu coast. The bright red gravy is a hallmark of Karnataka's coastal cuisine.",
        ingredients: ["Pomfret fish", "Coconut", "Byadagi chillies", "Tamarind", "Turmeric", "Garlic"],
        tasteProfile: "Fiery, Tangy & Coconutty",
      },
      {
        name: "Mysore Pak",
        description: "A melt-in-the-mouth ghee-rich sweet made from gram flour, sugar and large amounts of pure ghee. Originating from Mysore's royal kitchens, it is Karnataka's most famous dessert.",
        ingredients: ["Gram flour (besan)", "Pure ghee", "Sugar", "Cardamom"],
        tasteProfile: "Rich, Sweet & Buttery",
      },
      {
        name: "Ragi Mudde",
        description: "Dense balls of finger millet flour cooked in boiling water to a clay-like consistency. Eaten by breaking off a piece and swallowing with sambar or meat curry — a nutritional powerhouse.",
        ingredients: ["Ragi (finger millet) flour", "Water", "Salt"],
        tasteProfile: "Earthy, Dense & Neutral",
      },
    ],
  },
  Kerala: {
    tagline: "God's Own Country — land of coconut, spices and backwater flavors",
    dishes: [
      {
        name: "Sadya",
        description: "An elaborate vegetarian feast of 26+ dishes served on a banana leaf for festivals like Onam. Features avial, sambar, pachadi, payasam, chips and much more in precise ritual order.",
        ingredients: ["Mixed vegetables", "Coconut", "Curry leaves", "Mustard seeds", "Yoghurt", "Jaggery"],
        tasteProfile: "Complex, Layered & Festive",
      },
      {
        name: "Appam with Stew",
        description: "Lacy fermented rice hoppers with crispy edges and a soft, fluffy center served with a delicate coconut milk-based vegetable or chicken stew flavoured with peppercorn and ginger.",
        ingredients: ["Rice flour", "Coconut milk", "Yeast", "Chicken", "Potato", "Whole spices"],
        tasteProfile: "Mild, Creamy & Coconutty",
      },
      {
        name: "Kerala Fish Molee",
        description: "A gentle, aromatic fish curry cooked in thin coconut milk with green chillies, turmeric and ginger. Lighter and more delicate than other Kerala fish curries, with a golden hue.",
        ingredients: ["Pearl spot fish (Karimeen)", "Coconut milk", "Green chillies", "Turmeric", "Ginger", "Tomatoes"],
        tasteProfile: "Mild, Aromatic & Coconutty",
      },
      {
        name: "Thalassery Biryani",
        description: "Fragrant biryani made with Kaima short-grained rice, native Kerala spices and chicken or mutton. Distinctly different from North Indian biryani with its floral, lighter seasoning.",
        ingredients: ["Kaima rice", "Chicken", "Onions", "Fennel", "Cashews", "Raisins"],
        tasteProfile: "Aromatic, Fragrant & Mildly Spiced",
      },
      {
        name: "Puttu & Kadala Curry",
        description: "Cylindrical steamed rice cakes layered with grated coconut, served with a hearty black chickpea curry cooked in a spiced coconut-tomato gravy. The quintessential Kerala breakfast.",
        ingredients: ["Rice flour", "Grated coconut", "Black chickpeas", "Shallots", "Coconut milk", "Curry leaves"],
        tasteProfile: "Nutty, Savory & Spiced",
      },
    ],
  },
  "Madhya Pradesh": {
    tagline: "Heart of India — dal baati to street food royalty",
    dishes: [
      {
        name: "Dal Baati Churma",
        description: "Baked wheat dough balls (baati) dunked in rich five-lentil dal (panchmel dal), served with sweet crumbled churma made from fried wheat and jaggery. A Rajasthani-MP classic.",
        ingredients: ["Wheat flour", "Five lentils", "Ghee", "Jaggery", "Cumin", "Asafoetida"],
        tasteProfile: "Rich, Savory & Hearty",
      },
      {
        name: "Poha",
        description: "Flattened rice lightly sautéed with mustard seeds, curry leaves, turmeric, onion and potato. Garnished with sev, coriander and lemon — MP's famous breakfast served across Indore.",
        ingredients: ["Flattened rice", "Onion", "Potato", "Mustard seeds", "Turmeric", "Curry leaves"],
        tasteProfile: "Light, Tangy & Savory",
      },
      {
        name: "Bhutte Ka Kees",
        description: "Grated corn kernels cooked with milk, coconut, green chillies and mustard seeds until thickened. A beloved Indori street food unique to Madhya Pradesh.",
        ingredients: ["Fresh corn", "Milk", "Coconut", "Green chillies", "Mustard seeds", "Turmeric"],
        tasteProfile: "Sweet, Creamy & Mild",
      },
      {
        name: "Seekh Kebab",
        description: "Minced meat mixed with aromatic spices, shaped on skewers and grilled over charcoal. Bhopal's famous seekh kebab has a distinct smoky flavour from the coal fire.",
        ingredients: ["Minced mutton", "Onion", "Green chillies", "Ginger-garlic", "Garam masala", "Charcoal"],
        tasteProfile: "Smoky, Spiced & Savory",
      },
      {
        name: "Chakki Ki Shaak",
        description: "Bite-sized fresh wheat gluten dumplings cooked in a tangy, spiced gravy of yoghurt and onion. A uniquely Rajasthani-influenced dish popular across Madhya Pradesh and Rajasthan.",
        ingredients: ["Wheat gluten", "Yoghurt", "Onion", "Tomato", "Cumin", "Whole spices"],
        tasteProfile: "Tangy, Savory & Filling",
      },
    ],
  },
  Maharashtra: {
    tagline: "From coastal Konkan to Vidarbha heat — bold, diverse and proud",
    dishes: [
      {
        name: "Misal Pav",
        description: "Sprouted moth beans curry (usal) topped with crunchy farsan, onion and tomato, drizzled with spicy tarri (oil-based gravy). Served with soft pav — a fiery Maharashtrian breakfast icon.",
        ingredients: ["Moth bean sprouts", "Farsan", "Tomatoes", "Onions", "Kokum", "Pav bread"],
        tasteProfile: "Fiery, Tangy & Crunchy",
      },
      {
        name: "Vada Pav",
        description: "Deep-fried spiced potato vada served in a soft bun (pav) with dry garlic chutney, tamarind chutney and green chilli. Mumbai's beloved street food and the 'Indian Burger'.",
        ingredients: ["Potato", "Chickpea batter", "Garlic", "Mustard seeds", "Pav", "Tamarind chutney"],
        tasteProfile: "Savory, Garlicky & Spiced",
      },
      {
        name: "Puran Poli",
        description: "Soft flatbreads stuffed with a sweet filling of chana dal cooked with jaggery and cardamom. Eaten with ghee and a bowl of katachi amti (lentil soup) on festive days.",
        ingredients: ["Whole wheat flour", "Chana dal", "Jaggery", "Cardamom", "Ghee", "Saffron"],
        tasteProfile: "Sweet, Fragrant & Rich",
      },
      {
        name: "Kolhapuri Mutton Curry",
        description: "A fiercely spicy mutton curry from Kolhapur, made with the famous Kolhapuri masala of stone-ground dry coconut, coriander and Byadagi chillies. Not for the faint-hearted.",
        ingredients: ["Mutton", "Dry coconut", "Kolhapuri masala", "Onion", "Sesame seeds", "Poppy seeds"],
        tasteProfile: "Fiery, Rich & Bold",
      },
      {
        name: "Sabudana Khichdi",
        description: "Tapioca pearls tossed with roasted peanuts, cumin, green chillies and fresh coconut. A popular Maharashtrian fasting food and breakfast eaten especially during Navratri.",
        ingredients: ["Tapioca pearls", "Peanuts", "Potatoes", "Cumin", "Green chillies", "Coconut"],
        tasteProfile: "Light, Nutty & Mildly Spiced",
      },
    ],
  },
  Manipur: {
    tagline: "Valley of jewels — fermented flavors and tribal culinary art",
    dishes: [
      {
        name: "Eromba",
        description: "A Manipuri staple made from boiled and mashed vegetables or fish with fermented fish paste (ngari), garnished with chillies. Strong, pungent and deeply flavourful.",
        ingredients: ["Fermented fish (ngari)", "Boiled vegetables", "Green chillies", "Onion", "Ginger"],
        tasteProfile: "Pungent, Spicy & Umami",
      },
      {
        name: "Singju",
        description: "A fresh salad of finely julienned raw vegetables mixed with fermented fish, chillies and roasted chickpea powder. Crunchy, tangy and deeply aromatic — a Manipuri street snack.",
        ingredients: ["Cabbage", "Lotus stem", "Fermented fish", "Chillies", "Chickpea powder", "Onion"],
        tasteProfile: "Tangy, Crunchy & Pungent",
      },
      {
        name: "Chamthong (Kangshoi)",
        description: "A light Manipuri vegetable stew with seasonal greens, dried fish and minimal spices. Clean, nutritious and wholesome, this is everyday comfort food for valley Meitei people.",
        ingredients: ["Mixed greens", "Dried fish", "Onion", "Garlic", "Salt", "Water"],
        tasteProfile: "Mild, Clean & Savory",
      },
      {
        name: "Nga Thong Khawai",
        description: "Glutinous rice cooked inside bamboo tubes with fish and herbs, then flame-roasted until the bamboo chars. A traditional forest cooking technique giving food a smoky, earthy character.",
        ingredients: ["Glutinous rice", "Fresh fish", "Bamboo tubes", "Herbs", "Salt"],
        tasteProfile: "Smoky, Earthy & Delicate",
      },
    ],
  },
  Meghalaya: {
    tagline: "Abode of clouds — pork, rice and Khasi tradition on every table",
    dishes: [
      {
        name: "Jadoh",
        description: "Fragrant red rice cooked with pork pieces, onion, ginger and black sesame seeds. This Khasi one-pot rice dish is central to Meghalayan food culture and celebration.",
        ingredients: ["Red rice", "Pork", "Black sesame", "Onion", "Ginger", "Turmeric"],
        tasteProfile: "Savory, Nutty & Aromatic",
      },
      {
        name: "Doh Jem",
        description: "A spicy pork blood and intestine curry — a bold, adventurous delicacy among the Khasi community. Cooked with local herbs, chillies and fresh ginger in minimal oil.",
        ingredients: ["Pork blood", "Pork intestines", "Ginger", "Chillies", "Local herbs", "Onion"],
        tasteProfile: "Bold, Spicy & Rich",
      },
      {
        name: "Nakham Bitchi",
        description: "A soup made with dried, smoked fish (nakham) ground with dried chillies and soaked in water to make a rustic broth. A pungent, mineral-rich tribal preparation.",
        ingredients: ["Dried smoked fish", "Dried red chillies", "Water", "Salt"],
        tasteProfile: "Intensely Smoky & Pungent",
      },
      {
        name: "Pudoh",
        description: "A traditional Khasi sticky rice and sesame pudding steamed in banana leaves, cooked during festivals. Sweet and subtly nutty with a chewy, satisfying texture.",
        ingredients: ["Sticky rice", "Sesame seeds", "Jaggery", "Banana leaves", "Coconut"],
        tasteProfile: "Sweet, Nutty & Chewy",
      },
    ],
  },
  Mizoram: {
    tagline: "Fresh bamboo, smoked meats and mountain simplicity",
    dishes: [
      {
        name: "Bai",
        description: "Mizoram's most traditional dish — a simple stew of leafy vegetables, pork and dried/fermented fish cooked with minimal spices. Eaten daily with sticky rice.",
        ingredients: ["Leafy vegetables", "Pork", "Fermented dried fish", "Ginger", "Salt"],
        tasteProfile: "Mild, Smoky & Savory",
      },
      {
        name: "Sawhchiar",
        description: "Thick rice congee made with chicken or pork, cooked to a creamy porridge consistency. A popular comfort meal eaten during illness or cold weather in Mizoram.",
        ingredients: ["Rice", "Pork or chicken", "Ginger", "Salt", "Garlic"],
        tasteProfile: "Mild, Creamy & Comforting",
      },
      {
        name: "Zu (Rice Beer)",
        description: "Traditional home-brewed rice beer made by fermenting boiled rice with millet and herbal starter cakes. Consumed at social gatherings, festivals and celebrations in Mizo culture.",
        ingredients: ["Cooked rice", "Millet", "Herbal starter cakes", "Water"],
        tasteProfile: "Mildly Sweet, Tangy & Fermented",
      },
      {
        name: "Chhum Han",
        description: "Assorted vegetables and herbs steamed together without oil or spices — a testament to Mizo minimal cooking philosophy. Often served with pork and rice as a complete meal.",
        ingredients: ["Seasonal greens", "Cabbage", "Beans", "Pumpkin", "Salt", "Ginger"],
        tasteProfile: "Clean, Fresh & Light",
      },
    ],
  },
  Nagaland: {
    tagline: "Fierce, smoky and fearless — Naga cuisine for the bold",
    dishes: [
      {
        name: "Smoked Pork with Bamboo Shoot",
        description: "Tender smoked pork simmered with fermented bamboo shoots and Naga King Chilli (Bhut Jolokia) — one of the world's hottest peppers. Intensely flavourful and fiery.",
        ingredients: ["Smoked pork", "Fermented bamboo shoots", "Bhut Jolokia (King Chilli)", "Ginger", "Garlic"],
        tasteProfile: "Intensely Smoky, Fiery & Funky",
      },
      {
        name: "Galho",
        description: "A thick rice and meat gruel similar to congee, made from broken rice, leafy greens and smoked pork. Naga comfort food in its purest form, eaten with fermented soybean paste.",
        ingredients: ["Broken rice", "Smoked pork", "Leafy greens", "Fermented soybean", "Salt"],
        tasteProfile: "Smoky, Savory & Umami",
      },
      {
        name: "Axone (Fermented Soybean)",
        description: "Pungent, sticky fermented soybean paste used as a seasoning in pork, chicken and vegetable dishes. The defining umami ingredient of Naga and Northeast tribal cuisines.",
        ingredients: ["Soybeans", "Fermentation process", "Salt", "Chillies"],
        tasteProfile: "Pungent, Funky & Rich Umami",
      },
      {
        name: "Zutho (Naga Rice Beer)",
        description: "A milky, semi-fermented rice beer with a mild sour taste and frothy consistency. Brewed by Angami Naga people for daily consumption and offered to guests as hospitality.",
        ingredients: ["Rice", "Water", "Millet starter", "Banana leaves"],
        tasteProfile: "Mildly Sour & Frothy",
      },
    ],
  },
  Odisha: {
    tagline: "Temple offerings, ocean harvest and the most beloved pitha culture",
    dishes: [
      {
        name: "Pakhala Bhata",
        description: "Cooked rice fermented overnight in water, served with a tempering of mustard, chilli and curry leaves. Accompanied by fried fish, chips and sorbet — Odisha's summer superfood.",
        ingredients: ["Cooked rice", "Water", "Mustard seeds", "Curry leaves", "Green chillies", "Yoghurt"],
        tasteProfile: "Sour, Cooling & Light",
      },
      {
        name: "Dalma",
        description: "A hearty preparation of toor dal cooked with seasonal vegetables and tempered with panch phoran (five-spice blend) and ghee. The sattvic soul food of Jagannath Temple prasad.",
        ingredients: ["Toor dal", "Raw banana", "Papaya", "Panch phoran", "Dried chilli", "Coconut"],
        tasteProfile: "Savory, Mild & Comforting",
      },
      {
        name: "Chenna Poda",
        description: "Fresh chhena (cottage cheese) mixed with sugar and cardamom and baked until caramelized on all sides. India's only cheesecake-like dessert, said to be Lord Jagannath's favourite.",
        ingredients: ["Fresh chhena", "Sugar", "Semolina", "Cardamom", "Ghee"],
        tasteProfile: "Sweet, Caramelized & Creamy",
      },
      {
        name: "Machha Besara",
        description: "Fish cooked in a thick mustard-turmeric paste with garlic, onion and chillies. The bold, pungent mustard combined with the freshness of fish is quintessentially Odishan.",
        ingredients: ["Fish", "Mustard paste", "Turmeric", "Green chillies", "Onion", "Garlic"],
        tasteProfile: "Pungent, Spicy & Bold",
      },
      {
        name: "Rasabali",
        description: "Flattened fried chhena patties soaked in thickened, sweetened milk flavoured with cardamom and saffron. A divine dessert from Kendrapara, also served as temple prasad.",
        ingredients: ["Chhena (cottage cheese)", "Khoya", "Saffron", "Cardamom", "Sugar", "Ghee"],
        tasteProfile: "Rich, Sweet & Fragrant",
      },
    ],
  },
  Punjab: {
    tagline: "Land of butter, tandoor and indomitable flavors",
    dishes: [
      {
        name: "Makki di Roti & Sarson da Saag",
        description: "Crispy corn flatbreads paired with slow-cooked, spiced mustard greens mash. A winter classic of Punjab, finished with a dollop of white butter and jaggery on the side.",
        ingredients: ["Maize flour", "Mustard greens", "Spinach", "White butter", "Jaggery", "Garlic"],
        tasteProfile: "Earthy, Slightly Bitter & Rich",
      },
      {
        name: "Butter Chicken",
        description: "Tandoor-cooked chicken in a silky, mildly-spiced tomato and cream sauce with fenugreek leaves. Invented in Delhi by Punjabi migrants, it is now India's most globally recognized dish.",
        ingredients: ["Chicken", "Tomatoes", "Fresh cream", "Butter", "Kashmiri chilli", "Fenugreek leaves"],
        tasteProfile: "Creamy, Mildly Spiced & Rich",
      },
      {
        name: "Chole Bhature",
        description: "Boldly spiced black chickpeas served with giant, pillowy deep-fried leavened bread. A beloved Punjabi Sunday brunch staple finished with pickled onions and mango pickle.",
        ingredients: ["Black chickpeas", "Dried pomegranate seeds", "Onion", "Tomato", "Refined flour", "Yoghurt"],
        tasteProfile: "Spicy, Tangy & Hearty",
      },
      {
        name: "Amritsari Kulcha",
        description: "Leavened, stuffed flatbread baked in a tandoor with a filling of spiced potatoes and paneer. A speciality of Amritsar, eaten with hot chole and a glass of salted lassi.",
        ingredients: ["Refined flour", "Spiced potatoes", "Paneer", "Butter", "Kasuri methi", "Pomegranate seeds"],
        tasteProfile: "Buttery, Savory & Flaky",
      },
      {
        name: "Lassi",
        description: "Thick, frothy yoghurt drink blended with water and sugar or salt. Punjab's sweet lassi, topped with a dollop of malai, is an iconic refreshing drink synonymous with the state.",
        ingredients: ["Yoghurt", "Sugar", "Rose water", "Saffron", "Fresh cream"],
        tasteProfile: "Cool, Sweet & Creamy",
      },
    ],
  },
  Rajasthan: {
    tagline: "Desert royalty — where scarcity inspired culinary genius",
    dishes: [
      {
        name: "Dal Baati Churma",
        description: "Hard baked wheat balls (baati) submerged in panchmel dal (five-lentil), served alongside sweet crumbled churma. The definitive dish of Rajasthan, born of desert necessity.",
        ingredients: ["Wheat flour", "Five lentils", "Ghee", "Jaggery", "Fennel", "Cloves"],
        tasteProfile: "Rich, Earthy & Indulgent",
      },
      {
        name: "Laal Maas",
        description: "Fiery red mutton curry made with Mathania chillies, yoghurt and aromatic spices. One of India's most intensely spiced meat preparations — dark, boldly flavored and legendary.",
        ingredients: ["Mutton", "Mathania chillies", "Yoghurt", "Onion", "Ghee", "Whole spices"],
        tasteProfile: "Fiery, Smoky & Bold",
      },
      {
        name: "Ker Sangri",
        description: "A tangy-spicy desert delicacy made from dried ker berries and sangri beans cooked with spices and dried chillies. A Rajasthani pickle-like preparation that is quintessentially royal.",
        ingredients: ["Ker berries", "Sangri beans", "Dried chillies", "Mustard oil", "Cumin", "Asafoetida"],
        tasteProfile: "Tangy, Spicy & Pungent",
      },
      {
        name: "Ghevar",
        description: "A disc-shaped honeycomb-textured sweet made from refined flour batter fried in ghee and soaked in sugar syrup. Topped with rabri, saffron and pistachios during Teej festival.",
        ingredients: ["Refined flour", "Ghee", "Sugar syrup", "Rabri", "Saffron", "Pistachio"],
        tasteProfile: "Sweet, Crispy & Rich",
      },
      {
        name: "Pyaaz Kachori",
        description: "Crispy deep-fried pastry stuffed with a spiced onion, fennel and kachri filling. Jaipur's iconic street food, typically eaten at breakfast with sweet-sour tamarind chutney.",
        ingredients: ["Refined flour", "Onion", "Fennel seeds", "Dried mango powder", "Ghee", "Red chilli"],
        tasteProfile: "Crispy, Savory & Tangy",
      },
    ],
  },
  Sikkim: {
    tagline: "Himalayan serenity — momos, thukpa and organic mountain bounty",
    dishes: [
      {
        name: "Momos",
        description: "Steamed dumplings stuffed with spiced pork, vegetables or cheese. Originating from Tibetan influence, Sikkimese momos are served with fiery Sichuan-spiced tomato chutney.",
        ingredients: ["Refined flour", "Pork mince", "Ginger", "Garlic", "Cabbage", "Onion"],
        tasteProfile: "Savory, Juicy & Mildly Spiced",
      },
      {
        name: "Gundruk",
        description: "Fermented leafy greens (mustard, radish) left to sour and dry before being cooked into a tangy soup or curry. One of the most beloved traditional foods across Sikkim and Nepal.",
        ingredients: ["Mustard greens", "Radish leaves", "Fermentation process", "Onion", "Tomato", "Chilli"],
        tasteProfile: "Sour, Tangy & Earthy",
      },
      {
        name: "Chhurpi Soup",
        description: "Hard smoked yak cheese (chhurpi) slow-cooked into a thick, warming broth with vegetables. The smoky, deeply flavoured cheese gives the soup a unique mountain character.",
        ingredients: ["Chhurpi (yak cheese)", "Vegetables", "Ginger", "Garlic", "Chilli", "Salt"],
        tasteProfile: "Smoky, Savory & Rich",
      },
      {
        name: "Phagshapa",
        description: "Strips of dried pork fat cooked with dried red chillies and radish. A classic Sikkimese preparation that is intensely flavoured and pairs perfectly with boiled rice.",
        ingredients: ["Dried pork fat", "Dried red chillies", "White radish", "Ginger", "Garlic"],
        tasteProfile: "Smoky, Spicy & Rich",
      },
    ],
  },
  "Tamil Nadu": {
    tagline: "Temple food, banana leaf feasts and filter coffee culture",
    dishes: [
      {
        name: "Chettinad Chicken Curry",
        description: "An intensely spiced South Indian curry from the Chettinad region, made with freshly ground stone spices, kalpasi (stone flower), marathi mokku and sun-dried chilies.",
        ingredients: ["Chicken", "Kalpasi (stone flower)", "Marathi mokku", "Star anise", "Coconut", "Red chillies"],
        tasteProfile: "Intensely Spiced & Aromatic",
      },
      {
        name: "Idli Sambar",
        description: "Perfectly steamed fermented rice and urad dal cakes served with a tart, vegetable-loaded tamarind lentil soup (sambar) and coconut chutney. Tamil Nadu's morning ritual.",
        ingredients: ["Idli rice", "Urad dal", "Toor dal", "Tamarind", "Drumstick", "Coconut"],
        tasteProfile: "Tangy, Savory & Comforting",
      },
      {
        name: "Rasam",
        description: "A thin, peppery and tangy soup made from tamarind water, tomatoes, pepper, cumin and garlic. Consumed as a digestive and immune booster, also poured over rice with ghee.",
        ingredients: ["Tamarind", "Tomatoes", "Black pepper", "Cumin", "Garlic", "Toor dal"],
        tasteProfile: "Peppery, Tangy & Warming",
      },
      {
        name: "Pongal",
        description: "Freshly harvested rice cooked with moong dal, ghee and black pepper into a soft, comforting khichdi. Prepared during the Pongal harvest festival as an offering to the Sun God.",
        ingredients: ["Raw rice", "Moong dal", "Ghee", "Black pepper", "Cumin", "Cashews"],
        tasteProfile: "Savory, Buttery & Mild",
      },
      {
        name: "Kothu Parotta",
        description: "Shredded layered parotta stir-fried with eggs, onion, tomato and a spiced meat or vegetable curry. A beloved Tamil street food with the distinct rhythmic clatter of metal blades.",
        ingredients: ["Layered parotta", "Eggs", "Onion", "Tomatoes", "Chicken curry", "Curry leaves"],
        tasteProfile: "Spiced, Savory & Satisfying",
      },
    ],
  },
  Telangana: {
    tagline: "Pearl city cuisine — bold, rustic and deeply satisfying",
    dishes: [
      {
        name: "Hyderabadi Biryani",
        description: "World-famous layered dum biryani with slow-cooked marinated meat, saffron-infused rice and caramelised onions. The jewel of Hyderabadi cuisine and a global favourite.",
        ingredients: ["Basmati rice", "Mutton", "Saffron", "Fried onions", "Yoghurt", "Rose water"],
        tasteProfile: "Aromatic, Rich & Deeply Spiced",
      },
      {
        name: "Sarva Pindi",
        description: "Spiced rice flour pancake made with sesame seeds, peanuts, chillies and curry leaves. A unique Telangana breakfast item that is crispy on the outside and hearty inside.",
        ingredients: ["Rice flour", "Peanuts", "Sesame seeds", "Curry leaves", "Red chillies", "Onion"],
        tasteProfile: "Crispy, Nutty & Savory",
      },
      {
        name: "Gongura Pachadi",
        description: "Sorrel leaf chutney ground with roasted chillies, garlic and tempering of curry leaves. This tangy, spicy condiment is the heartbeat of Telangana food and loved universally.",
        ingredients: ["Gongura (sorrel) leaves", "Dry red chillies", "Garlic", "Mustard seeds", "Curry leaves"],
        tasteProfile: "Tangy, Spicy & Pungent",
      },
      {
        name: "Haleem",
        description: "A slow-cooked stew of wheat, lentils and mutton pounded together for hours into a thick, intensely spiced porridge. A Hyderabadi Ramadan special with GI tag protection.",
        ingredients: ["Mutton", "Whole wheat", "Lentils", "Fried onions", "Ginger-garlic", "Whole spices"],
        tasteProfile: "Rich, Warming & Deeply Spiced",
      },
      {
        name: "Jonna Rotte",
        description: "Thick sorghum (jowar) flatbreads cooked over open flame, eaten with red chilli chutney, ghee and leafy greens. A rustic staple of Telangana villages and interior districts.",
        ingredients: ["Sorghum (jowar) flour", "Water", "Salt", "Ghee", "Red chilli chutney"],
        tasteProfile: "Earthy, Rustic & Mild",
      },
    ],
  },
  Tripura: {
    tagline: "Royal bamboo forests meet Bengali and tribal food traditions",
    dishes: [
      {
        name: "Mui Borok",
        description: "A tribal Tripuri fish preparation where fish is marinated with indigenous herbs and spices, wrapped in banana leaves and steamed or smoked. Served with rice and fermented fish paste.",
        ingredients: ["Fresh fish", "Banana leaves", "Indigenous herbs", "Fermented fish paste", "Ginger", "Chilli"],
        tasteProfile: "Smoky, Herbaceous & Savory",
      },
      {
        name: "Chakhwi",
        description: "A sour, fermented bamboo shoot-based curry cooked with pork or chicken and local herbs. The distinct sour flavour from bamboo shoots is a signature of Tripuri tribal cooking.",
        ingredients: ["Fermented bamboo shoots", "Pork", "Ginger", "Garlic", "Local herbs", "Chillies"],
        tasteProfile: "Sour, Smoky & Bold",
      },
      {
        name: "Gudok",
        description: "A Kokborok tribal dish made from steamed, mashed potatoes mixed with fermented fish and dried shrimp. Rustic, pungent and unique to the Tripuri community.",
        ingredients: ["Potatoes", "Fermented fish", "Dried shrimp", "Onion", "Chillies"],
        tasteProfile: "Pungent, Earthy & Savory",
      },
      {
        name: "Wahan Mosdeng",
        description: "Pork cooked with tomatoes, onions and a blend of local chillies and spices. A beloved tribal non-vegetarian preparation eaten across various Tripuri communities.",
        ingredients: ["Pork", "Tomatoes", "Onion", "Local chillies", "Ginger", "Garlic"],
        tasteProfile: "Spicy, Bold & Rich",
      },
    ],
  },
  "Uttar Pradesh": {
    tagline: "Mughal grandeur meets Awadhi dum — refinement on a plate",
    dishes: [
      {
        name: "Tunde Kebab",
        description: "Meltingly tender minced meat patties flavoured with over 150 spices. Created by one-armed master chef Haji Murad Ali of Lucknow — a culinary legend that dissolves on the tongue.",
        ingredients: ["Buffalo meat mince", "150+ spices blend", "Raw papaya", "Ghee", "Onion", "Garam masala"],
        tasteProfile: "Deeply Spiced, Melt-in-Mouth & Rich",
      },
      {
        name: "Awadhi Dum Biryani",
        description: "Fragrant long-grain rice layered with slow-marinated mutton, sealed and cooked on dum (steam pressure). Lucknow's biryani is lighter and more delicately fragrant than Hyderabadi.",
        ingredients: ["Long-grain rice", "Mutton", "Kewra water", "Saffron", "Whole spices", "Fried onions"],
        tasteProfile: "Floral, Aromatic & Delicate",
      },
      {
        name: "Paan (Banarasi)",
        description: "Betel leaf filled with choona, katha, gulkand, rose petals, fennel and candied mukhwas. Banarasi paan is a post-meal mouth freshener and cultural icon of Varanasi.",
        ingredients: ["Betel leaf", "Gulkand", "Fennel seeds", "Rose petals", "Katha", "Choona"],
        tasteProfile: "Sweet, Fragrant & Refreshing",
      },
      {
        name: "Kakori Kebab",
        description: "Ultra-soft mutton seekh kebabs from Kakori, made by forcing finely pounded meat onto skewers and grilling in a tandoor. Named after a town near Lucknow, these are pure Nawabi luxury.",
        ingredients: ["Mutton mince", "Raw papaya", "Ghee", "Yellow chilli paste", "Kewra", "Cardamom"],
        tasteProfile: "Silky, Aromatic & Refined",
      },
      {
        name: "Malai Makhan",
        description: "Whipped cream-based airy winter sweet from Varanasi, collected from morning dew and churned with saffron and pistachio. Ethereally light, it vanishes the instant it hits your tongue.",
        ingredients: ["Fresh cream", "Saffron", "Sugar", "Pistachio", "Rose water", "Cardamom"],
        tasteProfile: "Ethereal, Sweet & Fragrant",
      },
    ],
  },
  Uttarakhand: {
    tagline: "Pahadi simplicity — altitude-adapted mountain cuisine with soul",
    dishes: [
      {
        name: "Kafuli",
        description: "A creamy spinach and fenugreek leaf curry thickened with rice flour, cooked in pure mustard oil. This green, nutritious dish is the ultimate comfort food of the Garhwal hills.",
        ingredients: ["Spinach", "Fenugreek leaves", "Rice flour", "Mustard oil", "Garlic", "Cumin"],
        tasteProfile: "Earthy, Creamy & Slightly Bitter",
      },
      {
        name: "Bhang Ki Chutney",
        description: "A spicy-sour dip made from ground hemp seeds (bhang), green chillies, garlic and lemon. The unique nutty flavour of cannabis seeds makes this Uttarakhand's most distinctive condiment.",
        ingredients: ["Hemp seeds (bhang)", "Green chillies", "Garlic", "Lemon juice", "Coriander", "Salt"],
        tasteProfile: "Nutty, Tangy & Spicy",
      },
      {
        name: "Aloo Ke Gutke",
        description: "Bite-sized spiced potato cubes pan-fried with whole cumin, dried red chillies and jakhiya seeds (wild mustard). A beloved Kumaoni breakfast eaten with puri and green chutney.",
        ingredients: ["Potatoes", "Jakhiya seeds", "Dried red chillies", "Cumin", "Turmeric", "Mustard oil"],
        tasteProfile: "Spicy, Crispy & Rustic",
      },
      {
        name: "Bal Mithai",
        description: "A chocolate-brown fudge made from roasted khoya, coated in tiny white sugar balls. This iconic Almora sweet has GI tag status and is a beloved souvenir from Uttarakhand.",
        ingredients: ["Khoya", "Sugar", "White poppy seed balls", "Cardamom"],
        tasteProfile: "Rich, Sweet & Caramelized",
      },
    ],
  },
  "West Bengal": {
    tagline: "Fish, mishti doi and the poetry of Bengali cuisine",
    dishes: [
      {
        name: "Kosha Mangsho",
        description: "Slow-cooked, dark mutton curry from Durga Puja feasts — meat caramelised and braised in yoghurt and spices until the oil separates and the gravy clings to every morsel.",
        ingredients: ["Mutton", "Onion", "Yoghurt", "Mustard oil", "Garam masala", "Bay leaf"],
        tasteProfile: "Rich, Deep & Intensely Savory",
      },
      {
        name: "Mishti Doi",
        description: "Sweet, caramelised yoghurt set in earthen pots. Made by mixing full-fat milk with date jaggery and allowing it to ferment overnight. The iconic Bengali dessert with a unique earthy sweetness.",
        ingredients: ["Full-fat milk", "Date jaggery (nolen gur)", "Yoghurt starter", "Earthen pot"],
        tasteProfile: "Sweet, Tangy & Caramelized",
      },
      {
        name: "Shorshe Ilish",
        description: "Hilsa fish cooked in a mustard seed paste with green chillies and mustard oil. This pungent, rich fish preparation is the crown jewel of Bengali cuisine and culture.",
        ingredients: ["Hilsa fish", "Mustard paste", "Mustard oil", "Green chillies", "Turmeric"],
        tasteProfile: "Pungent, Oily & Rich",
      },
      {
        name: "Rosogolla",
        description: "Soft, spongy cottage cheese balls boiled in light sugar syrup. Created in Kolkata (GI-protected), these delicate white spheres that squirt sweet syrup are loved across the world.",
        ingredients: ["Chhena (fresh cheese)", "Sugar", "Rose water", "Semolina"],
        tasteProfile: "Sweet, Light & Spongy",
      },
      {
        name: "Aloo Posto",
        description: "Potatoes cooked in a creamy white poppy seed paste with green chillies and mustard oil. Simple, addictive and beloved — a true Bengali everyday comfort dish.",
        ingredients: ["Potatoes", "Poppy seeds", "Green chillies", "Mustard oil", "Turmeric", "Salt"],
        tasteProfile: "Nutty, Creamy & Mildly Spiced",
      },
    ],
  },
  "Jammu and Kashmir": {
    tagline: "Wazwan royalty — a 36-course feast of Kashmiri opulence",
    dishes: [
      {
        name: "Rogan Josh",
        description: "Slow-braised lamb in a vibrant red gravy made with Kashmiri Mirch, whole spices and ratanjot (alkanet root) for colour. A signature dish of the royal Wazwan feast.",
        ingredients: ["Lamb", "Kashmiri red chilli", "Fennel powder", "Yoghurt", "Whole spices", "Ratanjot"],
        tasteProfile: "Mildly Spiced, Rich & Aromatic",
      },
      {
        name: "Dum Aloo (Kashmiri)",
        description: "Small whole potatoes fried and slow-cooked in an intensely spiced yoghurt-based gravy with fennel and dried ginger. A vegetarian jewel of Kashmiri Pandit cuisine.",
        ingredients: ["Baby potatoes", "Kashmiri chilli", "Fennel powder", "Dry ginger", "Yoghurt", "Ghee"],
        tasteProfile: "Spicy, Creamy & Aromatic",
      },
      {
        name: "Yakhni Pulao",
        description: "Aromatic rice cooked in a delicate, spiced lamb stock with whole spices, saffron and caramelized onions. A restrained, elegant rice preparation that showcases Kashmiri Wazwan artistry.",
        ingredients: ["Long-grain rice", "Lamb", "Saffron", "Fennel", "Cardamom", "Fried onions"],
        tasteProfile: "Floral, Delicate & Aromatic",
      },
      {
        name: "Gushtaba",
        description: "Melt-in-the-mouth pounded meat balls cooked in a creamy yoghurt sauce with fennel and ginger. Always the last course of the royal Wazwan, signalling the end of the feast.",
        ingredients: ["Lamb", "Yoghurt", "Fennel", "Dried ginger", "Ghee", "Whole spices"],
        tasteProfile: "Creamy, Mild & Delicate",
      },
      {
        name: "Kehwa",
        description: "Fragrant green tea infused with saffron strands, crushed cardamom, cinnamon and garnished with crushed almonds. Kashmir's signature winter warming drink served in a samovar.",
        ingredients: ["Green tea", "Saffron", "Cardamom", "Cinnamon", "Almonds", "Honey"],
        tasteProfile: "Floral, Warming & Aromatic",
      },
    ],
  },
  Delhi: {
    tagline: "Mughal heritage meets street food chaos — flavors from every corner of India",
    dishes: [
      {
        name: "Chaat",
        description: "The ultimate Delhi street food — puri, papdi, boiled potato and chickpeas smothered in tamarind chutney, mint chutney, yoghurt, red chilli and chaat masala. Sweet-sour-spicy fireworks.",
        ingredients: ["Puri/papdi", "Boiled chickpeas", "Tamarind chutney", "Mint chutney", "Yoghurt", "Chaat masala"],
        tasteProfile: "Sweet, Tangy & Spicy",
      },
      {
        name: "Paranthe Wali Gali Paratha",
        description: "Stuffed whole-wheat flatbreads from Old Delhi's legendary Paranthe Wali Gali, fried in ghee with fillings of potato, radish, cauliflower or paneer. Served with multiple chutneys.",
        ingredients: ["Whole wheat flour", "Ghee", "Potato stuffing", "Pickle", "Yoghurt", "Butter"],
        tasteProfile: "Buttery, Crispy & Savory",
      },
      {
        name: "Nihari",
        description: "Slow-cooked shank meat stew simmered overnight with bone marrow and aromatic spices. A pre-dawn Mughal breakfast tradition from Jama Masjid area of Old Delhi.",
        ingredients: ["Beef/mutton shank", "Bone marrow", "Atta", "Fried onions", "Ginger-garlic", "Whole spices"],
        tasteProfile: "Rich, Intensely Savory & Spiced",
      },
      {
        name: "Daulat Ki Chaat",
        description: "A winter-only ephemeral dessert made from whipped morning dew and milk foam set overnight. Topped with khoya and saffron — it is the most poetic sweet in Indian street food.",
        ingredients: ["Full-fat milk", "Cream", "Saffron", "Khoya", "Pistachio", "Sugar"],
        tasteProfile: "Airy, Sweet & Ethereal",
      },
      {
        name: "Kebab Rolls",
        description: "Juicy seekh or tikka kebabs wrapped in thin rumali roti with raw onions, chutney and squeeze of lime. Delhi's most beloved hand-held street food from Mughlai restaurants.",
        ingredients: ["Minced meat", "Rumali roti", "Onion", "Mint chutney", "Lime", "Chaat masala"],
        tasteProfile: "Smoky, Tangy & Savory",
      },
    ],
  },
};

// ─────────────────────────────────────────────
// ACCURATE INDIA STATE MAP
// The previous map used hand-drawn placeholder polygons. This map loads
// real state boundaries and projects them into the existing SVG so that
// the rest of the atlas (selection, tooltip, labels and food data) stays
// unchanged.
// ─────────────────────────────────────────────
interface IndiaMapGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

interface IndiaMapFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: IndiaMapGeometry;
}

interface IndiaMapState {
  id: string;
  name: string;
  d: string;
  cx: number;
  cy: number;
}

const INDIA_STATES_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/india.geojson";

const SHORT_NAMES: Record<string, string> = {
  "Jammu and Kashmir": "J&K",
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
};

function normalizeStateName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[.']/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getGeoJsonStateName(properties: Record<string, unknown>) {
  const candidates = [
    "st_nm",
    "ST_NM",
    "state",
    "STATE",
    "state_name",
    "STATE_NAME",
    "name",
    "NAME",
    "NAME_1",
    "State_Name",
  ];

  for (const key of candidates) {
    const value = properties[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function projectPoint(
  lon: number,
  lat: number,
  bounds: { minLon: number; maxLon: number; minY: number; maxY: number },
) {
  // Web-Mercator-style projection keeps the familiar north/south shape of
  // the country while avoiding the distorted hand-drawn layout.
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const rad = (clampedLat * Math.PI) / 180;
  const mercatorY = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 360;
  const y =
    ((bounds.maxY - mercatorY) / (bounds.maxY - bounds.minY)) * 470;
  return [x, y] as const;
}

function getAllCoordinates(geometry: IndiaMapGeometry): number[][] {
  const result: number[][] = [];
  if (geometry.type === "Polygon") {
    for (const ring of geometry.coordinates as number[][][]) {
      for (const point of ring) result.push(point);
    }
  } else {
    for (const polygon of geometry.coordinates as number[][][][]) {
      for (const ring of polygon) {
        for (const point of ring) result.push(point);
      }
    }
  }
  return result;
}

function projectGeometryToPath(
  geometry: IndiaMapGeometry,
  bounds: { minLon: number; maxLon: number; minY: number; maxY: number },
) {
  const ringToPath = (ring: number[][]) =>
    ring
      .map(([lon, lat], index) => {
        const [x, y] = projectPoint(lon, lat, bounds);
        return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ") + " Z";

  if (geometry.type === "Polygon") {
    return (geometry.coordinates as number[][][]).map(ringToPath).join(" ");
  }

  return (geometry.coordinates as number[][][][])
    .map((polygon) => polygon.map(ringToPath).join(" "))
    .join(" ");
}

function buildIndiaMapStates(features: IndiaMapFeature[]): IndiaMapState[] {
  const wantedNames = Object.keys(FOOD_DATA);
  const wantedByNormalizedName = new Map(
    wantedNames.map((name) => [normalizeStateName(name), name]),
  );

  // Treat Ladakh as part of the Jammu & Kashmir map area
  wantedByNormalizedName.set("ladakh", "Jammu and Kashmir");

  // Treat Ladakh as part of the Jammu & Kashmir map area);

  const matchingFeatures = features
    .map((feature) => ({
      feature,
      sourceName: getGeoJsonStateName(feature.properties),
    }))
    .filter(({ sourceName }) =>
      wantedByNormalizedName.has(normalizeStateName(sourceName)),
    );

  const coordinates = matchingFeatures.flatMap(({ feature }) =>
    getAllCoordinates(feature.geometry),
  );

  const longitudes = coordinates.map(([lon]) => lon);
  const latitudes = coordinates.map(([lon, lat]) => {
    const clampedLat = Math.max(-85, Math.min(85, lat));
    const rad = (clampedLat * Math.PI) / 180;
    return Math.log(Math.tan(Math.PI / 4 + rad / 2));
  });

  const bounds = {
    minLon: Math.min(...longitudes),
    maxLon: Math.max(...longitudes),
    minY: Math.min(...latitudes),
    maxY: Math.max(...latitudes),
  };

  // Add a little breathing room around the real geography without changing
  // the overall panel layout.
  const lonPad = (bounds.maxLon - bounds.minLon) * 0.045;
  const yPad = (bounds.maxY - bounds.minY) * 0.045;
  bounds.minLon -= lonPad;
  bounds.maxLon += lonPad;
  bounds.minY -= yPad;
  bounds.maxY += yPad;

  return matchingFeatures.map(({ feature, sourceName }) => {
    const normalized = normalizeStateName(sourceName);
    const canonicalName = wantedByNormalizedName.get(normalized) ?? sourceName;
    const points = getAllCoordinates(feature.geometry);
    const centroidPoints = points.length ? points : [[0, 0]];
    const projected = centroidPoints.map(([lon, lat]) =>
      projectPoint(lon, lat, bounds),
    );
    const cx = projected.reduce((sum, [x]) => sum + x, 0) / projected.length;
    const cy = projected.reduce((sum, [, y]) => sum + y, 0) / projected.length;

    return {
      id: canonicalName,
      name: canonicalName,
      d: projectGeometryToPath(feature.geometry, bounds),
      cx,
      cy,
    };
  });
}

// ─────────────────────────────────────────────
// TASTE PROFILE COLOR MAP
// ─────────────────────────────────────────────
function getTasteColor(taste: string) {
  const t = taste.toLowerCase();
  if (t.includes("sweet")) return "bg-yellow-100 text-yellow-800";
  if (t.includes("fiery") || t.includes("spicy") || t.includes("intense")) return "bg-red-100 text-red-800";
  if (t.includes("tangy") || t.includes("sour") || t.includes("tart")) return "bg-lime-100 text-lime-800";
  if (t.includes("smoky")) return "bg-stone-100 text-stone-700";
  if (t.includes("creamy") || t.includes("rich")) return "bg-amber-100 text-amber-800";
  if (t.includes("earthy")) return "bg-green-100 text-green-800";
  if (t.includes("mild") || t.includes("light") || t.includes("delicate")) return "bg-sky-100 text-sky-800";
  if (t.includes("aromatic") || t.includes("fragrant") || t.includes("floral")) return "bg-purple-100 text-purple-800";
  return "bg-orange-100 text-orange-800";
}

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────
export default function App() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);
  const [mapStates, setMapStates] = useState<IndiaMapState[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(INDIA_STATES_GEOJSON_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Map data request failed: ${response.status}`);
        return response.json();
      })
      .then((geojson: { features: IndiaMapFeature[] }) => {
        setMapStates(buildIndiaMapStates(geojson.features));
      })
      .catch((error: unknown) => {
        if ((error as { name?: string })?.name !== "AbortError") {
          console.error("Unable to load India state boundaries", error);
        }
      });

    return () => controller.abort();
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<SVGPathElement>, name: string) => {
    setHoveredState(name);
    setTooltip({ x: e.clientX, y: e.clientY, name });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGPathElement>) => {
    setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
    setTooltip(null);
  }, []);

  const handleClick = useCallback((name: string) => {
    setSelectedState(name);
  }, []);

  const stateData = selectedState ? FOOD_DATA[selectedState] : null;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAF7F2]">
      {/* ── HEADER ── */}
      <header className="flex-shrink-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-800 px-8 py-4 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-400/30 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-orange-100" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-orange-50 tracking-tight leading-none">
              Digital Food Atlas of India
            </h1>
            <p className="text-orange-300 text-xs mt-0.5 font-medium">
              Explore 28 States · 130+ Traditional Dishes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-orange-200 text-sm">
          <MapPin className="w-4 h-4 text-orange-400" />
          <span className="font-medium">
            {selectedState ? (
              <span className="text-orange-100">
                Exploring <span className="font-bold text-yellow-300">{selectedState}</span>
              </span>
            ) : (
              "Click any state to explore its cuisine"
            )}
          </span>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: MAP PANEL ── */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-amber-50 to-orange-50/30 border-r border-amber-200/60 overflow-hidden"
          style={{ width: "58%" }}>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <svg
              viewBox="0 0 360 470"
              className="w-full h-full drop-shadow-sm"
              style={{ maxHeight: "100%", cursor: "pointer" }}
            >
              {/* Decorative background circles */}
              <circle cx="180" cy="235" r="205" fill="rgba(251,191,36,0.04)" />
              <circle cx="180" cy="235" r="160" fill="rgba(251,191,36,0.03)" />

              {/* Accurate state boundaries */}
              {mapStates.map(({ id, d }) => {
                const isSelected = selectedState === id;
                const isHovered = hoveredState === id;
                const hasData = Boolean(FOOD_DATA[id]);
                return (
                  <path
                    key={id}
                    d={d}
                    data-state={id}
                    fill={
                      isSelected
                        ? "#f97316"
                        : isHovered
                          ? "#fb923c"
                          : hasData
                            ? "rgba(253,230,138,0.75)"
                            : "rgba(253,230,138,0.4)"
                    }
                    stroke={isSelected ? "#c2410c" : isHovered ? "#ea580c" : "#b45309"}
                    strokeWidth={isSelected ? 1.8 : isHovered ? 1.4 : 0.9}
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    fillRule="evenodd"
                    className="transition-all duration-150"
                    style={{
                      cursor: hasData ? "pointer" : "default",
                      filter: isSelected
                        ? "drop-shadow(0 2px 6px rgba(234,88,12,0.4))"
                        : "none",
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, id)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => hasData && handleClick(id)}
                  />
                );
              })}


              {/* State labels */}
              {Array.from(new Map(mapStates.map((state) => [state.id, state])).values()).map(
                ({ id, cx, cy }) => {
                  const isSelected = selectedState === id;
                  const label = SHORT_NAMES[id] || id.slice(0, 2).toUpperCase();

                  return (
                    <text
                      key={`label-${id}`}
                      x={cx}
                      y={cy + 1.5}
                      textAnchor="middle"
                      fontSize={id === "Delhi" ? "3.2" : "4.2"}
                      fontWeight={isSelected ? "700" : "600"}
                      fill={isSelected ? "#7c2d12" : "#92400e"}
                      className="pointer-events-none select-none"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {label}
                    </text>
                  );
                }
              )}
            </svg>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-200 shadow-sm">
            <p className="text-xs font-semibold text-amber-900 mb-1.5">Map Legend</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-500"></div>
                <span className="text-xs text-amber-800">Available state</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-orange-400 border border-orange-600"></div>
                <span className="text-xs text-amber-800">Selected state</span>
              </div>
            </div>
          </div>

          {/* Hint */}
          {!selectedState && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-800/90 text-amber-100 text-xs px-3 py-1.5 rounded-full shadow font-medium flex items-center gap-1.5 backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-amber-300" />
              Hover & click a state to explore its food
            </div>
          )}
        </div>

        {/* ── RIGHT: FOOD EXPLORER PANEL ── */}
        <div className="flex flex-col overflow-hidden bg-[#FAF7F2]" style={{ width: "42%" }}>
          {!selectedState ? (
            // ── WELCOME PLACEHOLDER ──
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200 mb-5">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-amber-950 mb-2">Welcome to India's Food Atlas</h2>
              <p className="text-amber-700 text-sm leading-relaxed max-w-xs mb-6">
                India's 28 states each have a unique culinary identity shaped by history, geography and culture.
                Click any state on the map to begin your gastronomic journey.
              </p>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-6">
                {[
                  { icon: "🌶️", label: "Spicy Andhra" },
                  { icon: "🍛", label: "Rich Mughlai" },
                  { icon: "🥥", label: "Coastal Kerala" },
                  { icon: "🍚", label: "Bengali Feasts" },
                  { icon: "🫓", label: "Punjabi Dhabas" },
                  { icon: "🍮", label: "Gujarati Sweet" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white border border-orange-100 rounded-xl p-2.5 flex flex-col items-center gap-1 shadow-sm"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs text-amber-800 font-medium leading-tight text-center">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                130+ authentic traditional dishes documented
              </div>
            </div>
          ) : (
            // ── STATE FOOD PANEL ──
            <>
              {/* State Header */}
              <div className="flex-shrink-0 bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-5 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10"></div>
                <div className="absolute -right-2 bottom-0 w-16 h-16 rounded-full bg-white/5"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-orange-200" />
                      <span className="text-orange-200 text-xs font-semibold uppercase tracking-widest">
                        Selected State
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1 leading-tight">{selectedState}</h2>
                    <p className="text-orange-100/90 text-sm leading-snug max-w-xs">
                      {stateData?.tagline}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedState(null)}
                    className="ml-2 flex-shrink-0 w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors group"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-white/80 group-hover:text-white" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-1.5 relative z-10">
                  <Flame className="w-3.5 h-3.5 text-orange-200" />
                  <span className="text-orange-200 text-xs font-medium">
                    {stateData?.dishes.length} Signature Dishes
                  </span>
                  <span className="mx-2 text-orange-400">·</span>
                  <Leaf className="w-3.5 h-3.5 text-orange-200" />
                  <span className="text-orange-200 text-xs font-medium">Traditional Recipes</span>
                </div>
              </div>

              {/* Dishes List */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
                {stateData?.dishes.map((dish, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
                  >
                    {/* Dish Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-amber-950 text-base leading-tight group-hover:text-orange-700 transition-colors">
                          {dish.name}
                        </h3>
                      </div>
                      <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${getTasteColor(dish.tasteProfile)}`}>
                        {dish.tasteProfile}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-amber-800/80 text-xs leading-relaxed mb-3">{dish.description}</p>

                    {/* Ingredients */}
                    <div>
                      <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Key Ingredients
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dish.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="bg-orange-50 text-orange-800 text-xs px-2 py-1 rounded-md border border-orange-100 font-medium"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Footer padding */}
                <div className="h-2" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── FLOATING TOOLTIP ── */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-amber-900/95 text-amber-50 text-xs font-semibold px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm border border-amber-700/50 flex items-center gap-1.5"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 40,
            transform: "translateY(-50%)",
          }}
        >
          <MapPin className="w-3 h-3 text-orange-400" />
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
