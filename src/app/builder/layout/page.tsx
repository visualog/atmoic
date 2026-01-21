'use client';

import React, { useState } from 'react';
import { useLayoutStore, Breakpoint } from '@/stores/useLayoutStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import GridOverlay from '@/components/builder/GridOverlay';
import StatusMessage from '@/components/builder/StatusMessage';
import { RotateCcw, Smartphone, Tablet, Monitor, Layout as LayoutIcon, Eye, EyeOff, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LayoutPage() {
    const { breakpoints, activeCheckpoint, updateGridConfig, setActiveCheckpoint, isOverlayVisible, toggleOverlay, resetLayout } = useLayoutStore();
    const { isDarkMode } = useBuilderStore();

    // Use local state for preview width simulation if needed, 
    // but for now we rely on activeCheckpoint to set the context and CSS vars.
    // We visualize "Desktop" config when desktop tab is active, etc.

    const currentConfig = breakpoints[activeCheckpoint];

    const renderSlider = (
        label: string,
        value: number,
        onChange: (val: number) => void,
        min: number,
        max: number,
        step: number = 1
    ) => (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {label}
                </label>
                <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
    );

    const tabs: { id: Breakpoint; icon: React.ElementType; label: string }[] = [
        { id: 'mobile', icon: Smartphone, label: 'Mobile' },
        { id: 'tablet', icon: Tablet, label: 'Tablet' },
        { id: 'desktop', icon: Monitor, label: 'Desktop' }, // Using Monitor for Desktop
    ];

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>레이아웃</h2>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        반응형 그리드 시스템을 정의하여 다양한 기기에서 일관된 배치를 유지하세요.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleOverlay}
                        className={`flex items-center px-3 py-1.5 text-sm font-medium ring-1 ring-inset rounded-lg transition-colors ${isDarkMode
                            ? 'bg-[#191919] ring-[#2e2e2e] text-gray-300 hover:bg-[#222222]'
                            : 'bg-white ring-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {isOverlayVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        가이드 {isOverlayVisible ? '끄기' : '켜기'}
                    </button>
                    <button
                        onClick={resetLayout}
                        className={`flex items-center px-3 py-1.5 text-sm font-medium ring-1 ring-inset rounded-lg transition-colors ${isDarkMode
                            ? 'bg-[#191919] ring-[#2e2e2e] text-gray-300 hover:bg-[#222222]'
                            : 'bg-white ring-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        초기화
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Device Tabs */}
                    <div className="flex p-1 rounded-xl bg-gray-100 dark:bg-[#191919]">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeCheckpoint === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveCheckpoint(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${isActive
                                        ? 'bg-white dark:bg-[#333] text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Properties */}
                    <section className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Grid Configuration
                            </h4>
                            <LayoutIcon className="w-4 h-4 text-blue-500" />
                        </div>

                        <div className="space-y-6">
                            {renderSlider("Columns (count)", currentConfig.columns, (v) => updateGridConfig(activeCheckpoint, { columns: v }), 1, 24)}
                            {renderSlider("Gutter (px)", currentConfig.gutter, (v) => updateGridConfig(activeCheckpoint, { gutter: v }), 0, 100)}
                            {renderSlider("Margin (px)", currentConfig.margin, (v) => updateGridConfig(activeCheckpoint, { margin: v }), 0, 200)}
                        </div>
                    </section>

                    <div className={`p-4 rounded-xl text-xs leading-relaxed ${isDarkMode ? 'bg-[#191919] text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                        <p className="mb-2 font-bold">도움말</p>
                        <p>
                            그리드 설정은 <strong>ThemeInjector</strong>를 통해 CSS 변수(<code>--grid-columns</code> 등)로 전역에 주입됩니다.
                            Breakpoint 탭을 변경하여 각 디바이스별 설정을 조정해보세요.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Preview */}
                <div className="lg:col-span-8 sticky top-6 space-y-4">
                    <section className={`rounded-2xl ring-1 ring-inset transition-colors overflow-hidden ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-gray-50 ring-gray-200'}`}>
                        <div className="flex items-center justify-between p-6 pb-0">
                            <div className="flex items-center gap-2 text-purple-500">
                                <Layers className="w-5 h-5" />
                                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>실시간 미리보기</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 mr-2">
                                    Width: {activeCheckpoint === 'mobile' ? '100% (Mobile)' : activeCheckpoint === 'tablet' ? '100% (Tablet)' : '100% (Desktop)'}
                                </span>
                                <button
                                    onClick={toggleOverlay}
                                    className={`flex items-center px-3 py-1.5 text-xs font-medium ring-1 ring-inset rounded-lg transition-colors ${isDarkMode
                                        ? 'bg-[#222222] ring-[#2e2e2e] text-gray-300 hover:bg-[#333]'
                                        : 'bg-white ring-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {isOverlayVisible ? <EyeOff className="w-3.5 h-3.5 mr-2" /> : <Eye className="w-3.5 h-3.5 mr-2" />}
                                    가이드
                                </button>
                            </div>
                        </div>

                        {/* Preview Container */}
                        <div className="relative min-h-[500px] flex flex-col p-6 pt-6">
                            {/* Grid Overlay inside Preview */}
                            <GridOverlay show={isOverlayVisible} />

                            {/* Simulated Content */}
                            <div className="relative z-10 flex-1 flex flex-col pt-8 pb-8"
                                style={{
                                    paddingLeft: `${currentConfig.margin}px`,
                                    paddingRight: `${currentConfig.margin}px`
                                }}>

                                {/* Header Simulation */}
                                <div className="h-12 w-full mb-8 rounded-lg bg-gray-200 dark:bg-[#222] flex items-center px-4">
                                    <div className="w-20 h-4 bg-gray-300 dark:bg-[#333] rounded"></div>
                                    <div className="ml-auto w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333]"></div>
                                </div>

                                {/* Grid Layout Content */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${currentConfig.columns}, 1fr)`,
                                        gap: `${currentConfig.gutter}px`
                                    }}
                                >
                                    <div className={`col-span-full h-32 rounded-xl mb-6 flex items-center justify-center text-sm font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400`}>
                                        Hero Section (Full Width)
                                    </div>

                                    {/* Dynamic Columns */}
                                    {Array.from({ length: activeCheckpoint === 'mobile' ? 2 : activeCheckpoint === 'tablet' ? 4 : 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-24 rounded-lg flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-500 dark:bg-[#222] dark:text-gray-500`}
                                            style={{
                                                // Simple span logic simulation
                                                gridColumn: activeCheckpoint === 'mobile' ? 'span 2' :
                                                    activeCheckpoint === 'tablet' ? 'span 4' :
                                                        'span 3' // 12 columns / 4 items = 3 span
                                            }}
                                        >
                                            Content {i + 1}
                                        </div>
                                    ))}

                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={`small-${i}`}
                                            className={`h-12 rounded bg-gray-50 dark:bg-[#1a1a1a] border border-dashed border-gray-200 dark:border-[#333]`}
                                            style={{ gridColumn: 'span 1' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    <StatusMessage message="설정하신 그리드 시스템이 프리뷰에 즉시 반영됩니다." />
                </div>
            </div>
        </div>
    );
}
