'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTokenStore } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import ThemeInjector from '@/components/builder/ThemeInjector';
import LivePreview from '@/components/builder/LivePreview';
import ScaleVisualizer from '@/components/builder/ScaleVisualizer';
import { Check, RefreshCw, Star } from 'lucide-react';
import { clsx } from 'clsx';
import * as RadixColors from '@radix-ui/colors';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Radix Color Lists (Categorized for UI)
const BRAND_COLORS = [
    'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple', 'violet',
    'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade', 'green', 'grass', 'orange', 'amber', 'yellow', 'lime', 'mint', 'sky'
];

const NEUTRAL_COLORS = [
    { name: 'gray', desc: 'Pure gray' },
    { name: 'mauve', desc: 'Warm, rosy gray' },
    { name: 'slate', desc: 'Cool, bluish gray' },
    { name: 'sage', desc: 'Greenish gray' },
    { name: 'olive', desc: 'Yellowish gray' },
    { name: 'sand', desc: 'Warm, yellowish gray' },
];

// Mapping: Brand Color -> Recommended Neutrals
const RECOMMENDATIONS: Record<string, string[]> = {
    // Cool / Blue-ish -> Slate
    'iris': ['slate', 'mauve'], 'indigo': ['slate'], 'blue': ['slate'], 'sky': ['slate', 'gray'], 'cyan': ['slate', 'gray'], 'teal': ['sage', 'slate'],
    // Warm / Red-ish -> Mauve
    'tomato': ['mauve', 'gray'], 'red': ['mauve', 'sand'], 'ruby': ['mauve'], 'crimson': ['mauve'], 'pink': ['mauve'], 'plum': ['mauve'], 'purple': ['mauve'], 'violet': ['mauve'],
    // Nature / Green-ish -> Sage, Olive
    'jade': ['sage'], 'green': ['sage'], 'grass': ['sage', 'olive'], 'mint': ['sage'],
    // Warm / Yellow-ish -> Sand, Olive
    'orange': ['sand'], 'amber': ['sand'], 'yellow': ['sand', 'olive'], 'lime': ['olive', 'sand'],
};

