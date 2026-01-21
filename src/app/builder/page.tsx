'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useTokenStore } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import ThemeInjector from '@/components/builder/ThemeInjector';
import LivePreview from '@/components/builder/LivePreview';
import ScaleVisualizer from '@/components/builder/ScaleVisualizer';
import StatusMessage from '@/components/builder/StatusMessage';
import { Check, RotateCcw, Layers } from 'lucide-react';
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
    const { selectItem, selectedId, isDarkMode } = useBuilderStore();

    // Semantic Color Options
    const SEMANTIC_OPTIONS = {
        success: ['green', 'teal', 'grass', 'mint'],
        error: ['red', 'tomato', 'ruby', 'crimson'],
        warning: ['amber', 'yellow', 'orange'],
        info: ['blue', 'sky', 'cyan', 'indigo']
    };

    // Type definition for Radix Colors to avoid 'any'
    const colorScales = RadixColors as unknown as Record<string, Record<string, string>>;

    // Selection State
    const [selectedBrand, setSelectedBrand] = useState('indigo');
    const [selectedNeutral, setSelectedNeutral] = useState('slate');

    // Semantic State
    const [selectedSuccess, setSelectedSuccess] = useState('green');
    const [selectedError, setSelectedError] = useState('red');
    const [selectedWarning, setSelectedWarning] = useState('amber');
    const [selectedInfo, setSelectedInfo] = useState('blue');

    // Handler: When a color chip is clicked in ScaleVisualizer
    const handleColorSelect = (group: string, index: number) => {
        const targetName = `${group} ${index + 1}`;
        const token = tokens.find(t => t.name === targetName);

        if (token) {
            selectItem(token.id, 'token');
        } else {
            console.warn(`Token not found for name: ${targetName}`);
        }
    };

    // Helper: Determine which index is selected for a given group
    const getSelectedIndex = (group: string): number | null => {
        if (!selectedId) return null;

        const token = tokens.find(t => t.id === selectedId);
        if (!token) return null;

        if (token.name.startsWith(group + ' ')) {
            const parts = token.name.split(' ');
            const number = parseInt(parts[parts.length - 1], 10);
            return isNaN(number) ? null : number - 1;
        }

        return null;
    };

    // Derived state: Get recommended neutrals for current brand
    const recommendedNeutrals = useMemo(() => RECOMMENDATIONS[selectedBrand] || ['gray'], [selectedBrand]);

    // Handle Brand Selection and Auto-select Neutral
    const handleBrandSelect = (color: string) => {
        setSelectedBrand(color);
        const recommendations = RECOMMENDATIONS[color] || ['gray'];
        if (recommendations.length > 0) {
            setSelectedNeutral(recommendations[0]);
        }
    };

    // Helper: Get scale by name, respecting Dark Mode
    const getScale = useCallback((name: string): Record<string, string> => {
        const scaleName = isDarkMode ? `${name}Dark` : name;
        return colorScales[scaleName] || colorScales[name];
    }, [isDarkMode, colorScales]);

    // Get the actual scale objects
    const brandScale = getScale(selectedBrand);
    const neutralScale = getScale(selectedNeutral);

    // Sort neutrals: Recommended first, then others
    const sortedNeutrals = useMemo(() => {
        return [...NEUTRAL_COLORS].sort((a, b) => {
            const indexA = recommendedNeutrals.indexOf(a.name);
            const indexB = recommendedNeutrals.indexOf(b.name);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
        });
    }, [recommendedNeutrals]);

    // Generate preview tokens for LivePreview
    const previewTokens = useMemo(() => {
        const tokens: { name: string; value: string; type: 'color' }[] = [];

        // Brand
        if (brandScale) {
            Object.values(brandScale).forEach((value, index) => {
                tokens.push({ name: `Primary ${index + 1}`, value, type: 'color' });
            });
        }

        // Neutral
        if (neutralScale) {
            Object.values(neutralScale).forEach((value, index) => {
                tokens.push({ name: `Neutral ${index + 1}`, value, type: 'color' });
            });
        }

        // Semantics
        const semantics = [
            { name: 'Success', scale: getScale(selectedSuccess) },
            { name: 'Error', scale: getScale(selectedError) },
            { name: 'Warning', scale: getScale(selectedWarning) },
            { name: 'Info', scale: getScale(selectedInfo) },
        ];
        semantics.forEach(sem => {
            if (sem.scale) {
                Object.values(sem.scale).forEach((val, idx) => {
                    tokens.push({ name: `${sem.name} ${idx + 1}`, value: val, type: 'color' });
                });
            }
        });

        // Contrast Logic for Light Brands (In Dark Mode, always white)
        const LIGHT_BRANDS = ['amber', 'yellow', 'lime', 'mint', 'sky'];
        const isLight = LIGHT_BRANDS.includes(selectedBrand);
        tokens.push({
            name: 'Primary Foreground',
            value: isDarkMode ? '#ffffff' : (isLight ? '#1a1a1a' : '#ffffff'),
            type: 'color'
        });

        return tokens;
    }, [brandScale, neutralScale, selectedSuccess, selectedError, selectedWarning, selectedInfo, selectedBrand, isDarkMode, getScale]);

    // Auto-save: Automatically apply theme to system when tokens change
    useEffect(() => {
        const timer = setTimeout(() => {
            const existingIds = getTokensByType('color').map(t => t.id);
            existingIds.forEach(id => removeToken(id));

            previewTokens.forEach(t => {
                addToken({ ...t, id: generateId() });
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [previewTokens, getTokensByType, removeToken, addToken]);

    return (
        <div className="pb-20">
            {/* Page Header */}
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>색상</h2>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Radix UI 시스템을 기반으로 완벽한 조화를 이루는 컬러 팔레트를 선택하세요.
                    </p>
                </div>
                <button
                    onClick={() => {
                        const existingIds = getTokensByType('color').map(t => t.id);
                        existingIds.forEach(id => removeToken(id));
                    }}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium ring-1 ring-inset rounded-lg transition-colors ${isDarkMode
                        ? 'bg-[#191919] ring-[#2e2e2e] text-gray-300 hover:bg-[#222222]'
                        : 'bg-white ring-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    초기화
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-7 space-y-10">

                    {/* 1. Brand Color Selection */}
                    <section className={`rounded-2xl ring-1 ring-inset p-6 flex flex-col gap-10 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'
                        }`}>
                        <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Brand
                        </h3>
                        <div className="grid grid-cols-6 sm:grid-cols-11 gap-y-4 gap-x-2">
                            {BRAND_COLORS.map(color => {
                                const scale = getScale(color);
                                const mainColor = Object.values(scale)[8] as string; // Step 9
                                const isSelected = selectedBrand === color;

                                return (
                                    <div key={color} className="flex flex-col items-center gap-1.5">
                                        <motion.button
                                            onClick={() => handleBrandSelect(color)}
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
                                        <span className={`text-xs font-medium capitalize transition-colors ${isSelected
                                            ? (isDarkMode ? 'text-white' : 'text-gray-900')
                                            : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                                            }`}>
                                            {color}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <ScaleVisualizer
                            scale={brandScale}
                            colorName="Primary"
                            onSelect={(i) => handleColorSelect('Primary', i)}
                            selectedIndex={getSelectedIndex('Primary')}
                        />
                    </section>

                    {/* 2. Neutral Color Selection */}
                    <section className={`rounded-2xl ring-1 ring-inset p-6 flex flex-col gap-10 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'
                        }`}>
                        <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Neutral
                        </h3>
                        <div className="grid grid-cols-6 sm:grid-cols-11 gap-y-4 gap-x-2">
                            {sortedNeutrals.map(({ name, desc }) => {
                                const scale = getScale(name);
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

                                            {isRecommended && (
                                                <span className={`absolute -top-2 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10 ring-1 ring-inset ${isDarkMode ? 'ring-[#191919]' : 'ring-white'
                                                    }`}>
                                                    추천
                                                </span>
                                            )}
                                        </motion.button>
                                        <span className={`text-[10px] font-medium capitalize transition-colors ${isSelected
                                            ? (isDarkMode ? 'text-white' : 'text-gray-900')
                                            : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                                            }`}>
                                            {name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <ScaleVisualizer
                            scale={neutralScale}
                            colorName="Neutral"
                            onSelect={(i) => handleColorSelect('Neutral', i)}
                            selectedIndex={getSelectedIndex('Neutral')}
                        />
                    </section>

                    {/* 3. Semantic Color Selections (Separate Sections) */}
                    {[
                        { role: 'success', label: 'Success', state: selectedSuccess, setter: setSelectedSuccess, options: SEMANTIC_OPTIONS.success },
                        { role: 'error', label: 'Error', state: selectedError, setter: setSelectedError, options: SEMANTIC_OPTIONS.error },
                        { role: 'warning', label: 'Warning', state: selectedWarning, setter: setSelectedWarning, options: SEMANTIC_OPTIONS.warning },
                        { role: 'info', label: 'Info', state: selectedInfo, setter: setSelectedInfo, options: SEMANTIC_OPTIONS.info },
                    ].map((group) => {
                        const currentScale = getScale(group.state);

                        return (
                            <section key={group.role} className={`rounded-2xl ring-1 ring-inset p-6 flex flex-col gap-10 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'
                                }`}>
                                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {group.label}
                                </h3>
                                <div className="grid grid-cols-6 sm:grid-cols-11 gap-x-2 gap-y-4">
                                    {group.options.map(color => {
                                        const scale = getScale(color);
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
                                                <span className={`text-xs font-medium capitalize transition-colors ${isSelected
                                                    ? (isDarkMode ? 'text-white' : 'text-gray-900')
                                                    : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                                                    }`}>
                                                    {color}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <ScaleVisualizer
                                    scale={currentScale}
                                    colorName={group.label}
                                    onSelect={(i) => handleColorSelect(group.label, i)}
                                    selectedIndex={getSelectedIndex(group.label)}
                                />
                            </section>
                        );
                    })}

                    {/* Auto-save enabled implicitly */}
                </div>

                {/* RIGHT COLUMN: Live Preview */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 space-y-4">
                        <section className={`rounded-2xl ring-1 ring-inset transition-colors overflow-hidden ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-gray-50 ring-gray-200'}`}>
                            <div className="flex items-center justify-between p-6 pb-0">
                                <div className="flex items-center gap-2 text-purple-500">
                                    <Layers className="w-5 h-5" />
                                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>실시간 미리보기</h3>
                                </div>
                            </div>
                            <ThemeInjector>
                                <LivePreview />
                            </ThemeInjector>
                        </section>

                        <StatusMessage message="선택하신 색상이 프리뷰에 즉시 반영됩니다." />
                    </div>
                </div>

            </div>
        </div>
    );
}
