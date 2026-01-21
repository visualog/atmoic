'use client';

import React, { useEffect, useMemo } from 'react';
import { useSpacingStore } from '@/stores/useSpacingStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTokenStore } from '@/stores/useTokenStore';
import SpacingVisualizer from '@/components/builder/SpacingVisualizer';
import { Ruler, RotateCcw, Grid3X3, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function SpacingPage() {
    const {
        baseUnit,
        setBaseUnit,
        spacingScale,
        resetScale,
        generateScale,
        selectedSpacingId,
        updateSpacingItem
    } = useSpacingStore();
    const { isDarkMode } = useBuilderStore();
    const { addToken, removeToken, getTokensByType } = useTokenStore();
    const [pendingUnit, setPendingUnit] = React.useState<number | null>(null);
    const [showGrid, setShowGrid] = React.useState(false);

    // Find selected item for the "quick edit" at the bottom of left column
    const selectedItem = spacingScale.find(item => item.id === selectedSpacingId);

    // Get primary color from tokens
    const tokens = getTokensByType('color');
    const primaryColor = tokens.find(t => t.id === 'primary-600')?.value || tokens.find(t => t.id === 'primary-500')?.value || '#3b82f6';

    // Generate spacing tokens
    const spacingTokens = useMemo(() => {
        return spacingScale.map(item => ({
            name: item.name,
            value: `${item.value}px`,
            type: 'spacing' as const,
            description: item.usage,
        }));
    }, [spacingScale]);

    // Auto-save to token store
    useEffect(() => {
        const timer = setTimeout(() => {
            const existingIds = getTokensByType('spacing').map(t => t.id);
            existingIds.forEach(id => removeToken(id));

            spacingTokens.forEach(t => {
                addToken({ ...t, id: generateId() });
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [spacingTokens, getTokensByType, removeToken, addToken]);

    return (
        <div className="pb-20">
            {/* Page Header */}
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>간격 시스템 (Spacing)</h2>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        그리드 시스템을 기반으로 일관된 여백과 레이아웃 간격을 정의하세요.
                    </p>
                </div>
                <button
                    onClick={resetScale}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${isDarkMode
                        ? 'bg-[#191919] border-[#2e2e2e] text-gray-300 hover:bg-[#222222]'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    초기화
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-7 space-y-10">

                    {/* 1. Base Unit Selection */}
                    <section className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-6 text-blue-500">
                            <Grid3X3 className="w-5 h-5" />
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Base Unit (그리드 기준)</h3>
                        </div>

                        <div className="flex gap-4">
                            {[4, 8].map((unit) => {
                                const isPending = pendingUnit === unit;
                                return (
                                    <button
                                        key={unit}
                                        onClick={() => {
                                            if (baseUnit === unit) return;
                                            if (isPending) {
                                                generateScale(unit);
                                                setPendingUnit(null);
                                            } else {
                                                setPendingUnit(unit);
                                                setTimeout(() => setPendingUnit(null), 3000);
                                            }
                                        }}
                                        className={`flex-1 p-4 rounded-xl ring-1 ring-inset text-left transition-all ${baseUnit === unit
                                            ? 'bg-blue-600 ring-blue-600 text-white shadow-lg shadow-blue-500/20 pointer-events-none'
                                            : isPending
                                                ? 'bg-amber-500 ring-amber-500 text-white animate-pulse'
                                                : isDarkMode
                                                    ? 'bg-[#222222] ring-[#2e2e2e] text-gray-400 hover:ring-[#3e3e3e]'
                                                    : 'bg-gray-50 ring-gray-200 text-gray-600 hover:ring-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl font-black mb-1">
                                            {isPending ? '확인?' : `${unit}px`}
                                        </div>
                                        <div className={`text-xs ${baseUnit === unit || isPending ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {isPending ? '기존 설정이 초기화됩니다' : (unit === 4 ? '유연하고 정밀한 인터페이스' : '명확하고 정돈된 레이아웃')}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* 2. Spacing Scale Visualizer */}
                    <section>
                        <SpacingVisualizer />
                    </section>

                    {/* 3. Quick Edit (Selected Item) */}
                    {selectedItem && (
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-2xl ring-1 ring-inset p-6 ${isDarkMode ? 'bg-[#191919] ring-blue-500/30' : 'bg-blue-50/30 ring-blue-200'}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    "{selectedItem.name}" 속성 수정
                                </h4>
                                <span className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-wider">Property Editor</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className={`block text-[10px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>간격 크기 (px)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="0"
                                                max="256"
                                                step={baseUnit}
                                                value={selectedItem.value}
                                                onChange={(e) => updateSpacingItem(selectedItem.id, Number(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <input
                                                type="number"
                                                value={selectedItem.value}
                                                onChange={(e) => updateSpacingItem(selectedItem.id, Number(e.target.value))}
                                                className={`w-20 px-2 py-1.5 rounded-lg ring-1 ring-inset text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDarkMode ? 'bg-[#222222] ring-[#3e3e3e] text-white' : 'bg-white ring-gray-300 text-gray-900'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </div>

                {/* RIGHT COLUMN: Live Preview */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 space-y-6">
                        <section className={`rounded-2xl ring-1 ring-inset min-h-[600px] transition-colors relative ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-gray-50 ring-gray-200'}`}>
                            <div className="flex items-center justify-between mb-6 p-6 pb-0">
                                <div className="flex items-center gap-2 text-purple-500">
                                    <Layers className="w-5 h-5" />
                                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>실시간 미리보기</h3>
                                </div>
                                <button
                                    onClick={() => setShowGrid(!showGrid)}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold ring-1 ring-inset transition-colors ${showGrid
                                        ? 'bg-blue-600 ring-blue-600 text-white'
                                        : isDarkMode ? 'bg-[#222222] ring-[#2e2e2e] text-gray-400 hover:ring-[#3e3e3e]' : 'bg-white ring-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <Grid3X3 className="w-3 h-3" />
                                    {showGrid ? '그리드 끄기' : '그리드 켜기'}
                                </button>
                            </div>

                            <div className="relative">
                                {/* Grid Overlay */}
                                {showGrid && (
                                    <div
                                        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.1] z-20 rounded-2xl ring-1 ring-inset ring-blue-500/10"
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(to right, ${isDarkMode ? '#3b82f6' : '#3b82f6'} 1px, transparent 1px),
                                                linear-gradient(to bottom, ${isDarkMode ? '#3b82f6' : '#3b82f6'} 1px, transparent 1px)
                                            `,
                                            backgroundSize: `${baseUnit}px ${baseUnit}px`
                                        }}
                                    />
                                )}

                                <div className="relative z-10 space-y-8 p-6">
                                    {/* Sample 1: Card Padding & Gap */}
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Card & List (Gap)</span>
                                        <div
                                            className="flex flex-col"
                                            style={{ gap: `${spacingScale.find(s => s.id === 'space-sm')?.value || 8}px` }}
                                        >
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`rounded-xl ring-1 ring-inset p-4 ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-white ring-gray-200'}`}
                                                    style={{ padding: `${spacingScale.find(s => s.id === 'space-md')?.value || 16}px` }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: `${primaryColor}30` }}></div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="h-2 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sample 2: Form Spacing */}
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Form Elements</span>
                                        <div className={`rounded-2xl p-6 ring-1 ring-inset ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-white ring-gray-200'}`}>
                                            <div style={{ marginBottom: `${spacingScale.find(s => s.id === 'space-md')?.value || 16}px` }}>
                                                <div style={{ marginBottom: `${spacingScale.find(s => s.id === 'space-2xs' || s.id === 'space-0')?.value || 4}px` }}>
                                                    <div className="h-3 w-16 bg-gray-400 dark:bg-gray-500 rounded"></div>
                                                </div>
                                                <div className="h-10 w-full rounded-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-600 bg-gray-50 dark:bg-[#1a1a1a]"></div>
                                            </div>
                                            <div className="flex justify-end" style={{ gap: `${spacingScale.find(s => s.id === 'space-sm')?.value || 8}px` }}>
                                                <div className="h-9 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                                <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: primaryColor }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sample 3: Section Spacing */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Section Hierarchy</span>
                                        <div className={`rounded-xl overflow-hidden ring-1 ring-inset ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-white ring-gray-200'}`}>
                                            <div
                                                className="flex flex-col items-center justify-center text-center"
                                                style={{
                                                    padding: `${spacingScale.find(s => s.id === 'space-xl')?.value || 32}px 0`,
                                                    backgroundColor: `${primaryColor}10`
                                                }}
                                            >
                                                <div className="h-4 w-40 rounded mb-4" style={{ backgroundColor: `${primaryColor}40` }}></div>
                                                <div className="h-2 w-64 rounded" style={{ backgroundColor: `${primaryColor}20` }}></div>
                                            </div>
                                            <div
                                                className="p-6"
                                                style={{ padding: `${spacingScale.find(s => s.id === 'space-lg')?.value || 24}px` }}
                                            >
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                                                    <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                                                    <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
