'use client';

import React from 'react';
import { useRadiusStore } from '@/stores/useRadiusStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTokenStore } from '@/stores/useTokenStore';
import RadiusVisualizer from '@/components/builder/RadiusVisualizer';
import StatusMessage from '@/components/builder/StatusMessage';
import PageHeader from '@/components/builder/PageHeader';
import { Circle, Layers, ShoppingBag, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RadiusPage() {
    const { radiusScale, selectedRadiusId, updateRadius, resetRadius } = useRadiusStore();
    const { isDarkMode } = useBuilderStore();
    const { getTokensByType } = useTokenStore();

    const selectedItem = radiusScale.find(item => item.id === selectedRadiusId);

    // Get primary color
    const tokens = getTokensByType('color');
    const primaryColor = tokens.find(t => t.name === 'Primary 9')?.value || tokens.find(t => t.name === 'Primary 6')?.value || '#3b82f6';

    return (
        <div className="pb-20">
            <PageHeader
                title="곡률"
                description="UI 요소의 모서리 둥글기를 정의하여 디자인의 부드러움과 날카로움을 조절하세요."
                onReset={resetRadius}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-4 space-y-10">
                    <section className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                        <RadiusVisualizer />
                    </section>

                    {/* Quick Edit Slider */}
                    {selectedItem && (
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-2xl ring-1 ring-inset p-6 ${isDarkMode ? 'bg-[#191919] ring-blue-500/30' : 'bg-blue-50/30 ring-blue-200'}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    "{selectedItem.name}" 곡률 수정
                                </h4>
                                <span className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-wider">Property Editor</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-[10px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Radius Size (px)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="32"
                                            step="1"
                                            value={selectedItem.value}
                                            onChange={(e) => updateRadius(selectedItem.id, Number(e.target.value))}
                                            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <input
                                            type="number"
                                            value={selectedItem.value}
                                            onChange={(e) => updateRadius(selectedItem.id, Number(e.target.value))}
                                            className={`w-20 px-2 py-1.5 rounded-lg ring-1 ring-inset text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDarkMode ? 'bg-[#222222] ring-[#3e3e3e] text-white' : 'bg-white ring-gray-300 text-gray-900'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </div>

                {/* RIGHT COLUMN: Live Preview */}
                <div className="lg:col-span-8">
                    <div className="sticky top-6 space-y-4">
                        <section className={`rounded-2xl ring-2 ring-inset transition-colors overflow-hidden relative ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-gray-50 ring-gray-200'}`}>
                            <div className="flex items-center justify-between p-6 pb-0">
                                <div className="flex items-center gap-2 text-purple-500">
                                    <Layers className="w-5 h-5" />
                                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>실시간 미리보기</h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-8 min-h-[500px]">
                                {/* Buttons */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Buttons (Small, Medium, Full)</span>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold transition-all" style={{ borderRadius: 'var(--radius-sm)' }}>
                                            Button SM
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold transition-all" style={{ borderRadius: 'var(--radius-md)' }}>
                                            Button MD
                                        </button>
                                        <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold transition-all" style={{ borderRadius: 'var(--radius-full)' }}>
                                            Button Full
                                        </button>
                                    </div>
                                </div>

                                {/* Cards */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Cards (Large, XL)</span>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Product Card (LG Radius) */}
                                        <div
                                            className={`p-4 ring-1 ring-inset ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-white ring-gray-200'}`}
                                            style={{ borderRadius: 'var(--radius-lg)' }}
                                        >
                                            <div
                                                className="aspect-[4/3] w-full mb-3 flex items-center justify-center relative overflow-hidden"
                                                style={{ borderRadius: 'var(--radius-md)', backgroundColor: isDarkMode ? '#1a1a1a' : '#f3f4f6' }}
                                            >
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                                <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold bg-white/90 text-black backdrop-blur-sm shadow-sm" style={{ borderRadius: 'var(--radius-sm)' }}>
                                                    NEW
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <h5 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Minimal Stand</h5>
                                                    <p className="text-xs text-gray-500">Furniture</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$129</span>
                                                    <button
                                                        className="p-1.5 text-white transition-opacity hover:opacity-90"
                                                        style={{ backgroundColor: primaryColor, borderRadius: 'var(--radius-md)' }}
                                                    >
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* News Card (XL Radius) */}
                                        <div
                                            className={`p-4 ring-1 ring-inset hover:ring-2 hover:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-white ring-gray-200'}`}
                                            style={{ borderRadius: 'var(--radius-xl)' }}
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <div
                                                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                                                    style={{ backgroundColor: `${primaryColor}15`, borderRadius: 'var(--radius-md)' }}
                                                >
                                                    <Layers className="w-5 h-5" style={{ color: primaryColor }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'}`} style={{ borderRadius: 'var(--radius-sm)' }}>
                                                            UPDATE
                                                        </span>
                                                        <span className="text-[10px] text-gray-500">2m ago</span>
                                                    </div>
                                                    <h5 className={`text-sm font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        System Update 2.0
                                                    </h5>
                                                </div>
                                            </div>
                                            <p className={`text-xs mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                New radius tokens have been deployed. Check out the smoother corners!
                                            </p>
                                            <button
                                                className="w-full py-2 text-xs font-semibold flex items-center justify-center gap-1 transition-colors hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                                                style={{
                                                    borderRadius: 'var(--radius-md)',
                                                    border: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`,
                                                    color: isDarkMode ? '#e5e7eb' : '#374151'
                                                }}
                                            >
                                                Read Details
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Inputs (Medium)</span>
                                    <input
                                        type="text"
                                        placeholder="Input field..."
                                        className={`w-full px-4 py-2 text-sm ring-1 ring-inset bg-transparent ${isDarkMode ? 'ring-[#3e3e3e] text-white' : 'ring-gray-300 text-gray-900'}`}
                                        style={{ borderRadius: 'var(--radius-md)' }}
                                    />
                                </div>

                                {/* Tags */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Tags / Badges (Full vs Small)</span>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold" style={{ borderRadius: 'var(--radius-sm)' }}>
                                            Tag (SM)
                                        </span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold" style={{ borderRadius: 'var(--radius-full)' }}>
                                            Badge (Full)
                                        </span>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold" style={{ borderRadius: 'var(--radius-md)' }}>
                                            Label (MD)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <StatusMessage message="설정하신 곡률이 프리뷰에 즉시 반영됩니다." />
                    </div>
                </div>
            </div>
        </div>
    );
}