export default function BuilderPage() {
    const { tokens, addToken, getTokensByType, removeToken } = useTokenStore();
    const { selectItem } = useBuilderStore();

    // Semantic Color Options
    const SEMANTIC_OPTIONS = {
        success: ['green', 'teal', 'grass', 'mint'],
        error: ['red', 'tomato', 'ruby', 'crimson'],
        warning: ['amber', 'yellow', 'orange'],
        info: ['blue', 'sky', 'cyan', 'indigo']
    };

    // Selection State
    const [selectedBrand, setSelectedBrand] = useState('indigo');
    const [selectedNeutral, setSelectedNeutral] = useState('slate');

    // Semantic State
    const [selectedSuccess, setSelectedSuccess] = useState('green');
    const [selectedError, setSelectedError] = useState('red');
    const [selectedWarning, setSelectedWarning] = useState('amber');
    const [selectedInfo, setSelectedInfo] = useState('blue');

    // Get the actual scale objects from Radix package
    const brandScale = (RadixColors as any)[selectedBrand];
    const neutralScale = (RadixColors as any)[selectedNeutral];

    // Derived state: Get recommended neutrals for current brand
    const recommendedNeutrals = RECOMMENDATIONS[selectedBrand] || ['gray'];

    // Automatically select the best match neutral when brand changes
    useEffect(() => {
        if (recommendedNeutrals.length > 0) setSelectedNeutral(recommendedNeutrals[0]);
    }, [selectedBrand, recommendedNeutrals]);

    // Sort neutrals: Recommended first, then others
    const sortedNeutrals = useMemo(() => {
        return [...NEUTRAL_COLORS].sort((a, b) => {
            const indexA = recommendedNeutrals.indexOf(a.name);
            const indexB = recommendedNeutrals.indexOf(b.name);

            // Both are recommended: Sort by priority (index in recommendations)
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;

            // Only A is recommended: A comes first
            if (indexA !== -1) return -1;

            // Only B is recommended: B comes first
            if (indexB !== -1) return 1;

            // Neither recommended: Maintain original order
            return 0;
        });
    }, [selectedBrand, recommendedNeutrals]);

    // Generate preview tokens for LivePreview (Instant feedback)
    const previewTokens = useMemo(() => {
        const tokens: any[] = [];

        // Brand
        Object.values(brandScale).forEach((value: any, index) => {
            tokens.push({ name: `Primary ${index + 1}`, value, type: 'color' });
        });

        // Neutral
        Object.values(neutralScale).forEach((value: any, index) => {
            tokens.push({ name: `Neutral ${index + 1}`, value, type: 'color' });
        });

        // Semantics (Configurable)
        const semantics = [
            { name: 'Success', scale: (RadixColors as any)[selectedSuccess] },
            { name: 'Error', scale: (RadixColors as any)[selectedError] },
            { name: 'Warning', scale: (RadixColors as any)[selectedWarning] },
            { name: 'Info', scale: (RadixColors as any)[selectedInfo] },
        ];
        semantics.forEach(sem => {
            Object.values(sem.scale).forEach((val: any, idx) => {
                tokens.push({ name: `${sem.name} ${idx + 1}`, value: val, type: 'color' });
            });
        });

        // Contrast Logic for Light Brands
        const LIGHT_BRANDS = ['amber', 'yellow', 'lime', 'mint', 'sky'];
        const isLight = LIGHT_BRANDS.includes(selectedBrand);
        tokens.push({
            name: 'Primary Foreground',
            value: isLight ? '#1a1a1a' : '#ffffff', // Using slightly off-black for better aesthetic
            type: 'color'
        });

        return tokens;
    }, [brandScale, neutralScale, selectedSuccess, selectedError, selectedWarning, selectedInfo]);

    // Auto-save: Automatically apply theme to system when tokens change
    useEffect(() => {
        const timer = setTimeout(() => {
            // 1. Clear existing color tokens
            const existingIds = getTokensByType('color').map(t => t.id);
            existingIds.forEach(id => removeToken(id));

            // 2. Add All Preview Tokens
            previewTokens.forEach(t => {
                addToken({ ...t, id: generateId() });
            });
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [previewTokens, getTokensByType, removeToken, addToken]);

    return (
        <div className="pb-20">
            {/* Page Header */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900">시스템 컬러 설계</h2>
                <p className="text-gray-500 mt-1">
                    Radix UI 시스템을 기반으로 완벽한 조화를 이루는 컬러 팔레트를 선택하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-7 space-y-10">

                    {/* 1. Brand Color Selection */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-10">
                        <h3 className="text-lg font-bold text-gray-900">
                            Brand
                        </h3>
                        <div className="grid grid-cols-6 sm:grid-cols-11 gap-y-4 gap-x-2">
                            {BRAND_COLORS.map(color => {
                                const scale = (RadixColors as any)[color];
                                const mainColor = Object.values(scale)[8] as string; // Step 9
                                const isSelected = selectedBrand === color;

                                return (
                                    <div key={color} className="flex flex-col items-center gap-1.5">
                                        <motion.button
                                            onClick={() => setSelectedBrand(color)}
                                            // Remove Tailwind transition/rounded classes to let Motion handle it
                                            className="w-full aspect-square relative group border-transparent"
                                            initial={false}
                                            animate={{
                                                borderRadius: isSelected ? "16px" : "9999px",
                                                scale: isSelected ? 1.1 : 1
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{
                                                // Material Design 3 Emphasized easing
                                                duration: 0.8,
                                                ease: [0.2, 0.0, 0.0, 1.0]
                                            }}
                                            style={{ backgroundColor: mainColor }}
                                            title={color}
                                        >
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.span
                                                        className="absolute inset-0 flex items-center justify-center"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{
                                                            duration: 0.8,
                                                            ease: [0.2, 0.0, 0.0, 1.0]
                                                        }}
                                                    >
                                                        <Check className="w-4 h-4 text-white" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                        <span className={`text-xs font-medium capitalize transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {color}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <ScaleVisualizer scale={brandScale} colorName="Primary" />
                    </section>

                    {/* 2. Neutral Color Selection */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-10">
                        <h3 className="text-lg font-bold text-gray-900">
                            Neutral
                        </h3>
                        <div className="grid grid-cols-6 sm:grid-cols-11 gap-y-4 gap-x-2">
                            {sortedNeutrals.map(({ name, desc }) => {
                                const scale = (RadixColors as any)[name];
                                const mainColor = Object.values(scale)[8] as string; // Step 9
                                const isSelected = selectedNeutral === name;
                                const isRecommended = recommendedNeutrals.includes(name);

                                return (
                                    <div key={name} className="flex flex-col items-center gap-1.5">
                                        <motion.button
                                            onClick={() => setSelectedNeutral(name)}
                                            className="w-full aspect-square relative group border-transparent"
                                            initial={false}
                                            animate={{
                                                borderRadius: isSelected ? "16px" : "9999px",
                                                scale: isSelected ? 1.1 : 1
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{
                                                duration: 0.8,
                                                ease: [0.2, 0.0, 0.0, 1.0]
                                            }}
                                            style={{ backgroundColor: mainColor }}
                                            title={`${name}: ${desc}`}
                                        >
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.span
                                                        className="absolute inset-0 flex items-center justify-center"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{
                                                            duration: 0.8,
                                                            ease: [0.2, 0.0, 0.0, 1.0]
                                                        }}
                                                    >
                                                        <Check className="w-4 h-4 text-white" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>

                                            {isRecommended && !isSelected && (
                                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white z-10" />
                                            )}
                                            {isRecommended && isSelected && (
                                                <motion.span
                                                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white z-10"
                                                    layout
                                                />
                                            )}
                                        </motion.button>
                                        <span className={`text-[10px] font-medium capitalize transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <ScaleVisualizer scale={neutralScale} colorName="Neutral" />
                    </section>

                    {/* 3. Semantic Color Selections (Separate Sections) */}
                    {[
                        { role: 'success', label: 'Success', state: selectedSuccess, setter: setSelectedSuccess, options: SEMANTIC_OPTIONS.success },
                        { role: 'error', label: 'Error', state: selectedError, setter: setSelectedError, options: SEMANTIC_OPTIONS.error },
                        { role: 'warning', label: 'Warning', state: selectedWarning, setter: setSelectedWarning, options: SEMANTIC_OPTIONS.warning },
                        { role: 'info', label: 'Info', state: selectedInfo, setter: setSelectedInfo, options: SEMANTIC_OPTIONS.info },
                    ].map((group) => {
                        const currentScale = (RadixColors as any)[group.state];

                        return (
                            <section key={group.role} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-10">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {group.label}
                                </h3>
                                <div className="grid grid-cols-6 sm:grid-cols-11 gap-x-2 gap-y-4">
                                    {group.options.map(color => {
                                        const scale = (RadixColors as any)[color];
                                        const mainColor = Object.values(scale)[8] as string; // Step 9
                                        const isSelected = group.state === color;

                                        return (
                                            <div key={color} className="flex flex-col items-center gap-1.5">
                                                <motion.button
                                                    onClick={() => group.setter(color)}
                                                    className="w-full aspect-square relative group border-transparent"
                                                    initial={false}
                                                    animate={{
                                                        scale: isSelected ? 1.1 : 1,
                                                        borderRadius: isSelected ? "16px" : "9999px"
                                                    }}
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{
                                                        duration: 0.8,
                                                        ease: [0.2, 0.0, 0.0, 1.0]
                                                    }}
                                                    style={{ backgroundColor: mainColor }}
                                                    title={color}
                                                >
                                                    <AnimatePresence>
                                                        {isSelected && (
                                                            <motion.span
                                                                className="absolute inset-0 flex items-center justify-center"
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.5 }}
                                                                transition={{
                                                                    duration: 0.8,
                                                                    ease: [0.2, 0.0, 0.0, 1.0]
                                                                }}
                                                            >
                                                                <Check className="w-4 h-4 text-white" />
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.button>
                                                <span className={`text-xs font-medium capitalize transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {color}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <ScaleVisualizer scale={currentScale} colorName={group.label} />
                            </section>
                        );
                    })}

                    {/* Auto-save enabled implicitly */}
                </div>

                {/* RIGHT COLUMN: Live Preview */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8 space-y-4">
                        <ThemeInjector customTokens={previewTokens}>
                            <LivePreview />
                        </ThemeInjector>

                        <div className="text-xs text-green-600 px-2 bg-green-50 p-2 rounded border border-green-100 flex items-center gap-2">
                            <Check className="w-3 h-3" />
                            선택하신 색상이 프리뷰에 즉시 반영됩니다.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

