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

    // Selection State
    const [selectedBrand, setSelectedBrand] = useState('indigo');
    const [selectedNeutral, setSelectedNeutral] = useState('slate');

    // Get the actual scale objects from Radix package
    const brandScale = (RadixColors as any)[selectedBrand];
    const neutralScale = (RadixColors as any)[selectedNeutral];

    // Derived state: Get recommended neutrals for current brand
    const recommendedNeutrals = RECOMMENDATIONS[selectedBrand] || ['gray'];

    // Automatically select the best match neutral when brand changes (Optional UX, maybe too aggressive? Let's sticky to suggestion badges for now)
    // useEffect(() => {
    //   if (recommendedNeutrals.length > 0) setSelectedNeutral(recommendedNeutrals[0]);
    // }, [selectedBrand]);

    // Sort neutrals: Recommended first, then others
    const sortedNeutrals = useMemo(() => {
        return [...NEUTRAL_COLORS].sort((a, b) => {
            const aIsRec = recommendedNeutrals.includes(a.name);
            const bIsRec = recommendedNeutrals.includes(b.name);
            if (aIsRec && !bIsRec) return -1;
            if (!aIsRec && bIsRec) return 1;
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

        // Semantics (Default)
        const semantics = [
            { name: 'Success', scale: RadixColors.green },
            { name: 'Error', scale: RadixColors.red },
            { name: 'Warning', scale: RadixColors.amber },
            { name: 'Info', scale: RadixColors.blue },
        ];
        semantics.forEach(sem => {
            Object.values(sem.scale).forEach((val: any, idx) => {
                tokens.push({ name: `${sem.name} ${idx + 1}`, value: val, type: 'color' });
            });
        });

        return tokens;
    }, [brandScale, neutralScale]);

    // Helper to apply to store
    const handleApplyTheme = () => {
        // 1. Clear existing color tokens
        const existingIds = getTokensByType('color').map(t => t.id);
        existingIds.forEach(id => removeToken(id));

        // 2. Add All Preview Tokens
        previewTokens.forEach(t => {
            addToken({ ...t, id: generateId() });
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">

            {/* LEFT COLUMN: Configuration */}
            <div className="lg:col-span-7 space-y-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">시스템 컬러 설계</h2>
                    <p className="text-gray-500 mt-1">
                        Radix UI 시스템을 기반으로 완벽한 조화를 이루는 컬러 팔레트를 선택하세요.
                    </p>
                </div>

                {/* 1. Brand Color Selection */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-10">
                    <h3 className="text-lg font-bold text-gray-900">
                        Brand
                    </h3>
                    <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                        {BRAND_COLORS.map(color => {
                            const scale = (RadixColors as any)[color];
                            const mainColor = Object.values(scale)[8] as string; // Step 9
                            const isSelected = selectedBrand === color;

                            return (
                                <button
                                    key={color}
                                    onClick={() => setSelectedBrand(color)}
                                    className={clsx(
                                        "w-full aspect-square transition-all duration-300 relative group",
                                        isSelected
                                            ? "rounded-2xl scale-110 shadow-sm"
                                            : "rounded-full hover:scale-110"
                                    )}
                                    style={{ backgroundColor: mainColor }}
                                    title={color}
                                >
                                    {isSelected && <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />}
                                </button>
                            );
                        })}
                    </div>

                    <ScaleVisualizer scale={brandScale} colorName="Primary" />
                </section>

                {/* 2. Neutral Color Selection */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-10">
                    <h3 className="text-lg font-bold text-gray-900">
                        Neutral
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sortedNeutrals.map(({ name, desc }) => {
                            const scale = (RadixColors as any)[name];
                            const mainColor = Object.values(scale)[8] as string; // Step 9
                            const isSelected = selectedNeutral === name;
                            const isRecommended = recommendedNeutrals.includes(name);

                            return (
                                <button
                                    key={name}
                                    onClick={() => setSelectedNeutral(name)}
                                    className={clsx(
                                        "relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                        isSelected
                                            ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                                            : isRecommended
                                                ? "border-blue-200 bg-blue-50/30 hover:border-blue-300 hover:bg-blue-50"
                                                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50 opacity-60 hover:opacity-100"
                                    )}
                                    title={desc}
                                >
                                    {isRecommended && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 animate-pulse flex items-center gap-1">
                                            <Star className="w-2.5 h-2.5 fill-current" />
                                            BEST
                                        </span>
                                    )}
                                    <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: mainColor }} />
                                    <div>
                                        <div className="font-bold text-sm capitalize text-gray-900">{name}</div>
                                        <div className="text-xs text-gray-500">{desc}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <ScaleVisualizer scale={neutralScale} colorName="Neutral" />
                </section>

                {/* 3. Action */}
                <div className="flex justify-end p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-500 text-right">
                            선택한 테마를 시스템에 적용합니다.<br />
                            기존의 사용자 정의 토큰은 재설정됩니다.
                        </p>
                        <button
                            onClick={handleApplyTheme}
                            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors shadow-lg flex items-center"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Apply Theme to System
                        </button>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Live Preview */}
            <div className="lg:col-span-5">
                <div className="sticky top-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                            Live Theme Preview
                        </h3>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                            Real-time
                        </span>
                    </div>

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
    );
}
