import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, BookOpen, ChefHat, ArrowUpRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export interface GenerationSummaryMember {
  id: string;
  name: string;
  roleOrEra: string;
  yearPeriod: string;
  image: string;
  summary: string;
  keyContribution: string;
  signatureIngredient: string;
  primarySource: string;
}

interface Skiper6Props {
  title?: string;
  subtitle?: string;
  members: GenerationSummaryMember[];
  onSelectMember?: (member: GenerationSummaryMember) => void;
}

/**
 * Skiper6 / HoverMember Component
 * Reusable motion-focused interactive card summarizer inspired by @skiper-ui/skiper6
 * Displays generation milestones and culinary figures with dynamic hover reveal.
 */
export const Skiper6Summarizer: React.FC<Skiper6Props> = ({
  title = "Chronological Generation Summarizer",
  subtitle = "Hover over each historical era to inspect its culinary breakthroughs and master chroniclers",
  members,
  onSelectMember,
}) => {
  const { isLight } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const activeMember = hoveredIndex !== null ? members[hoveredIndex] : members[0];

  return (
    <div
      className={`w-full rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
        isLight
          ? "bg-gradient-to-b from-[#fdfbf7] via-[#f7f2e8] to-[#f2ece0] border border-amber-900/15 text-slate-800 shadow-amber-950/5"
          : "bg-gradient-to-b from-slate-900 via-[#0c0e16] to-[#08090f] border border-amber-500/30 text-slate-100"
      }`}
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isLight ? "bg-amber-400/15" : "bg-amber-500/10"
        }`}
      />
      <div
        className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isLight ? "bg-orange-400/15" : "bg-orange-600/10"
        }`}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-amber-900/20 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30 w-fit mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>@skiper-ui/skiper6 • Heritage Matrix</span>
          </div>
          <h3 className={`font-cinzel font-black text-2xl md:text-3xl tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            {title}
          </h3>
          <p className={`text-xs md:text-sm mt-1 max-w-xl ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {subtitle}
          </p>
        </div>

        <div className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border w-fit ${
          isLight
            ? "text-amber-900 bg-amber-100/90 border-amber-300/70 shadow-sm"
            : "text-amber-300/80 bg-slate-900/80 border-slate-700/60"
        }`}>
          {members.length} Historical Epochs Mapped
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 relative z-10">
        {/* Left Column: Interactive Hover List (skiper6 item list) */}
        <div className="lg:col-span-7 space-y-2.5">
          {members.map((member, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <motion.div
                key={member.id || idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => onSelectMember?.(member)}
                className={`group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between relative overflow-hidden ${
                  isHovered
                    ? isLight
                      ? "bg-white border-amber-500/70 shadow-lg text-slate-900"
                      : "bg-slate-800/90 border-amber-500/60 shadow-xl text-white"
                    : isLight
                      ? "bg-white/70 border-amber-900/10 hover:bg-white hover:border-amber-400/50 text-slate-800"
                      : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-100"
                }`}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Active Indicator Bar */}
                {isHovered && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Left: Avatar Thumbnail & Name */}
                <div className="flex items-center gap-3.5 pl-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 shrink-0 relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-sm md:text-base transition-colors ${
                        isLight
                          ? "text-slate-900 group-hover:text-amber-800"
                          : "text-white group-hover:text-amber-200"
                      }`}>
                        {member.name}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${
                        isLight
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                      }`}>
                        {member.yearPeriod}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      {member.roleOrEra}
                    </p>
                  </div>
                </div>

                {/* Right: Icon / Expand */}
                <div className="flex items-center gap-2">
                  <span className={`hidden sm:inline text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity ${
                    isLight ? "text-amber-700" : "text-amber-400"
                  }`}>
                    Inspect Summary
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isHovered
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : isLight
                          ? "bg-amber-100/90 text-amber-800 group-hover:bg-amber-200"
                          : "bg-slate-800 text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Deep-Dive Inspection Card (Reveals on Hover) */}
        <div className="lg:col-span-5 flex flex-col">
          <AnimatePresence mode="wait">
            {activeMember && (
              <motion.div
                key={activeMember.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`flex-1 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden border ${
                  isLight
                    ? "bg-white/95 border-amber-900/15 text-slate-800 shadow-amber-950/10"
                    : "bg-slate-850/90 border-amber-500/40 text-slate-200"
                }`}
              >
                {/* Big Featured Image */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-700/80 mb-5 shadow-lg">
                  <img
                    src={activeMember.image}
                    alt={activeMember.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-cinzel font-bold text-white text-sm">
                      {activeMember.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                      {activeMember.yearPeriod}
                    </span>
                  </div>
                </div>

                {/* Summary Narrative */}
                <div className="space-y-3.5 flex-1">
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${
                      isLight ? "text-amber-800" : "text-amber-400"
                    }`}>
                      Epoch Synthesis:
                    </span>
                    <p className={`text-xs leading-relaxed font-normal ${
                      isLight ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {activeMember.summary}
                    </p>
                  </div>

                  {/* Key Breakthrough */}
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isLight ? "bg-amber-50/80 border-amber-200/70" : "bg-black/40 border-slate-800"
                  }`}>
                    <div className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider ${
                      isLight ? "text-emerald-700" : "text-emerald-400"
                    }`}>
                      <ChefHat className="w-3.5 h-3.5" />
                      Key Culinary Transformation:
                    </div>
                    <p className={`text-xs ${isLight ? "text-slate-800" : "text-slate-300"}`}>
                      {activeMember.keyContribution}
                    </p>
                  </div>

                  {/* Signature Ingredient & Source */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className={`p-2.5 rounded-xl border ${
                      isLight ? "bg-amber-50/60 border-amber-200/60" : "bg-slate-900 border-slate-800"
                    }`}>
                      <span className={`text-[10px] font-bold block uppercase ${
                        isLight ? "text-amber-800/80" : "text-slate-400"
                      }`}>
                        Core Ingredient:
                      </span>
                      <span className={`font-semibold text-xs truncate block ${
                        isLight ? "text-amber-900" : "text-amber-300"
                      }`}>
                        {activeMember.signatureIngredient}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border ${
                      isLight ? "bg-amber-50/60 border-amber-200/60" : "bg-slate-900 border-slate-800"
                    }`}>
                      <span className={`text-[10px] font-bold block uppercase ${
                        isLight ? "text-amber-800/80" : "text-slate-400"
                      }`}>
                        Primary Source:
                      </span>
                      <span className={`font-serif italic text-xs truncate block ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}>
                        {activeMember.primarySource}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Export alias matching standard skiper-ui convention
export const HoverMember = Skiper6Summarizer;
