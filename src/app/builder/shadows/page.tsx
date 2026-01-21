'use client';

import React from 'react';
import { useShadowStore } from '@/stores/useShadowStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTokenStore } from '@/stores/useTokenStore';
import ShadowVisualizer from '@/components/builder/ShadowVisualizer';
import StatusMessage from '@/components/builder/StatusMessage';
import { RotateCcw, Box, Layers, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShadowsPage() {
    const { layers, selectedLayerId, updateLayer, resetShadows, getShadowString } = useShadowStore();
    const { isDarkMode } = useBuilderStore();
    const { getTokensByType } = useTokenStore();

    const selectedLayer = layers.find(l => l.id === selectedLayerId);

    // Get primary color for accents
    const tokens = getTokensByType('color');
    const primaryColor = tokens.find(t => t.name === 'Primary 9')?.value || '#3b82f6';

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

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>그림자</h2>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        UI 요소의 깊이감(Elevation)을 정의하여 계층 구조를 시각화하세요.
                    </p>
                </div>
                <button
                    onClick={resetShadows}
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
                {/* LEFT COLUMN: Configuration & Fine Tuning */}
                <div className="lg:col-span-4 space-y-8">
                    <section className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                        <ShadowVisualizer />
                    </section>

                    {selectedLayer ? (
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-blue-500/30' : 'bg-blue-50/30 ring-blue-200'}`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    "{selectedLayer.name}" 속성 편집
                                </h4>
                                <span className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-wider">Property Editor</span>
                            </div>

                            <div className="space-y-5">
                                {renderSlider("Offset X (px)", selectedLayer.x, (v) => updateLayer(selectedLayer.id, { x: v }), -50, 50)}
                                {renderSlider("Offset Y (px)", selectedLayer.y, (v) => updateLayer(selectedLayer.id, { y: v }), -50, 50)}
                                {renderSlider("Blur Radius (px)", selectedLayer.blur, (v) => updateLayer(selectedLayer.id, { blur: v }), 0, 100)}
                                {renderSlider("Spread Radius (px)", selectedLayer.spread, (v) => updateLayer(selectedLayer.id, { spread: v }), -50, 50)}
                                {renderSlider("Opacity", selectedLayer.opacity, (v) => updateLayer(selectedLayer.id, { opacity: v }), 0, 1, 0.01)}

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                    <div className="mb-2">
                                        <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            Color
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={selectedLayer.color}
                                            onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                        />
                                        <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {selectedLayer.color}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ) : (
                        <div className={`p-8 text-center rounded-2xl border border-dashed ${isDarkMode ? 'border-[#333] text-gray-500' : 'border-gray-300 text-gray-400'}`}>
                            레이어를 선택하여 속성을 편집하세요.
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Live Preview */}
                <div className="lg:col-span-8 sticky top-6 space-y-4">
                    <section className={`rounded-2xl ring-1 ring-inset transition-colors overflow-hidden ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-gray-50 ring-gray-200'}`}>
                        <div className="flex items-center justify-between p-6 pb-0">
                            <div className="flex items-center gap-2 text-purple-500">
                                <Layers className="w-5 h-5" />
                                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>실시간 미리보기</h3>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Simulated
                            </span>
                        </div>

                        {/* Preview Container */}
                        <div className="p-6 flex flex-col items-center justify-center gap-12 min-h-[500px]">

                            {/* Example 1: Card (Layer 1) */}
                            <div
                                className={`w-full max-w-sm p-5 rounded-xl ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}
                                style={{
                                    boxShadow: 'var(--shadow-layer-1)',
                                    transition: 'box-shadow 0.2s'
                                }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Box className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Basic Card</h5>
                                        <p className="text-xs text-gray-500">Layer 1 (Low Elevation)</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    이 카드는 <code>var(--shadow-layer-1)</code> 변수를 직접 사용합니다. 파운데이션 시스템이 주입한 변수가 실제 컴포넌트에 어떻게 적용되는지 확인하세요.
                                </p>
                            </div>

                            {/* Example 2: Popover/Dropdown (Layer 2) */}
                            <div className="relative">
                                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-[#222] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
                                    Open Menu
                                </button>
                                {/* Simulated Dropdown */}
                                <div
                                    className={`absolute top-full left-0 mt-2 w-48 rounded-lg p-1.5 z-10 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}
                                    style={{ boxShadow: 'var(--shadow-layer-2)' }}
                                >
                                    {['Profile', 'Settings', 'Logout'].map((item) => (
                                        <div key={item} className={`px-3 py-2 rounded text-sm cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-50'}`}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Example 3: Modal (Layer 4) */}
                            <div
                                className={`w-full max-w-[280px] p-6 rounded-2xl text-center relative ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}
                                style={{ boxShadow: 'var(--shadow-layer-4)' }}
                            >
                                <div className="absolute top-3 right-3 text-gray-400">
                                    <X className="w-4 h-4" />
                                </div>
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 mx-auto mb-3 flex items-center justify-center">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delete Item?</h4>
                                <p className="text-xs text-gray-500 mb-4">
                                    <code>var(--shadow-layer-4)</code>가 적용된 모달 예시입니다. 고도가 높은 요소는 더 넓고 부드러운 그림자를 가집니다.
                                </p>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500">Cancel</button>
                                    <button className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-red-500 text-white shadow-sm">Delete</button>
                                </div>
                                <div className="mt-4 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                    Layer 4 (High Elevation)
                                </div>
                            </div>

                        </div>
                    </section>
                    <StatusMessage message="설정하신 그림자가 프리뷰에 즉시 반영됩니다." />
                </div>
            </div>
        </div>
    );
}
