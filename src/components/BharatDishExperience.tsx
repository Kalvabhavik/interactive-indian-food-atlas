import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  Flame,
  Leaf,
  Clock,
  Users,
  ChefHat,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Award,
  Scroll,
  Info,
  CheckCircle2,
  Share2,
  Layers,
  Milestone,
  Box,
} from "lucide-react";
import { Dish, getAllDishes, getStateByDishId } from "../data/foodData";
import {
  getCulinaryJourneyForDish,
  DishCulinaryJourney,
  HistoricalStage,
} from "../data/culinaryHistoryData";
import { Dish3DCanvas } from "./Dish3DCanvas";
import { GsapMotionPathTimeline } from "./GsapMotionPathTimeline";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ui/ThemeToggle";

interface BharatDishExperienceProps {
  dishId: string;
  onBackToMap: () => void;
  onSelectDish: (newDishId: string) => void;
}

export const BharatDishExperience: React.FC<BharatDishExperienceProps> = ({
  dishId,
  onBackToMap,
  onSelectDish,
}) => {
  const { isLight } = useTheme();
  const allDishes = getAllDishes();
  const journey: DishCulinaryJourney = getCulinaryJourneyForDish(dishId);
  const currentDish = allDishes.find((d) => d.id === dishId) || allDishes[0];
  const stateName = getStateByDishId(dishId) || currentDish.state;

  // View Mode: 'motionpath' (GSAP scroll waypoints + generation recipes + skiper6) vs '3d' (Interactive 3D model)
  const [activeTab, setActiveTab] = useState<"motionpath" | "3d">("motionpath");

  // Active stage (0 to 6) in 3D mode
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const activeStage: HistoricalStage = journey.stages[activeStageIdx] || journey.stages[0];

  // UI state
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [showDishSwitcher, setShowDishSwitcher] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio Context Ref for Web Audio synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Scroll reference
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update URL hash when dishId changes
  useEffect(() => {
    window.location.hash = `/dish/${dishId}`;
  }, [dishId]);

  // Audio synthesizer: warm calming drone & gentle hearth hum
  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
        setTimeout(() => {
          audioCtxRef.current?.suspend();
          setIsAudioPlaying(false);
        }, 300);
      }
    } else {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Warm harmonic drone (Root C# 138Hz + Fifth G# 207Hz)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(138.59, ctx.currentTime); // C#3
          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(207.65, ctx.currentTime); // G#3

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(320, ctx.currentTime);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
          gainNodeRef.current = gain;
        } else {
          audioCtxRef.current.resume();
          gainNodeRef.current?.gain.setTargetAtTime(0.08, audioCtxRef.current.currentTime, 0.5);
        }
        setIsAudioPlaying(true);
      } catch (e) {
        console.warn("Web Audio not supported or blocked", e);
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Handle stage jump in 3D mode
  const handleStageSelect = (idx: number) => {
    setActiveStageIdx(idx);
    const targetEl = stageRefs.current[idx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextStage = () => {
    if (activeStageIdx < journey.stages.length - 1) {
      handleStageSelect(activeStageIdx + 1);
    }
  };

  const handlePrevStage = () => {
    if (activeStageIdx > 0) {
      handleStageSelect(activeStageIdx - 1);
    }
  };

  const toggleIngredient = (key: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/dish/${dishId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isLight
          ? "bg-[#faf8f5] text-slate-800 selection:bg-amber-500/20 selection:text-amber-900"
          : "bg-[#07090e] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200"
      }`}
    >
      {/* ── TOP CINEMATIC NAVIGATION BAR ── */}
      <header
        className={`sticky top-0 z-50 h-16 backdrop-blur-md border-b px-4 md:px-8 flex items-center justify-between transition-colors duration-300 ${
          isLight
            ? "bg-[#faf8f5]/90 border-amber-900/15 shadow-sm shadow-amber-950/5 text-slate-800"
            : "bg-[#07090e]/90 border-amber-900/25 text-slate-100"
        }`}
      >
        {/* Left: Return & Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBackToMap}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold group shadow-sm border ${
              isLight
                ? "bg-amber-100/80 hover:bg-amber-200/90 text-amber-950 border-amber-300/80 shadow-amber-950/5"
                : "bg-slate-900/80 hover:bg-amber-950/40 text-amber-300 hover:text-amber-200 border-amber-700/30"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Explore India Map</span>
            <span className="sm:hidden">Map</span>
          </button>

          <div className={`h-4 w-px ${isLight ? "bg-amber-900/20" : "bg-slate-800"}`} />

          {/* Wordmark */}
          <div className="flex items-baseline gap-2">
            <span
              className={`font-cinzel font-black tracking-[0.2em] text-sm md:text-base ${
                isLight ? "text-slate-900" : "text-amber-100"
              }`}
            >
              BHARAT
            </span>
            <span
              className={`hidden md:inline font-cormorant italic text-xs tracking-wide ${
                isLight ? "text-amber-800/90" : "text-amber-300/80"
              }`}
            >
              The Living History of Indian Food
            </span>
          </div>
        </div>

        {/* Center: Experience Mode Switcher (GSAP MotionPath vs 3D Studio) */}
        <div
          className={`flex items-center p-1 rounded-2xl border shadow-inner transition-colors ${
            isLight
              ? "bg-amber-100/70 border-amber-300/80"
              : "bg-black/50 border-amber-500/30"
          }`}
        >
          <button
            onClick={() => setActiveTab("motionpath")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "motionpath"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md font-extrabold"
                : isLight
                ? "text-slate-700 hover:text-slate-900"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>MotionPath Waypoints</span>
          </button>

          <button
            onClick={() => setActiveTab("3d")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "3d"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md font-extrabold"
                : isLight
                ? "text-slate-700 hover:text-slate-900"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Studio</span>
          </button>
        </div>

        {/* Right: Actions (Switcher, Sources, Audio, ThemeToggle, Share) */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Dish Switcher Button */}
          <button
            onClick={() => setShowDishSwitcher(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isLight
                ? "bg-white/90 hover:bg-white text-slate-800 border-amber-900/15 shadow-sm hover:border-amber-400"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">All 66 Dishes</span>
            <span className="sm:hidden">Dishes</span>
          </button>

          {/* Sources & Citations Modal Button */}
          <button
            onClick={() => setShowSourcesModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isLight
                ? "bg-white/90 hover:bg-white text-slate-800 border-amber-900/15 shadow-sm hover:border-amber-400"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
            title="View Scholarly Sources & Historical Citations"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Citations ({journey.citations.length})</span>
          </button>

          {/* Audio Ambience Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl border text-xs transition-all ${
              isAudioPlaying
                ? isLight
                  ? "bg-amber-200 text-amber-950 border-amber-400 shadow-sm"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : isLight
                ? "bg-white/90 text-slate-600 border-amber-900/15 hover:text-slate-900 shadow-sm"
                : "bg-slate-850 text-slate-400 border-slate-750 hover:text-slate-200"
            }`}
            title={isAudioPlaying ? "Mute Ambient Sound" : "Listen to Atmospheric Drone"}
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse text-amber-600" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* Share Link */}
          <button
            onClick={copyShareLink}
            className={`p-2 rounded-xl border transition-all ${
              isLight
                ? "bg-white/90 hover:bg-white text-slate-700 border-amber-900/15 shadow-sm"
                : "bg-slate-850 hover:bg-slate-750 text-slate-300 border-slate-750"
            }`}
            title="Copy Direct Link to Dish Journey"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── COPIED LINK TOAST ── */}
      {copiedLink && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Direct link copied to clipboard!</span>
        </div>
      )}

      {/* ── VIEW 1: GSAP MOTIONPATH WAYPOINTS WITH GENERATION RECIPES & SKIPER6 ── */}
      {activeTab === "motionpath" && (
        <div className="flex-1 w-full animate-in fade-in duration-300">
          <GsapMotionPathTimeline
            dishId={dishId}
            dishName={currentDish.name}
          />
        </div>
      )}

      {/* ── VIEW 2: 3D TRANSFORMATION STUDIO (WebGL Three.js persistent scene) ── */}
      {activeTab === "3d" && (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden animate-in fade-in duration-300">
          {/* ── LEFT COLUMN: PERSISTENT 3D FOOD TRANSFORMATION CANVAS (5 cols on lg) ── */}
          <div
            className={`lg:col-span-6 xl:col-span-5 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] relative flex flex-col border-b lg:border-b-0 lg:border-r transition-colors duration-300 ${
              isLight
                ? "bg-[#f5f1e8] border-amber-900/15"
                : "bg-gradient-to-b from-[#0a0d14] via-[#080a10] to-[#06080c] border-amber-900/20"
            }`}
          >
            {/* Top Stage & Era Indicator */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div
                className={`px-3.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-semibold tracking-wider flex items-center gap-2 ${
                  isLight
                    ? "bg-white/85 border-amber-900/15 text-amber-950 shadow-sm"
                    : "bg-black/60 border-amber-500/30 text-amber-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>STAGE {activeStage.stageNumber} OF 7</span>
                <span className="text-amber-500/70">•</span>
                <span className={isLight ? "text-slate-700 font-normal" : "text-slate-300 font-normal"}>
                  {activeStage.era}
                </span>
              </div>

              <div
                className={`px-3 py-1 rounded-full backdrop-blur-md border text-[11px] ${
                  isLight
                    ? "bg-white/80 border-amber-900/15 text-slate-700 shadow-sm"
                    : "bg-slate-900/70 border-slate-700/50 text-slate-300"
                }`}
              >
                {activeStage.yearRange}
              </div>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="flex-1 w-full relative">
              <Dish3DCanvas
                dish={currentDish}
                currentStage={activeStage}
                currentStageIndex={activeStageIdx}
              />
            </div>

            {/* Bottom Stage Progress Controller */}
            <div
              className={`p-4 backdrop-blur-md border-t relative z-20 transition-colors ${
                isLight
                  ? "bg-white/90 border-amber-900/15 text-slate-800"
                  : "bg-slate-950/90 border-amber-950/40 text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <p className={`text-[10px] uppercase font-bold tracking-widest ${
                    isLight ? "text-amber-800" : "text-amber-400/90"
                  }`}>
                    Current Chronological Milestone
                  </p>
                  <h3 className={`font-cinzel font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>
                    {activeStage.stageName}
                  </h3>
                </div>

                {/* Prev / Next Stage Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevStage}
                    disabled={activeStageIdx === 0}
                    className={`p-1.5 rounded-lg disabled:opacity-30 disabled:pointer-events-none border transition-all ${
                      isLight
                        ? "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-750"
                    }`}
                    title="Previous Stage"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className={`text-xs font-bold px-1 ${isLight ? "text-amber-900" : "text-amber-300"}`}>
                    {activeStageIdx + 1} / 7
                  </span>
                  <button
                    onClick={handleNextStage}
                    disabled={activeStageIdx === journey.stages.length - 1}
                    className={`p-1.5 rounded-lg disabled:opacity-30 disabled:pointer-events-none border transition-all ${
                      isLight
                        ? "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-750"
                    }`}
                    title="Next Stage"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stage Pills Navigation */}
              <div className="grid grid-cols-7 gap-1">
                {journey.stages.map((stg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStageSelect(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeStageIdx
                        ? "bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                        : idx < activeStageIdx
                        ? isLight
                          ? "bg-amber-300 hover:bg-amber-400"
                          : "bg-amber-700/60 hover:bg-amber-600"
                        : isLight
                        ? "bg-amber-200/50 hover:bg-amber-200"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    title={`Stage ${idx + 1}: ${stg.stageTitle}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: SCROLLABLE CHRONOLOGICAL STORYTELLING (7 cols on lg) ── */}
          <div
            ref={scrollContainerRef}
            className={`lg:col-span-6 xl:col-span-7 overflow-y-auto px-5 sm:px-8 md:px-12 py-8 lg:py-12 space-y-16 scrollbar-thin transition-colors duration-300 ${
              isLight ? "bg-[#faf8f5] text-slate-800" : "text-slate-100"
            }`}
          >
            {/* Editorial Dish Header Hero */}
            <section className={`space-y-5 pb-8 border-b ${isLight ? "border-amber-900/15" : "border-amber-900/25"}`}>
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${
                isLight ? "text-amber-800" : "text-amber-400"
              }`}>
                <Compass className={`w-4 h-4 ${isLight ? "text-amber-700" : "text-amber-500"}`} />
                <span>{journey.region}</span>
                <span>•</span>
                <span className={isLight ? "text-slate-500" : "text-slate-400"}>{currentDish.era}</span>
              </div>

              <h1 className={`font-cinzel font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                {currentDish.name}
              </h1>

              {currentDish.alternateName && (
                <p className={`font-cormorant italic text-lg md:text-xl -mt-2 ${
                  isLight ? "text-amber-800/90" : "text-amber-200/80"
                }`}>
                  Also known as "{currentDish.alternateName}"
                </p>
              )}

              <p className={`font-serif text-base sm:text-lg leading-relaxed max-w-2xl font-normal ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}>
                {journey.culturalIntroduction}
              </p>

              {/* Quick Metrics Bar */}
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <span className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 font-medium ${
                  isLight
                    ? "bg-amber-100/70 text-amber-950 border-amber-300"
                    : "bg-amber-950/40 text-amber-300 border-amber-800/40"
                }`}>
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  {currentDish.tasteProfile}
                </span>
                <span className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 font-medium ${
                  isLight
                    ? "bg-white text-slate-800 border-amber-900/15 shadow-sm"
                    : "bg-slate-900 text-slate-300 border-slate-800"
                }`}>
                  <ChefHat className={`w-3.5 h-3.5 ${isLight ? "text-amber-700" : "text-amber-400"}`} />
                  {currentDish.keyTechnique}
                </span>
                <span className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 font-medium ${
                  isLight
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm"
                    : "bg-slate-900 text-emerald-300 border-slate-800"
                }`}>
                  <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  {currentDish.ingredients.length} Signature Botanicals
                </span>
              </div>
            </section>

            {/* ── THE 7 CHRONOLOGICAL EVOLUTION STAGES ── */}
            <div className="space-y-16">
              {journey.stages.map((stage, idx) => (
                <article
                  key={idx}
                  ref={(el) => {
                    stageRefs.current[idx] = el;
                  }}
                  className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 border ${
                    idx === activeStageIdx
                      ? isLight
                        ? "bg-white border-amber-500/60 shadow-xl ring-1 ring-amber-500/20 text-slate-900"
                        : "bg-slate-900/90 border-amber-500/50 shadow-2xl ring-1 ring-amber-500/20 text-white"
                      : isLight
                        ? "bg-white/70 border-amber-900/10 hover:border-amber-400/40 text-slate-800 shadow-sm"
                        : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                        isLight
                          ? "text-amber-900 bg-amber-100 border-amber-300"
                          : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                      }`}>
                        STAGE {stage.stageNumber} — {stage.era}
                      </span>
                      <h2 className={`font-cinzel font-bold text-xl sm:text-2xl mt-2 leading-snug ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}>
                        {stage.stageName}
                      </h2>
                      <p className={`text-xs font-medium ${isLight ? "text-amber-800" : "text-amber-300/80"}`}>
                        {stage.stageTitle} • {stage.yearRange}
                      </p>
                    </div>

                    <button
                      onClick={() => handleStageSelect(idx)}
                      className={`text-xs px-3 py-1 rounded-xl font-bold transition-all shrink-0 ${
                        idx === activeStageIdx
                          ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                          : isLight
                            ? "bg-amber-100 hover:bg-amber-200 text-amber-950"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {idx === activeStageIdx ? "Active in 3D" : "View in 3D"}
                    </button>
                  </div>

                  <p className={`text-sm sm:text-base leading-relaxed mb-6 font-normal ${
                    isLight ? "text-slate-700" : "text-slate-200"
                  }`}>
                    {stage.narrative}
                  </p>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t ${
                    isLight ? "border-amber-900/10" : "border-slate-800/80"
                  }`}>
                    <div className="space-y-2">
                      <h4 className={`text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                        isLight ? "text-amber-800" : "text-amber-300"
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Key Innovations
                      </h4>
                      <ul className="space-y-1.5">
                        {stage.keyInnovations.map((item, i) => (
                          <li key={i} className={`text-xs flex items-start gap-2 ${
                            isLight ? "text-slate-700" : "text-slate-300"
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className={`text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                        isLight ? "text-emerald-800" : "text-emerald-300"
                      }`}>
                        <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                        Botanical & Utensil Focus
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.botanicalOrMaterialFocus.map((mat, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                              isLight
                                ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                                : "bg-slate-800/80 text-emerald-200/90 border-slate-700/60"
                            }`}
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ── PRACTICAL RECIPE SECTION ── */}
            <section
              className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 transition-colors ${
                isLight
                  ? "bg-white/95 border-amber-900/15 text-slate-800 shadow-amber-950/5"
                  : "bg-slate-900/95 border-amber-600/40 text-white shadow-2xl"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      isLight
                        ? "text-emerald-900 bg-emerald-100 border-emerald-300"
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                    }`}
                  >
                    CULINARY ARCHIVE • TESTED RECONSTRUCTION
                  </span>
                  <h2
                    className={`font-cinzel font-black text-2xl sm:text-3xl mt-2 ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Prepare {currentDish.name}
                  </h2>
                </div>

                <div
                  className={`flex items-center gap-2 p-1.5 rounded-xl border ${
                    isLight
                      ? "bg-amber-100/70 border-amber-300 text-amber-950"
                      : "bg-slate-800 border-slate-700 text-white"
                  }`}
                >
                  <Users
                    className={`w-4 h-4 ml-1.5 ${isLight ? "text-amber-800" : "text-amber-400"}`}
                  />
                  <span
                    className={`text-xs font-bold ${isLight ? "text-amber-950" : "text-white"}`}
                  >
                    {journey.recipe.servings * servingsMultiplier} Servings
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setServingsMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        isLight
                          ? "bg-white hover:bg-amber-200 text-slate-900 shadow-sm"
                          : "bg-slate-700 hover:bg-slate-600 text-white"
                      }`}
                    >
                      -
                    </button>
                    <button
                      onClick={() => setServingsMultiplier((prev) => prev + 0.5)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        isLight
                          ? "bg-white hover:bg-amber-200 text-slate-900 shadow-sm"
                          : "bg-slate-700 hover:bg-slate-600 text-white"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div className="space-y-4">
                <h3
                  className={`font-cinzel font-bold text-base ${
                    isLight ? "text-amber-900" : "text-amber-200"
                  }`}
                >
                  Ingredients Checklist
                </h3>
                {journey.recipe.ingredientsList.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-2">
                    <h4
                      className={`text-xs uppercase font-bold tracking-wider ${
                        isLight ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {cat.category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cat.items.map((item, iIdx) => {
                        const key = `${cIdx}-${iIdx}`;
                        const isChecked = checkedIngredients[key];
                        return (
                          <div
                            key={iIdx}
                            onClick={() => toggleIngredient(key)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                              isChecked
                                ? isLight
                                  ? "bg-emerald-50 border-emerald-300 opacity-60"
                                  : "bg-emerald-950/20 border-emerald-500/40 opacity-70"
                                : isLight
                                ? "bg-amber-50/50 hover:bg-amber-100/60 border-amber-200/60 text-slate-800 shadow-sm"
                                : "bg-slate-850 hover:bg-slate-800 border-slate-750 text-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!!isChecked}
                              onChange={() => {}}
                              className="mt-0.5 accent-amber-500 rounded cursor-pointer"
                            />
                            <div className="text-xs">
                              <span
                                className={`font-semibold ${
                                  isChecked
                                    ? "line-through text-slate-400"
                                    : isLight
                                    ? "text-slate-900"
                                    : "text-white"
                                }`}
                              >
                                {item.name}
                              </span>
                              <span
                                className={`ml-1.5 font-medium ${
                                  isLight ? "text-amber-800" : "text-amber-300"
                                }`}
                              >
                                ({item.quantity})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}

      {/* ── SCHOLARLY SOURCES & CITATIONS MODAL ── */}
      {showSourcesModal && (
        <div
          className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4 ${
            isLight ? "bg-slate-900/40" : "bg-black/80"
          }`}
        >
          <div
            className={`border rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              isLight
                ? "bg-[#faf8f5] border-amber-900/15 text-slate-800"
                : "bg-slate-900 border-amber-600/40 text-slate-100"
            }`}
          >
            <div
              className={`p-5 border-b flex items-center justify-between ${
                isLight ? "bg-amber-50/80 border-amber-900/15" : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className={`w-5 h-5 ${isLight ? "text-amber-700" : "text-amber-400"}`} />
                <div>
                  <h3
                    className={`font-cinzel font-bold text-base ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Historical Sources & Citations
                  </h3>
                  <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Academic references supporting the chronological narrative of {currentDish.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSourcesModal(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isLight
                    ? "bg-amber-100 hover:bg-amber-200 text-slate-700"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin">
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isLight
                    ? "bg-amber-100/70 border-amber-300 text-amber-950"
                    : "bg-amber-950/30 border-amber-700/30 text-amber-200"
                }`}
              >
                <span className={`font-bold ${isLight ? "text-amber-900" : "text-amber-300"}`}>
                  Confidence Summary:{" "}
                </span>
                {journey.confidenceSummary}
              </div>

              {journey.citations.map((cite, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    isLight
                      ? "bg-white border-amber-900/15 text-slate-800 shadow-sm"
                      : "bg-black/40 border-slate-800 text-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4
                        className={`font-bold text-sm ${
                          isLight ? "text-slate-900" : "text-white"
                        }`}
                      >
                        {cite.authorOrSource}
                      </h4>
                      <p
                        className={`font-serif italic text-xs ${
                          isLight ? "text-amber-800" : "text-amber-300"
                        }`}
                      >
                        {cite.workTitle} ({cite.publicationYearOrPeriod})
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        isLight
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {cite.confidenceRating}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    "{cite.quoteOrFinding}"
                  </p>

                  <div
                    className={`text-[10px] pt-1 border-t ${
                      isLight
                        ? "text-slate-500 border-amber-900/10"
                        : "text-slate-500 border-slate-800/60"
                    }`}
                  >
                    Location: {cite.citationDetails}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`p-4 border-t flex justify-end ${
                isLight ? "bg-amber-50/60 border-amber-900/15" : "bg-slate-950/80 border-slate-800"
              }`}
            >
              <button
                onClick={() => setShowSourcesModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                Close Sources
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ALL 66 DISHES SWITCHER DRAWER ── */}
      {showDishSwitcher && (
        <div
          className={`fixed inset-0 z-50 backdrop-blur-md flex justify-end animate-in fade-in duration-200 ${
            isLight ? "bg-slate-900/40" : "bg-black/80"
          }`}
        >
          <div
            className={`border-l w-full max-w-md h-full flex flex-col shadow-2xl ${
              isLight
                ? "bg-[#faf8f5] border-amber-900/20 text-slate-900"
                : "bg-slate-900 border-amber-700/40 text-slate-100"
            }`}
          >
            <div
              className={`p-5 border-b flex items-center justify-between ${
                isLight ? "bg-amber-50/90 border-amber-900/15" : "bg-slate-950/80 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className={`w-5 h-5 ${isLight ? "text-amber-700" : "text-amber-400"}`} />
                <div>
                  <h3
                    className={`font-cinzel font-bold text-base ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Signature Culinary Archive
                  </h3>
                  <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    66 Iconic Dishes across 33 Indian Regions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDishSwitcher(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isLight
                    ? "bg-amber-100 hover:bg-amber-200 text-slate-700"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Quick Pilot Jump Banner */}
            <div
              className={`p-4 border-b space-y-2 ${
                isLight
                  ? "bg-amber-100/60 border-amber-300/60"
                  : "bg-amber-950/30 border-amber-800/30"
              }`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider ${
                  isLight ? "text-amber-900" : "text-amber-400"
                }`}
              >
                Contrasting Flagship Pilots:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectDish("masala-dosa");
                    setShowDishSwitcher(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    dishId === "masala-dosa"
                      ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm"
                      : isLight
                      ? "bg-white hover:bg-amber-50 text-slate-800 border-amber-900/15 shadow-sm"
                      : "bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold">Masala Dosa</div>
                  <div
                    className={`text-[10px] ${isLight ? "text-slate-500" : "opacity-80"}`}
                  >
                    Karnataka • Fermented Grain
                  </div>
                </button>
                <button
                  onClick={() => {
                    onSelectDish("hyderabadi-biryani");
                    setShowDishSwitcher(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    dishId === "hyderabadi-biryani"
                      ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm"
                      : isLight
                      ? "bg-white hover:bg-amber-50 text-slate-800 border-amber-900/15 shadow-sm"
                      : "bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold">Dum Biryani</div>
                  <div
                    className={`text-[10px] ${isLight ? "text-slate-500" : "opacity-80"}`}
                  >
                    Telangana • Royal Handi
                  </div>
                </button>
              </div>
            </div>

            {/* Dishes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
              {allDishes.map((d) => {
                const isSelected = d.id === dishId;
                const state = getStateByDishId(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDish(d.id);
                      setShowDishSwitcher(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? isLight
                          ? "bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-sm"
                          : "bg-amber-500/20 border-amber-400/80 text-white"
                        : isLight
                        ? "bg-white hover:bg-amber-50/70 border-amber-900/10 text-slate-800 shadow-sm"
                        : "bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-xs ${
                            isLight ? "text-slate-900" : "text-white"
                          }`}
                        >
                          {d.name}
                        </span>
                        {d.hasPilot3D && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                              isLight
                                ? "bg-amber-200 text-amber-950"
                                : "bg-amber-500/30 text-amber-300"
                            }`}
                          >
                            3D PILOT
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isLight ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {state} • {d.tasteProfile}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
