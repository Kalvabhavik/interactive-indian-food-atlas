import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Flame,
  ChefHat,
  Clock,
  Scroll,
  ArrowDown,
  Compass,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { GenerationWaypoint, getGenerationsForDish } from "../data/generationRecipesData";
import { Skiper6Summarizer, GenerationSummaryMember } from "./ui/skiper6";
import { useTheme } from "../context/ThemeContext";

// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

interface GsapMotionPathTimelineProps {
  dishId: string;
  dishName: string;
  onSelectWaypoint?: (waypoint: GenerationWaypoint) => void;
}

export const GsapMotionPathTimeline: React.FC<GsapMotionPathTimelineProps> = ({
  dishId,
  dishName,
  onSelectWaypoint,
}) => {
  const { isLight } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const travelerRef = useRef<SVGCircleElement>(null);
  const waypoints = getGenerationsForDish(dishId);

  const [activeWaypointIdx, setActiveWaypointIdx] = useState<number>(0);
  const waypointRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Setup GSAP MotionPath scroll animation
  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const traveler = travelerRef.current;

    if (!container || !path || !traveler) return;

    // Create GSAP ScrollTrigger timeline moving the traveler along the SVG path
    const ctx = gsap.context(() => {
      gsap.to(traveler, {
        scrollTrigger: {
          trigger: container,
          start: "top 30%",
          end: "bottom 80%",
          scrub: 0.6,
          onUpdate: (self) => {
            const progress = self.progress;
            const currentIdx = Math.min(
              waypoints.length - 1,
              Math.floor(progress * waypoints.length)
            );
            setActiveWaypointIdx(currentIdx);
          },
        },
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: "none",
      });

      // Animate waypoint nodes as they enter viewport
      waypointRefs.current.forEach((el, idx) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0.35, y: 30, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, [waypoints.length]);

  // Convert waypoints into Skiper6 summarizer format
  const skiper6Members: GenerationSummaryMember[] = waypoints.map((w) => ({
    id: `gen-${w.generationNumber}`,
    name: w.eraTitle,
    roleOrEra: w.centuryLabel,
    yearPeriod: w.yearRange,
    image: w.image,
    summary: w.shortDescription,
    keyContribution: w.technologicalLeap,
    signatureIngredient: w.generationRecipe.ingredientsList[0] || "Ancient Grain",
    primarySource: w.documentedCitation,
  }));

  const scrollToWaypoint = (idx: number) => {
    setActiveWaypointIdx(idx);
    const target = waypointRefs.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full py-12 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden transition-colors duration-300 ${
        isLight ? "bg-[#f8f5ee] text-slate-800" : "bg-[#08090e] text-slate-100"
      }`}
    >
      {/* ── SECTION HEADER ── */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${
          isLight ? "bg-amber-100 text-amber-900 border-amber-300 shadow-sm" : "bg-amber-500/10 border-amber-500/30 text-amber-300"
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>GSAP MotionPath • Chronological Waypoints</span>
        </div>

        <h2 className={`font-cinzel font-black text-3xl sm:text-4xl md:text-5xl tracking-tight ${
          isLight ? "text-slate-900" : "text-white"
        }`}>
          The Living Evolution of {dishName}
        </h2>

        <p className={`font-cormorant italic text-lg sm:text-xl max-w-2xl mx-auto ${
          isLight ? "text-amber-900/90" : "text-amber-200/90"
        }`}>
          Scroll through time as an animated particle tracks through centuries of culinary metamorphosis — discover exact historical recipes, cookware, and breakthrough ingredients at each era.
        </p>

        {/* Quick Waypoint Navigation Bar */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {waypoints.map((w, idx) => (
            <button
              key={idx}
              onClick={() => scrollToWaypoint(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                idx === activeWaypointIdx
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold scale-105"
                  : isLight
                    ? "bg-white/80 text-slate-700 border-amber-900/15 hover:bg-white hover:text-amber-900 shadow-sm"
                    : "bg-slate-900/80 text-slate-300 border-slate-750 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{w.centuryLabel}</span>
              <span className="opacity-70 text-[10px]">({w.yearRange})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── THE MOTIONPATH WAYPOINTS ROUTE CONTAINER ── */}
      <div className="relative max-w-6xl mx-auto">
        {/* Continuous SVG MotionPath in the Background */}
        <svg
          className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 h-full pointer-events-none z-10 hidden sm:block"
          viewBox="0 0 100 2400"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Subtle Ambient Track */}
          <path
            d="M 50 0 C 15 200, 85 400, 50 600 C 15 800, 85 1000, 50 1200 C 15 1400, 85 1600, 50 1800 C 15 2000, 85 2200, 50 2400"
            stroke={isLight ? "rgba(180, 83, 9, 0.25)" : "rgba(217, 119, 6, 0.2)"}
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Active MotionPath Track */}
          <path
            ref={pathRef}
            d="M 50 0 C 15 200, 85 400, 50 600 C 15 800, 85 1000, 50 1200 C 15 1400, 85 1600, 50 1800 C 15 2000, 85 2200, 50 2400"
            stroke="url(#motionGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Glowing Traveler Spark (Animated along path by GSAP) */}
          <circle
            ref={travelerRef}
            r="7"
            fill="#fbbf24"
            filter="url(#glowFilter)"
          />

          {/* Gradients and Filters */}
          <defs>
            <linearGradient id="motionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* ── THE WAYPOINT MILESTONE CARDS (GENERATIONS) ── */}
        <div className="space-y-24 relative z-20">
          {waypoints.map((waypoint, idx) => {
            const isEven = idx % 2 === 0;
            const isActive = activeWaypointIdx === idx;

            return (
              <div
                key={waypoint.generationNumber}
                ref={(el) => {
                  waypointRefs.current[idx] = el;
                }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-300 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* ── COLUMN 1: EXACT HIGH-RES PHOTO CARD (5 cols) ── */}
                <div
                  className={`lg:col-span-5 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className={`relative rounded-3xl overflow-hidden border shadow-2xl group aspect-[16/10] ${
                    isLight ? "border-amber-900/15 bg-slate-100 shadow-amber-950/10" : "border-amber-500/40 bg-slate-950"
                  }`}>
                    <img
                      src={waypoint.image}
                      alt={waypoint.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Waypoint Pill on Image */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/95 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                        {waypoint.centuryLabel}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 text-[10px] font-semibold border border-amber-500/30">
                        {waypoint.yearRange}
                      </span>
                    </div>

                    {/* Technological Leap Tag on Image Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        Historic Breakthrough:
                      </p>
                      <p className="text-xs font-semibold text-white drop-shadow-md">
                        {waypoint.technologicalLeap}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── CENTER WAYPOINT MARKER (Desktop Node) ── */}
                <div className="hidden lg:flex lg:col-span-2 justify-center items-center lg:order-2">
                  <div
                    onClick={() => scrollToWaypoint(idx)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-cinzel font-black text-sm cursor-pointer transition-all duration-300 shadow-xl border ${
                      isActive
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 border-white scale-110 shadow-amber-500/50"
                        : isLight
                          ? "bg-white text-amber-900 border-amber-900/15 hover:scale-105 shadow-md"
                          : "bg-slate-900 text-amber-300 border-amber-700/40 hover:scale-105"
                    }`}
                  >
                    0{waypoint.generationNumber}
                  </div>
                </div>

                {/* ── COLUMN 2: THE GENERATION RECIPE & SHORT DESCRIPTION (5 cols) ── */}
                <div
                  className={`lg:col-span-5 ${
                    isEven ? "lg:order-3" : "lg:order-1"
                  } space-y-4`}
                >
                  {/* Waypoint Header */}
                  <div>
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1 ${
                      isLight ? "text-amber-800" : "text-amber-400"
                    }`}>
                      <Compass className="w-3.5 h-3.5" />
                      <span>{waypoint.eraTitle}</span>
                      <span>•</span>
                      <span className={isLight ? "text-slate-500" : "text-slate-400"}>{waypoint.yearRange}</span>
                    </div>

                    <h3 className={`font-cinzel font-bold text-2xl sm:text-3xl leading-tight ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}>
                      {waypoint.headline}
                    </h3>
                  </div>

                  {/* Short Historical Description */}
                  <p className={`text-sm leading-relaxed ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    {waypoint.shortDescription}
                  </p>

                  {/* ── THE GENERATION RECIPE BOX ── */}
                  <div className={`p-4 sm:p-5 rounded-2xl border shadow-xl space-y-3 ${
                    isLight
                      ? "bg-white/95 border-amber-900/15 text-slate-800 shadow-amber-950/5"
                      : "bg-slate-900/90 border-amber-500/30 text-slate-100"
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2 ${
                      isLight ? "border-amber-900/10" : "border-slate-800"
                    }`}>
                      <div className="flex items-center gap-2">
                        <ChefHat className={`w-4 h-4 ${isLight ? "text-amber-700" : "text-amber-400"}`} />
                        <h4 className={`font-cinzel font-bold text-xs sm:text-sm ${
                          isLight ? "text-amber-900" : "text-amber-200"
                        }`}>
                          {waypoint.generationRecipe.recipeName}
                        </h4>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        isLight
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                      }`}>
                        Era Formulation
                      </span>
                    </div>

                    {/* Cookware & Heat */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className={`p-2 rounded-xl border ${
                        isLight ? "bg-amber-50/70 border-amber-200/70" : "bg-black/40 border-slate-800"
                      }`}>
                        <span className={`text-[10px] uppercase font-bold block ${
                          isLight ? "text-amber-900/70" : "text-slate-400"
                        }`}>
                          Cookware:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? "text-slate-900" : "text-white"}`}>
                          {waypoint.generationRecipe.historicalCookware}
                        </span>
                      </div>
                      <div className={`p-2 rounded-xl border ${
                        isLight ? "bg-amber-50/70 border-amber-200/70" : "bg-black/40 border-slate-800"
                      }`}>
                        <span className={`text-[10px] uppercase font-bold block ${
                          isLight ? "text-amber-900/70" : "text-slate-400"
                        }`}>
                          Heat Source:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? "text-orange-700" : "text-orange-300"}`}>
                          {waypoint.generationRecipe.heatSource}
                        </span>
                      </div>
                    </div>

                    {/* Ingredients Available at that Century */}
                    <div className="space-y-1">
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                        isLight ? "text-amber-900/80" : "text-slate-400"
                      }`}>
                        Ingredients Known in this Epoch:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {waypoint.generationRecipe.ingredientsList.map((ing, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                              isLight
                                ? "bg-amber-100/70 text-amber-950 border-amber-300/70"
                                : "bg-slate-800 text-amber-100 border-slate-700"
                            }`}
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preparation Method */}
                    <div className={`pt-2 text-xs leading-relaxed border-t ${
                      isLight ? "text-slate-700 border-amber-900/10" : "text-slate-300 border-slate-800/80"
                    }`}>
                      <strong className={isLight ? "text-amber-900" : "text-amber-300"}>Method: </strong>
                      {waypoint.generationRecipe.preparationMethod}
                    </div>

                    {/* Contemporary Contrast */}
                    <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                      isLight
                        ? "bg-amber-100/60 border-amber-300/80 text-amber-950"
                        : "bg-amber-950/20 border-amber-800/30 text-amber-200/90"
                    }`}>
                      <strong className={isLight ? "text-amber-900" : "text-amber-400"}>Era Contrast: </strong>
                      {waypoint.generationRecipe.contemporaryDifference}
                    </div>
                  </div>

                  {/* Scholarly Citation Link */}
                  <div className={`flex items-center gap-2 text-[11px] pt-1 ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}>
                    <Scroll className={`w-3.5 h-3.5 ${isLight ? "text-amber-700" : "text-amber-400"}`} />
                    <span>Documented in: </span>
                    <span className={isLight ? "text-slate-900 font-semibold" : "text-slate-300 italic"}>
                      {waypoint.documentedCitation}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AT LAST: SKIPER-UI / SKIPER6 DETAILED GENERATION SUMMARIZER ── */}
      <div className="max-w-6xl mx-auto mt-28">
        <Skiper6Summarizer
          title={`Chronological Epoch Summarizer: ${dishName}`}
          subtitle={`Interactive summary matrix powered by @skiper-ui/skiper6 — hover through the 6 historical epochs to inspect breakthroughs, primary sources, and master innovations.`}
          members={skiper6Members}
        />
      </div>
    </div>
  );
};
