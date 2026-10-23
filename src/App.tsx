import { useState, useMemo, useCallback, useEffect } from "react";
import {
  UtensilsCrossed,
  MapPin,
  ChefHat,
  Flame,
  Leaf,
  Star,
  X,
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { IndiaMap3D } from "./components/IndiaMap3D";
import { BharatDishExperience } from "./components/BharatDishExperience";
import {
  FOOD_DATA,
  STATE_EMOJIS,
  CULINARY_REGIONS,
  getTasteColor,
  StateFood,
  Dish,
} from "./data/foodData";
import { useTheme } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ui/ThemeToggle";

export default function App() {
  const { isLight } = useTheme();
  // Navigation & View state
  const [activeView, setActiveView] = useState<"map" | "dish">("map");
  const [activeDishId, setActiveDishId] = useState<string | null>(null);

  // Map state
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTaste, setSelectedTaste] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Hash-based URL routing: #/dish/:dishId
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/dish/")) {
        const dishId = hash.replace("#/dish/", "").trim();
        if (dishId) {
          setActiveDishId(dishId);
          setActiveView("dish");
        }
      } else {
        setActiveView("map");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToDish = useCallback((dishId: string) => {
    window.location.hash = `/dish/${dishId}`;
    setActiveDishId(dishId);
    setActiveView("dish");
  }, []);

  const navigateToMap = useCallback(() => {
    window.location.hash = `/map`;
    setActiveView("map");
  }, []);

  // All available states in food data
  const stateNames = useMemo(() => Object.keys(FOOD_DATA), []);

  // Filtered states based on search, region, and taste
  const filteredStates = useMemo(() => {
    return stateNames.filter((name) => {
      const data = FOOD_DATA[name];
      if (!data) return false;

      // Region filter
      if (selectedRegion && CULINARY_REGIONS[selectedRegion]) {
        if (!CULINARY_REGIONS[selectedRegion].states.includes(name)) return false;
      }

      // Taste profile filter
      if (selectedTaste) {
        const matchesTaste = data.dishes.some((d) =>
          d.tasteProfile.toLowerCase().includes(selectedTaste.toLowerCase())
        );
        if (!matchesTaste) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = name.toLowerCase().includes(q);
        const matchesDish = data.dishes.some(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            d.ingredients.some((ing) => ing.toLowerCase().includes(q))
        );
        if (!matchesName && !matchesDish) return false;
      }

      return true;
    });
  }, [stateNames, selectedRegion, selectedTaste, searchQuery]);

  // Current state data
  const stateData: StateFood | null = selectedState ? FOOD_DATA[selectedState] ?? null : null;

  // Next and previous state navigation
  const currentIndex = selectedState ? stateNames.indexOf(selectedState) : -1;
  const handlePrevState = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedState(stateNames[currentIndex - 1]);
    } else {
      setSelectedState(stateNames[stateNames.length - 1]);
    }
  }, [currentIndex, stateNames]);

  const handleNextState = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < stateNames.length - 1) {
      setSelectedState(stateNames[currentIndex + 1]);
    } else {
      setSelectedState(stateNames[0]);
    }
  }, [currentIndex, stateNames]);

  // Taste tags for quick filtering
  const tasteFilters = [
    { label: "All Flavors", value: null },
    { label: "Fiery & Spicy 🌶️", value: "spicy" },
    { label: "Tangy & Sour 🍋", value: "tangy" },
    { label: "Sweet & Fragrant 🍯", value: "sweet" },
    { label: "Rich & Creamy 🧈", value: "rich" },
    { label: "Aromatic & Herbal 🌿", value: "aromatic" },
  ];

  // If in Dish 3D Experience View, render the dedicated Bharat cinematic experience!
  if (activeView === "dish" && activeDishId) {
    return (
      <BharatDishExperience
        dishId={activeDishId}
        onBackToMap={navigateToMap}
        onSelectDish={navigateToDish}
      />
    );
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${
        isLight ? "bg-[#f5efe4] text-slate-800" : "bg-[#0b0f19] text-slate-100"
      }`}
    >
      {/* ── HEADER ── */}
      <header
        className={`flex-shrink-0 px-4 md:px-6 py-3 flex items-center justify-between shadow-2xl z-30 transition-colors duration-300 border-b ${
          isLight
            ? "bg-gradient-to-r from-amber-100 via-[#fdfbf7] to-orange-100 border-amber-900/15 shadow-amber-950/5 text-slate-800"
            : "bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 border-amber-900/40 text-slate-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-950/50 ring-1 ring-orange-300/30 shrink-0">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-base sm:text-lg font-black tracking-tight leading-none ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Digital Food Atlas of India
              </h1>
              <span
                className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLight
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                3D Subcontinent Map
              </span>
            </div>
            <p
              className={`text-[11px] sm:text-xs mt-0.5 font-medium ${
                isLight ? "text-amber-900/80" : "text-amber-300/80"
              }`}
            >
              33 Intended Regions · Top 2 Signature Dishes Per State · 66 Historical Journeys
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xs md:max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search states, dishes (e.g. Biryani, Dosa), or spices..."
              className={`w-full text-xs sm:text-sm pl-10 pr-9 py-1.5 rounded-xl border focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all ${
                isLight
                  ? "bg-white text-slate-900 placeholder-slate-400 border-amber-900/20 shadow-sm"
                  : "bg-slate-900/90 text-slate-100 placeholder-slate-400 border-slate-700/80 shadow-inner"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right CTA & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          <button
            onClick={() => navigateToDish("masala-dosa")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-950/40 border border-amber-300/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
            <span className="hidden sm:inline">BHARAT: 3D Living History</span>
            <span className="sm:hidden">BHARAT 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── FILTER & REGION BAR ── */}
      <div
        className={`flex-shrink-0 backdrop-blur-md border-b px-4 md:px-6 py-2 flex items-center justify-between gap-4 text-xs overflow-x-auto z-20 scrollbar-thin transition-colors ${
          isLight
            ? "bg-[#f7f3ea]/90 border-amber-900/10 text-slate-700"
            : "bg-slate-950/80 border-slate-800/80 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mr-1" />
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider mr-1 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Regions:
          </span>
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedRegion === null
                ? "bg-amber-500 text-amber-950 font-bold shadow-sm"
                : isLight
                ? "text-slate-700 hover:text-slate-900 hover:bg-amber-100/60"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            All Regions ({stateNames.length})
          </button>
          {Object.entries(CULINARY_REGIONS).map(([key, region]) => (
            <button
              key={key}
              onClick={() => setSelectedRegion(selectedRegion === key ? null : key)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedRegion === key
                  ? "bg-amber-500 text-amber-950 font-bold shadow-sm"
                  : isLight
                  ? "text-slate-700 hover:text-slate-900 hover:bg-amber-100/60"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* Quick Taste Filters */}
        <div className="hidden xl:flex items-center gap-1.5">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider mr-1 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Flavors:
          </span>
          {tasteFilters.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setSelectedTaste(tf.value)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                selectedTaste === tf.value
                  ? isLight
                    ? "bg-orange-100 text-orange-950 border border-orange-300 font-bold"
                    : "bg-orange-500/30 text-orange-200 border border-orange-400/50"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-amber-100/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT: 3D MAP & FOOD EXPLORER ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ── LEFT: 3D MAP VIEWPORT ── */}
        <div
          className={`relative transition-all duration-300 ease-in-out h-full overflow-hidden ${
            isSidebarCollapsed ? "w-full" : "w-full md:w-[60%] lg:w-[63%]"
          }`}
        >
          <IndiaMap3D
            selectedState={selectedState}
            onSelectState={setSelectedState}
            hoveredState={hoveredState}
            onHoverState={setHoveredState}
            searchFilter={searchQuery}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* ── RIGHT: FOOD EXPLORER PANEL (REDUCED TO MAX 2 FOODS PER STATE) ── */}
        {!isSidebarCollapsed && (
          <div
            className={`w-full md:w-[40%] lg:w-[37%] flex flex-col overflow-hidden border-l shadow-2xl z-10 transition-all duration-300 ${
              isLight
                ? "bg-[#faf7f2] border-amber-900/15 text-slate-800 shadow-amber-950/5"
                : "bg-slate-900 border-slate-800/80 text-slate-100"
            }`}
          >
            {!selectedState ? (
              // ── WELCOME & DISCOVERY VIEW ──
              <div className="flex-1 flex flex-col overflow-y-auto p-6 scrollbar-thin space-y-6">
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-950/60 mx-auto mb-4 ring-1 ring-white/20">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <h2
                    className={`text-xl sm:text-2xl font-black tracking-tight mb-2 ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Discover India's Culinary Soul
                  </h2>
                  <p
                    className={`text-xs leading-relaxed max-w-sm mx-auto ${
                      isLight ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    Curated to exactly two signature iconic dishes per state. Orbit the 3D map or click any dish to launch its chronological 3D transformation experience.
                  </p>
                </div>

                {/* Featured 3D Pilots Spotlight Card */}
                <div
                  className={`p-4 rounded-2xl border shadow-xl space-y-3 ${
                    isLight
                      ? "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 border-amber-300 shadow-sm text-slate-800"
                      : "bg-gradient-to-br from-amber-950/50 via-slate-850 to-orange-950/40 border-amber-500/40 shadow-xl"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${
                        isLight ? "text-amber-900" : "text-amber-300"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Two Contrasting 3D Pilots
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isLight
                          ? "bg-amber-100 text-amber-950 border-amber-300"
                          : "bg-amber-500/20 text-amber-200 border-amber-400/30"
                      }`}
                    >
                      Live 3D Models
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      isLight ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    Scroll through centuries of culinary evolution in real-time 3D:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Pilot 1 */}
                    <div
                      onClick={() => navigateToDish("masala-dosa")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                        isLight
                          ? "bg-white hover:bg-amber-50 text-slate-800 border-amber-900/15 shadow-sm hover:border-amber-400"
                          : "bg-black/40 hover:bg-amber-950/50 border-amber-700/40 hover:border-amber-400"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between text-xs font-bold ${
                          isLight
                            ? "text-slate-900 group-hover:text-amber-800"
                            : "text-amber-200 group-hover:text-amber-300"
                        }`}
                      >
                        <span>Masala Dosa</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p
                        className={`text-[11px] mt-1 ${
                          isLight ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Fermented pulse batter spreading on hot iron tawa • Karnataka
                      </p>
                    </div>

                    {/* Pilot 2 */}
                    <div
                      onClick={() => navigateToDish("hyderabadi-biryani")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                        isLight
                          ? "bg-white hover:bg-amber-50 text-slate-800 border-amber-900/15 shadow-sm hover:border-amber-400"
                          : "bg-black/40 hover:bg-amber-950/50 border-amber-700/40 hover:border-amber-400"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between text-xs font-bold ${
                          isLight
                            ? "text-slate-900 group-hover:text-amber-800"
                            : "text-amber-200 group-hover:text-amber-300"
                        }`}
                      >
                        <span>Dum Biryani</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p
                        className={`text-[11px] mt-1 ${
                          isLight ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Royal saffron basmati sealed in copper handi • Telangana
                      </p>
                    </div>
                  </div>
                </div>

                {/* State Quick Browser */}
                <div className="space-y-2">
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    <span>Select a Region to Explore ({filteredStates.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                    {filteredStates.map((name) => (
                      <button
                        key={name}
                        onClick={() => setSelectedState(name)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate flex items-center gap-1.5 border transition-all ${
                          isLight
                            ? "bg-white hover:bg-amber-50 text-slate-800 border-amber-900/10 shadow-sm"
                            : "bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-750/60"
                        }`}
                      >
                        <span>{STATE_EMOJIS[name] || "🍲"}</span>
                        <span className="truncate">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // ── STATE CUISINE DETAIL VIEW (MAX TWO TOP FOODS) ──
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* State Card Header */}
                <div
                  className={`p-5 border-b relative ${
                    isLight
                      ? "bg-gradient-to-b from-amber-100/90 via-[#faf7f2] to-[#faf7f2] border-amber-900/15"
                      : "bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-900 border-amber-900/30"
                  }`}
                >
                  {/* Close state button */}
                  <button
                    onClick={() => setSelectedState(null)}
                    className={`absolute top-4 right-4 p-1 rounded-lg transition-colors z-20 ${
                      isLight
                        ? "text-slate-600 hover:text-slate-900 bg-amber-100 hover:bg-amber-200"
                        : "text-slate-400 hover:text-white bg-black/30 hover:bg-black/60"
                    }`}
                    title="Close State View"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Prev / Next State Navigation */}
                  <div
                    className={`flex items-center justify-between mb-2 text-xs font-semibold ${
                      isLight ? "text-amber-800" : "text-amber-400/90"
                    }`}
                  >
                    <button
                      onClick={handlePrevState}
                      className={`flex items-center gap-1 transition-colors ${
                        isLight ? "hover:text-amber-950" : "hover:text-amber-200"
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev Region
                    </button>
                    <span
                      className={`text-[10px] uppercase tracking-wider ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {currentIndex + 1} of {stateNames.length}
                    </span>
                    <button
                      onClick={handleNextState}
                      className={`flex items-center gap-1 transition-colors ${
                        isLight ? "hover:text-amber-950" : "hover:text-amber-200"
                      }`}
                    >
                      Next Region <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* State Name and Tagline */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow">
                      {STATE_EMOJIS[selectedState] || "🍲"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2
                          className={`text-xl font-black tracking-tight ${
                            isLight ? "text-slate-900" : "text-white"
                          }`}
                        >
                          {selectedState}
                        </h2>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            isLight
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {stateData?.classification || "Region"}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed max-w-sm font-medium mt-0.5 ${
                          isLight ? "text-amber-900" : "text-amber-200/90"
                        }`}
                      >
                        {stateData?.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Recipe Stats Bar */}
                  <div
                    className={`mt-4 flex items-center gap-3 text-xs font-medium ${
                      isLight ? "text-amber-900" : "text-amber-300/90"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                        isLight
                          ? "bg-amber-50 text-amber-950 border-amber-200 shadow-sm"
                          : "bg-black/30 border-amber-700/30"
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{stateData?.dishes.length || 0} Curated Signature Foods</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                        isLight
                          ? "bg-amber-50 text-amber-950 border-amber-200 shadow-sm"
                          : "bg-black/30 border-amber-700/30"
                      }`}
                    >
                      <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Click Any Food to Open 3D History</span>
                    </div>
                  </div>
                </div>

                {/* Dishes Scrollable List (Exactly top 2 signature foods) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                  <div
                    className={`text-[11px] uppercase tracking-widest font-bold flex items-center justify-between ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    <span>Top 2 Signature Dishes</span>
                    <span className={isLight ? "text-amber-800" : "text-amber-400"}>
                      Click to Explore 3D Story
                    </span>
                  </div>

                  {stateData?.dishes.map((dish: Dish, idx: number) => (
                    <div
                      key={dish.id || idx}
                      onClick={() => navigateToDish(dish.id)}
                      className={`rounded-2xl p-4.5 border transition-all duration-200 shadow-md group cursor-pointer relative overflow-hidden ${
                        isLight
                          ? "bg-white hover:bg-amber-50/50 border-amber-900/10 hover:border-amber-400 shadow-amber-950/5 text-slate-800"
                          : "bg-slate-850/90 hover:bg-slate-800 border-slate-750 hover:border-amber-400 text-slate-100"
                      }`}
                    >
                      {/* Top Pilot Badge */}
                      {dish.hasPilot3D && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-600 text-slate-950 font-black text-[9px] px-3 py-0.5 rounded-bl-xl shadow-md uppercase tracking-wider">
                          FLAGSHIP 3D PILOT
                        </div>
                      )}

                      {/* Dish Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <h3
                              className={`font-extrabold text-base leading-snug transition-colors flex items-center gap-1.5 ${
                                isLight
                                  ? "text-slate-900 group-hover:text-amber-800"
                                  : "text-white group-hover:text-amber-300"
                              }`}
                            >
                              <span>{dish.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-500" />
                            </h3>
                            {dish.alternateName && (
                              <p
                                className={`text-[11px] italic ${
                                  isLight ? "text-slate-500" : "text-slate-400"
                                }`}
                              >
                                {dish.alternateName}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${getTasteColor(
                            dish.tasteProfile
                          )}`}
                        >
                          {dish.tasteProfile}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        className={`text-xs leading-relaxed mb-3 pl-8 ${
                          isLight ? "text-slate-600" : "text-slate-300"
                        }`}
                      >
                        {dish.description}
                      </p>

                      {/* Era and Technique Badges */}
                      <div className="pl-8 mb-3 flex flex-wrap gap-2 text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded-md border font-medium ${
                            isLight
                              ? "bg-amber-100 text-amber-900 border-amber-200"
                              : "bg-amber-950/40 text-amber-300 border-amber-800/40"
                          }`}
                        >
                          Era: {dish.era}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border font-medium truncate max-w-xs ${
                            isLight
                              ? "bg-amber-50 text-slate-700 border-amber-200/80"
                              : "bg-slate-900 text-slate-300 border-slate-750"
                          }`}
                        >
                          {dish.keyTechnique}
                        </span>
                      </div>

                      {/* Ingredients */}
                      <div className="pl-8 mb-3.5">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                            isLight ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          <Leaf className="w-3 h-3 text-emerald-500" />
                          Key Ingredients
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {dish.ingredients.map((ing, i) => (
                            <span
                              key={i}
                              className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                                isLight
                                  ? "bg-amber-50 text-amber-950 border-amber-200 shadow-xs"
                                  : "bg-slate-800/90 text-amber-200/90 border-slate-700/80"
                              }`}
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Prominent Clickable Action Button */}
                      <div
                        className={`pl-8 pt-2 border-t flex items-center justify-between ${
                          isLight ? "border-amber-900/10" : "border-slate-750/60"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
                            isLight
                              ? "text-amber-800 group-hover:text-amber-950"
                              : "text-amber-400/90 group-hover:text-amber-300"
                          }`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Explore 3D Living History Experience
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isLight
                              ? "bg-amber-100 group-hover:bg-amber-500 text-amber-800 group-hover:text-slate-950"
                              : "bg-amber-500/20 group-hover:bg-amber-500 text-amber-300 group-hover:text-slate-950"
                          }`}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="h-4" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FLOATING 3D HOVER TOOLTIP ── */}
      {hoveredState && hoveredState !== selectedState && FOOD_DATA[hoveredState] && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in duration-150 ${
            isLight
              ? "bg-white/95 text-slate-800 border-amber-900/20 shadow-amber-950/10"
              : "bg-slate-900/95 text-slate-100 border-amber-500/40"
          }`}
        >
          <span className="text-2xl">{STATE_EMOJIS[hoveredState] || "🍲"}</span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>
                {hoveredState}
              </h4>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  isLight
                    ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                    : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                }`}
              >
                {FOOD_DATA[hoveredState].dishes.length} Signature Dishes
              </span>
            </div>
            <p
              className={`text-xs max-w-xs truncate ${
                isLight ? "text-slate-600" : "text-slate-300"
              }`}
            >
              {FOOD_DATA[hoveredState].tagline}
            </p>
          </div>
          <span
            className={`text-xs font-semibold pl-2 border-l ${
              isLight ? "text-amber-800 border-amber-900/15" : "text-amber-400 border-slate-700"
            }`}
          >
            Click to view
          </span>
        </div>
      )}
    </div>
  );
}
