'use client';

import React, { useEffect, useMemo } from 'react';
import { useTypographyStore, FONT_FAMILIES } from '@/stores/useTypographyStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTokenStore } from '@/stores/useTokenStore';
import TypeScaleVisualizer from '@/components/builder/TypeScaleVisualizer';
import { Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function TypographyPage() {
    const { selectedFont, setSelectedFont, typeScale, resetTypeScale, generateTypeScale } = useTypographyStore();
    const { isDarkMode } = useBuilderStore();
    const { addToken, removeToken, getTokensByType } = useTokenStore();
    const [viewport, setViewport] = React.useState<'mobile' | 'desktop'>('desktop');

    const [baseSize, setBaseSize] = React.useState(16);
    const [ratio, setRatio] = React.useState(1.25);
    const [isConfirming, setIsConfirming] = React.useState(false);

    // Get primary color from tokens
    const tokens = getTokensByType('color');
    const primaryColor = tokens.find(t => t.id === 'primary-600')?.value || tokens.find(t => t.id === 'primary-500')?.value || '#3b82f6';

    // Generate typography tokens
    const typographyTokens = useMemo(() => {
        return typeScale.map(item => ({
            name: item.name,
            value: `${item.size}px/${item.lineHeight}/${item.weight}`,
            type: 'typography' as const,
            description: item.usage,
        }));
    }, [typeScale]);

    // Auto-save: Automatically apply typography tokens when settings change
    useEffect(() => {
        const timer = setTimeout(() => {
            // Remove existing typography tokens
            const existingIds = getTokensByType('typography').map(t => t.id);
            existingIds.forEach(id => removeToken(id));

            // Add new typography tokens
            typographyTokens.forEach(t => {
                addToken({ ...t, id: generateId() });
            });

            // Also save font family
            addToken({
                id: 'font-family-primary',
                name: 'Font Family Primary',
                value: selectedFont.value,
                type: 'typography',
                description: selectedFont.name,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [typographyTokens, selectedFont, getTokensByType, removeToken, addToken]);

    return (
        <div className="pb-20">
            {/* Page Header */}
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>타이포그래피 설계</h2>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        폰트 패밀리와 타입 스케일을 선택하여 일관된 타이포그래피 시스템을 구축하세요.
                    </p>
                </div>
                <button
                    onClick={resetTypeScale}
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

                    {/* 1. Font Family Selection */}
                    <section className={`rounded-2xl border p-6 transition-colors ${isDarkMode ? 'bg-[#191919] border-[#222222]' : 'bg-white border-gray-200'
                        }`}>
                        <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            폰트 패밀리
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {FONT_FAMILIES.map((font) => {
                                const isSelected = selectedFont.name === font.name;

                                return (
                                    <motion.button
                                        key={font.name}
                                        onClick={() => setSelectedFont(font)}
                                        className={`relative p-4 rounded-xl ring-1 ring-inset text-left transition-colors ${isSelected
                                            ? isDarkMode
                                                ? 'bg-blue-600/20 ring-blue-500/50'
                                                : ''
                                            : isDarkMode
                                                ? 'bg-[#222222] ring-[#2e2e2e] hover:ring-[#3e3e3e]'
                                                : 'bg-gray-50 ring-gray-200 hover:ring-gray-300'
                                            }`}
                                        style={isSelected && !isDarkMode ? { backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}50` } : {}}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {font.name}
                                            </span>
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                    >
                                                        <Check className="w-4 h-4" style={{ color: primaryColor }} />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <p
                                            style={{ fontFamily: font.value }}
                                            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                        >
                                            가나다라 ABC 123
                                        </p>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </section>

                    {/* 2. Modular Scale Generator */}
                    <section className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            자동 스케일 생성 (Modular Scale)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 items-end">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    기준 크기 (Base Size)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={baseSize}
                                        onChange={(e) => setBaseSize(Number(e.target.value))}
                                        className={`w-full h-11 px-3 rounded-lg ring-1 ring-inset focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e] text-white' : 'bg-gray-50 ring-gray-200 text-gray-900'
                                            }`}
                                    />
                                    <span className="absolute right-3 top-3.5 text-xs text-gray-500">px</span>
                                </div>
                            </div>

                            <div className="relative">
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    비율 (Scale Ratio)
                                </label>
                                <div className="relative">
                                    <select
                                        value={ratio}
                                        onChange={(e) => setRatio(parseFloat(e.target.value))}
                                        className={`w-full h-11 px-3 pr-10 rounded-lg ring-1 ring-inset appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e] text-white' : 'bg-gray-50 ring-gray-200 text-gray-900'
                                            }`}
                                    >
                                        <option value="1.067">1.067 (Minor Second)</option>
                                        <option value="1.125">1.125 (Major Second)</option>
                                        <option value="1.200">1.200 (Minor Third)</option>
                                        <option value="1.250">1.250 (Major Third)</option>
                                        <option value="1.333">1.333 (Perfect Fourth)</option>
                                        <option value="1.414">1.414 (Augmented Fourth)</option>
                                        <option value="1.500">1.500 (Perfect Fifth)</option>
                                        <option value="1.618">1.618 (Golden Ratio)</option>
                                    </select>
                                    <div className="absolute right-3 top-3.5 pointer-events-none">
                                        <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 opacity-0">
                                    Action
                                </label>
                                <button
                                    onClick={() => {
                                        if (isConfirming) {
                                            generateTypeScale(baseSize, ratio);
                                            setIsConfirming(false);
                                        } else {
                                            setIsConfirming(true);
                                            setTimeout(() => setIsConfirming(false), 3000);
                                        }
                                    }}
                                    className={`h-11 px-6 font-medium rounded-lg transition-all whitespace-nowrap ${isConfirming
                                        ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {isConfirming ? '정말 생성할까요?' : '생성하기 (Generate)'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 3. Type Scale */}
                    <section className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                타입 스케일
                            </h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-[#222222] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                {typeScale.length}개 항목
                            </span>
                        </div>
                        <TypeScaleVisualizer />
                    </section>

                </div>

                {/* RIGHT COLUMN: Live Preview */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8 space-y-4">
                        <div className={`rounded-2xl ring-1 ring-inset p-6 transition-colors ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'
                            }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`} />
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Live Preview
                                    </span>
                                </div>
                                <div className={`flex items-center p-1 rounded-lg ring-1 ring-inset ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-gray-100 ring-gray-200'}`}>
                                    <button
                                        onClick={() => setViewport('desktop')}
                                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${viewport === 'desktop'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Desktop
                                    </button>
                                    <button
                                        onClick={() => setViewport('mobile')}
                                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${viewport === 'mobile'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Mobile
                                    </button>
                                </div>
                            </div>

                            <div
                                style={{
                                    fontFamily: selectedFont.value,
                                    maxWidth: viewport === 'mobile' ? '320px' : 'none',
                                    margin: viewport === 'mobile' ? '0 auto' : '0'
                                }}
                                className={`space-y-6 transition-all duration-500 ${viewport === 'mobile' ? 'scale-[0.9] sm:scale-100' : ''}`}
                            >
                                {/* 1. Card Component Sample */}
                                <div className={`rounded-xl ring-1 ring-inset p-4 ${isDarkMode ? 'bg-[#222222] ring-[#2e2e2e]' : 'bg-gray-50 ring-gray-200'}`}>
                                    <p
                                        style={{ fontSize: `${typeScale.find(t => t.id === 'heading-sm')?.size || 20}px`, fontWeight: 600, lineHeight: 1.35, letterSpacing: `${(typeScale.find(t => t.id === 'heading-sm')?.letterSpacing || 0) / 100}em` }}
                                        className={isDarkMode ? 'text-white' : 'text-gray-900'}
                                    >
                                        카드 제목
                                    </p>
                                    <p
                                        style={{ fontSize: `${typeScale.find(t => t.id === 'body-sm')?.size || 14}px`, fontWeight: 400, lineHeight: 1.6, letterSpacing: `${(typeScale.find(t => t.id === 'body-sm')?.letterSpacing || 0) / 100}em` }}
                                        className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                    >
                                        카드 본문 텍스트입니다. 타이포그래피 스케일이 적용된 모습을 확인하세요.
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span
                                            style={{
                                                fontSize: `${typeScale.find(t => t.id === 'label-md')?.size || 14}px`,
                                                fontWeight: 600,
                                                lineHeight: 1.4,
                                                letterSpacing: `${(typeScale.find(t => t.id === 'label-md')?.letterSpacing || 0) / 100}em`,
                                                backgroundColor: primaryColor
                                            }}
                                            className="px-3 py-1.5 rounded-lg text-white"
                                        >
                                            버튼
                                        </span>
                                        <span
                                            style={{ fontSize: `${typeScale.find(t => t.id === 'caption')?.size || 12}px`, fontWeight: 400, lineHeight: 1.5, letterSpacing: `${(typeScale.find(t => t.id === 'caption')?.letterSpacing || 0) / 100}em` }}
                                            className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}
                                        >
                                            3분 전
                                        </span>
                                    </div>
                                </div>

                                {/* 2. Form Element Sample */}
                                <div className="space-y-3">
                                    <div>
                                        <label
                                            style={{ fontSize: `${typeScale.find(t => t.id === 'label-md')?.size || 14}px`, fontWeight: 600, lineHeight: 1.4, letterSpacing: `${(typeScale.find(t => t.id === 'label-md')?.letterSpacing || 0) / 100}em` }}
                                            className={`block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                        >
                                            이메일
                                        </label>
                                        <div className={`px-3 py-2 rounded-lg ring-1 ring-inset ${isDarkMode ? 'bg-[#2e2e2e] ring-[#3e3e3e] text-gray-400' : 'bg-white ring-gray-300 text-gray-400'}`}>
                                            <span style={{ fontSize: `${typeScale.find(t => t.id === 'body-md')?.size || 16}px`, fontWeight: 400, letterSpacing: `${(typeScale.find(t => t.id === 'body-md')?.letterSpacing || 0) / 100}em` }}>
                                                example@email.com
                                            </span>
                                        </div>
                                        <p
                                            style={{ fontSize: `${typeScale.find(t => t.id === 'micro')?.size || 11}px`, fontWeight: 400, lineHeight: 1.5, letterSpacing: `${(typeScale.find(t => t.id === 'micro')?.letterSpacing || 0) / 100}em` }}
                                            className={`mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                                        >
                                            유효한 이메일 주소를 입력하세요.
                                        </p>
                                    </div>
                                </div>

                                {/* 3. Table Header / Tags Sample */}
                                <div className={`rounded-lg ring-1 ring-inset overflow-hidden ${isDarkMode ? 'ring-[#2e2e2e]' : 'ring-gray-200'}`}>
                                    <div className={`px-4 py-2 ${isDarkMode ? 'bg-[#2e2e2e]' : 'bg-gray-100'}`}>
                                        <div className="grid grid-cols-[1fr_60px_100px] gap-4 items-center">
                                            <span
                                                style={{ fontSize: `${typeScale.find(t => t.id === 'label-sm')?.size || 12}px`, fontWeight: 600, lineHeight: 1.4, letterSpacing: `${(typeScale.find(t => t.id === 'label-sm')?.letterSpacing || 0) / 100}em` }}
                                                className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                                            >
                                                이름
                                            </span>
                                            <span
                                                style={{ fontSize: `${typeScale.find(t => t.id === 'label-sm')?.size || 12}px`, fontWeight: 600, lineHeight: 1.4, letterSpacing: `${(typeScale.find(t => t.id === 'label-sm')?.letterSpacing || 0) / 100}em` }}
                                                className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                                            >
                                                상태
                                            </span>
                                            <span
                                                style={{ fontSize: `${typeScale.find(t => t.id === 'label-sm')?.size || 12}px`, fontWeight: 600, lineHeight: 1.4, letterSpacing: `${(typeScale.find(t => t.id === 'label-sm')?.letterSpacing || 0) / 100}em` }}
                                                className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                            >
                                                날짜
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-3 ${isDarkMode ? 'bg-[#222222]' : 'bg-white'}`}>
                                        <div className="grid grid-cols-[1fr_60px_100px] gap-4 items-center">
                                            <span
                                                style={{ fontSize: `${typeScale.find(t => t.id === 'body-sm')?.size || 14}px`, fontWeight: 400, letterSpacing: `${(typeScale.find(t => t.id === 'body-sm')?.letterSpacing || 0) / 100}em` }}
                                                className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                                            >
                                                프로젝트 A
                                            </span>
                                            <span
                                                style={{ fontSize: `${typeScale.find(t => t.id === 'label-sm')?.size || 12}px`, fontWeight: 600, letterSpacing: `${(typeScale.find(t => t.id === 'label-sm')?.letterSpacing || 0) / 100}em` }}
                                                className="w-max px-2 py-0.5 rounded bg-green-500/20 text-green-500"
                                            >
                                                완료
                                            </span>
                                            <span
                                                style={{ fontSize: `${typeScale.find(t => t.id === 'caption')?.size || 12}px`, fontWeight: 400, letterSpacing: `${(typeScale.find(t => t.id === 'caption')?.letterSpacing || 0) / 100}em` }}
                                                className={`text-right ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                                            >
                                                2024.01.20
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`text-xs px-2 p-2 rounded ring-1 ring-inset flex items-center gap-2 transition-colors ${isDarkMode
                            ? 'bg-[#222222] ring-[#2e2e2e] text-green-400'
                            : 'bg-green-50 ring-green-100 text-green-600'
                            }`}>
                            <Check className="w-3 h-3" />
                            선택하신 폰트가 프리뷰에 즉시 반영됩니다.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
