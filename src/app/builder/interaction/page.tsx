'use client';

import React, { useState } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import StatusMessage from '@/components/builder/StatusMessage';
import PageHeader from '@/components/builder/PageHeader';
import { MousePointerClick, Hand, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InteractionPage() {
    const { opacity, updateOpacity, resetInteraction } = useInteractionStore();
    const { isDarkMode } = useBuilderStore();
    const [forceState, setForceState] = useState<'none' | 'hover' | 'pressed' | 'disabled'>('none');

    const renderSlider = (
        label: string,
        itemKey: keyof typeof opacity,
        min: number,
        max: number,
        step: number = 0.05
    ) => (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {label}
                </label>
                <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{opacity[itemKey]}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={opacity[itemKey]}
                onChange={(e) => updateOpacity(itemKey, Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
    );

    return (
        <div className="pb-20">
            <PageHeader
                title="상호작용"
                description="UI 요소의 상태별(Disabled, Hover, Pressed) 투명도를 정의하여 일관된 인터랙션 경험을 제공하세요."
                onReset={resetInteraction}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    <section className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Opacity Configuration
                            </h4>
                            <MousePointerClick className="w-4 h-4 text-blue-500" />
                        </div>

                        <div className="space-y-6">
                            {renderSlider("Disabled Opacity", 'disabled', 0, 1)}
                            {renderSlider("Hover Opacity", 'hover', 0, 1)}
                            {renderSlider("Pressed Opacity", 'pressed', 0, 1)}
                            {renderSlider("Overlay/Backdrop Opacity", 'overlay', 0, 1)}
                        </div>
                    </section>

                    <div className={`p-4 rounded-xl text-xs leading-relaxed ${isDarkMode ? 'bg-[#191919] text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                        <p className="mb-2 font-bold">도움말</p>
                        <p>
                            설정값은 CSS 변수(<code>--opacity-hover</code> 등)로 변환되어 버튼, 링크, 카드 등의 인터랙션 스타일에 자동 적용됩니다.
                            Force State 토글을 사용하여 특정 상태를 강제로 시각화해보세요.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Live Preview */}
                <div className="lg:col-span-8">
                    <div className="sticky top-6 space-y-4">
                        <section className={`rounded-2xl ring-2 ring-inset transition-colors overflow-hidden ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-gray-50 ring-gray-200'}`}>
                            <div className="flex items-center justify-between p-6 pb-0">
                                <div className="flex items-center gap-2 text-purple-500">
                                    <Layers className="w-5 h-5" />
                                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>실시간 미리보기</h3>
                                </div>

                                {/* Force State Toggles */}
                                <div className={`flex items-center p-1 rounded-lg ring-1 ring-inset ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-gray-100 ring-gray-200'}`}>
                                    {(['none', 'hover', 'pressed', 'disabled'] as const).map((state) => (
                                        <button
                                            key={state}
                                            onClick={() => setForceState(state)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${forceState === state
                                                ? 'bg-white dark:bg-[#333] text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {state}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 min-h-[500px]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {/* Buttons Section */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Buttons</h4>
                                        <div className="space-y-4">
                                            {/* Primary Button */}
                                            <button
                                                className={`w-full px-4 py-3 rounded-lg font-bold transition-opacity
                                            ${forceState === 'disabled' ? 'cursor-not-allowed' : ''}
                                            ${forceState === 'hover' ? 'opacity-[var(--opacity-hover)]' : ''}
                                            ${forceState === 'pressed' ? 'opacity-[var(--opacity-pressed)] scale-95' : ''}
                                        `}
                                                style={{
                                                    backgroundColor: 'var(--primary-9)',
                                                    color: 'white',
                                                    opacity: forceState === 'disabled' ? 'var(--opacity-disabled)' : undefined
                                                }}
                                            >
                                                Primary Action
                                            </button>

                                            {/* Secondary Button */}
                                            <button
                                                className={`w-full px-4 py-3 rounded-lg font-bold transition-opacity border
                                            ${forceState === 'disabled' ? 'cursor-not-allowed' : ''}
                                            ${forceState === 'hover' ? 'opacity-[var(--opacity-hover)]' : ''}
                                            ${forceState === 'pressed' ? 'opacity-[var(--opacity-pressed)] scale-95' : ''}
                                        `}
                                                style={{
                                                    borderColor: isDarkMode ? '#333' : '#e5e7eb',
                                                    color: isDarkMode ? 'white' : '#111',
                                                    opacity: forceState === 'disabled' ? 'var(--opacity-disabled)' : undefined
                                                }}
                                            >
                                                Secondary Action
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cards Section */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Interactive Cards</h4>

                                        <div
                                            className={`p-6 rounded-xl border transition-all cursor-pointer
                                        ${forceState === 'disabled' ? 'cursor-not-allowed grayscale' : ''}
                                        ${forceState === 'hover' ? 'opacity-[var(--opacity-hover)] border-blue-500' : ''}
                                        ${forceState === 'pressed' ? 'opacity-[var(--opacity-pressed)] scale-[0.98]' : ''}
                                    `}
                                            style={{
                                                backgroundColor: isDarkMode ? '#191919' : '#f9fafb',
                                                borderColor: isDarkMode ? '#333' : '#e5e7eb',
                                                opacity: forceState === 'disabled' ? 'var(--opacity-disabled)' : undefined
                                            }}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mb-4 flex items-center justify-center">
                                                <Hand className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h5 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Clickable Card</h5>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Hover or press this card to see interaction states.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Overlay/Backdrop Demo */}
                                    <div className="md:col-span-2 mt-4">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Overlay / Backdrop</h4>
                                        <div className="relative h-40 rounded-xl overflow-hidden bg-cover bg-center"
                                            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)' }}>

                                            <div className="absolute inset-0 flex items-center justify-center transition-colors"
                                                style={{ backgroundColor: `rgba(0,0,0,var(--opacity-overlay))` }}>
                                                <span className="text-white font-bold px-4 py-2 border border-white/50 rounded-lg backdrop-blur-sm">
                                                    Text on Overlay
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 text-center">
                                            Current Overlay Opacity: {opacity.overlay}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </section>
                        <StatusMessage message="설정하신 상호작용 스타일이 프리뷰에 즉시 반영됩니다." />
                    </div>
                </div>
            </div>
        </div>
    );
}

