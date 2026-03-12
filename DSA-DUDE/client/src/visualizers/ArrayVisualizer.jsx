import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, Code2, PlayCircle } from "lucide-react";

const forceArray = (item) => {
    if (Array.isArray(item)) return item;
    if (item && typeof item === 'object') return Object.values(item);
    return [];
};

export default function ArrayVisualizer({ trace }) {
    const [stepIdx, setStepIdx] = useState(0);
    const steps = trace.steps || [];
    const currentStep = steps[stepIdx] || {};
    const { state = {}, explanation = "", lineNumber, codeSnippet, variables = {}, highlight = [] } = currentStep;
    const codeLines = trace.meta?.codeLines || [];

    const activeI = state.i !== undefined ? state.i : -1;
    const activeJ = state.j !== undefined ? state.j : -1;

    useEffect(() => {
        setStepIdx(0);
    }, [trace]);

    const displayArray = forceArray(state.resultState || trace.input);

    const nextStep = () => setStepIdx(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setStepIdx(prev => Math.max(0, prev - 1));

    // Get all variable values for display
    const allVariables = {
        ...(state.i !== undefined && { i: state.i }),
        ...(state.j !== undefined && { j: state.j }),
        ...(state.currentValue !== undefined && { currentValue: state.currentValue }),
        ...variables
    };

    return (
        <div className="space-y-6">
            {/* Code Display with Highlighting */}
            {codeLines.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Code2 className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Code Execution</span>
                    </div>
                    <div className="font-mono text-sm space-y-1">
                        {codeLines.map((line, idx) => {
                            const lineNum = idx + 1;
                            const isActive = lineNumber === lineNum;
                            const displayLine = line.trim() || '\u00A0'; // Non-breaking space for empty lines
                            
                            return (
                                <motion.div
                                    key={idx}
                                    initial={false}
                                    animate={{
                                        backgroundColor: isActive ? "rgba(249, 115, 22, 0.2)" : "transparent",
                                        borderLeftColor: isActive ? "#f97316" : "transparent"
                                    }}
                                    className={`px-3 py-1 rounded flex items-start gap-3 border-l-2 transition-all ${
                                        isActive ? "border-l-orange-500" : ""
                                    }`}
                                >
                                    <span className={`text-xs font-bold shrink-0 w-8 text-right ${
                                        isActive ? "text-orange-400" : "text-gray-600"
                                    }`}>
                                        {lineNum}
                                    </span>
                                    <span className={`flex-1 ${
                                        isActive ? "text-orange-300" : "text-gray-400"
                                    }`}>
                                        {displayLine}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="shrink-0"
                                        >
                                            <PlayCircle className="w-4 h-4 text-orange-500" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Variables Panel */}
            {Object.keys(allVariables).length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-white/10 rounded-xl p-4"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Variables</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(allVariables).map(([key, value]) => {
                            const isHighlighted = highlight.includes(key);
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ 
                                        scale: isHighlighted ? 1.05 : 1, 
                                        opacity: 1 
                                    }}
                                    className={`px-4 py-2 rounded-lg border-2 font-mono text-sm ${
                                        isHighlighted 
                                            ? "bg-orange-500/20 border-orange-500/50 text-orange-300" 
                                            : "bg-white/5 border-white/10 text-gray-300"
                                    }`}
                                >
                                    <span className="text-gray-500 text-xs">{key}:</span>{" "}
                                    <span className="font-bold">{String(value)}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Array Display */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Array Visualization</span>
                </div>
                <div className="flex flex-wrap gap-3 justify-center py-4">
                    <AnimatePresence mode="popLayout">
                        {displayArray && displayArray.length > 0 ? displayArray.map((val, idx) => {
                            const isI = idx === activeI;
                            const isJ = idx === activeJ;
                            const isHighlighted = isI || isJ;

                            return (
                                <motion.div
                                    key={`${idx}-${val}`}
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: isHighlighted ? 1.15 : 1,
                                        opacity: 1,
                                        backgroundColor: isI ? "#f97316" : isJ ? "#3b82f6" : "#171717",
                                        borderColor: isHighlighted ? (isI ? "#f97316" : "#3b82f6") : "#262626",
                                        boxShadow: isHighlighted ? `0 0 20px ${isI ? 'rgba(249, 115, 22, 0.5)' : 'rgba(59, 130, 246, 0.5)'}` : "none"
                                    }}
                                    className="w-16 h-16 flex flex-col items-center justify-center border-2 rounded-xl font-mono font-bold relative group transition-all"
                                >
                                    <span className="text-white text-lg">{val}</span>
                                    <span className="text-[10px] text-gray-500 absolute -bottom-6 font-mono">
                                        [{idx}]
                                    </span>
                                    {isHighlighted && (
                                        <motion.div
                                            initial={{ y: 5, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="absolute -top-7 text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-black/80 border-2 backdrop-blur-sm"
                                            style={{ 
                                                color: isI ? "#f97316" : "#3b82f6",
                                                borderColor: isI ? "#f97316" : "#3b82f6"
                                            }}
                                        >
                                            {isI ? "i" : "j"}
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        }) : (
                            <div className="text-gray-500 text-sm">No array to display</div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Explanation Card */}
            <motion.div
                key={stepIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-orange-500/10 to-blue-500/10 border-2 border-orange-500/20 p-6 rounded-2xl"
            >
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-orange-500/20 rounded-xl shrink-0">
                        <Info className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                                Step {stepIdx + 1} of {steps.length}
                            </span>
                            {lineNumber && (
                                <span className="text-xs font-mono text-gray-500">
                                    Line {lineNumber}
                                </span>
                            )}
                        </div>
                        {codeSnippet && (
                            <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/10 mb-2">
                                <code className="text-xs text-orange-300 font-mono">{codeSnippet}</code>
                            </div>
                        )}
                        <p className="text-gray-100 leading-relaxed text-sm">
                            {explanation || "Processing step..."}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 pt-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStepIdx(0)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                    Reset
                </motion.button>

                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevStep}
                        disabled={stepIdx === 0}
                        className="p-3 bg-white/5 border border-white/10 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <div className="flex gap-1.5">
                        {steps.map((_, i) => (
                            <motion.div
                                key={i}
                                initial={false}
                                animate={{
                                    width: i === stepIdx ? "1rem" : "0.375rem",
                                    backgroundColor: i === stepIdx ? "#f97316" : "rgba(255, 255, 255, 0.1)"
                                }}
                                className="h-1.5 rounded-full transition-all duration-300"
                            />
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextStep}
                        disabled={stepIdx === steps.length - 1}
                        className="p-3 bg-white/5 border border-white/10 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all text-orange-500"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>
                </div>

                <div className="text-xs font-mono text-gray-600 capitalize">
                    {trace.meta?.problemType || "Visualization"}
                </div>
            </div>
        </div>
    );
}