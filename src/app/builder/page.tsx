'use client';

import React, { useState, useMemo } from 'react';
import { useTokenStore, Token } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { generateScaleTokens } from '@/utils/colorGenerator';
import { Plus, Palette as PaletteIcon, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid'; // We need IDs for new tokens. Wait, uuid is not installed. Let's use simple random ID for now.

// Simple ID generator if uuid is missing
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function BuilderPage() {
    const { tokens, addToken, removeToken, getTokensByType } = useTokenStore();
    const { selectedId, selectItem } = useBuilderStore();

    // Generator State
    const [baseColor, setBaseColor] = useState('#3b82f6'); // Default Blue
    const [paletteName, setPaletteName] = useState('Brand');

    const colorTokens = getTokensByType('color');

    // Group tokens by their prefix (e.g. "Primary 500" -> "Primary")
    // We assume naming convention is "Prefix Step" (Space separated)
    const groupedTokens = useMemo(() => {
        const groups: Record<string, Token[]> = {};
        colorTokens.forEach(token => {
            const prefix = token.name.split(' ')[0] || 'Other';
            if (!groups[prefix]) groups[prefix] = [];
            groups[prefix].push(token);
        });
        return groups;
    }, [colorTokens]);

    const previewTokens = useMemo(() => {
        return generateScaleTokens(baseColor, paletteName);
    }, [baseColor, paletteName]);

    const handleAddPalette = () => {
        previewTokens.forEach(pt => {
            addToken({
                id: generateId(),
                name: pt.name,
                value: pt.value,
                type: 'color',
            });
        });
        // Reset or optional notification
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">스마트 컬러 팔레트</h2>
                <p className="text-gray-500 mt-1">
                    브랜드 컬러 하나만 선택하세요. 자동으로 완벽한 스케일을 생성해드립니다.
                </p>
            </div>

            {/* 1. Palette Generator Section */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-end gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Palette Name</label>
                        <input
                            type="text"
                            value={paletteName}
                            onChange={(e) => setPaletteName(e.target.value)}
                            className="block w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                            placeholder="e.g. Primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Base Color</label>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden relative">
                                <input
                                    type="color"
                                    value={baseColor}
                                    onChange={(e) => setBaseColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 cursor-pointer border-none scale-150"
                                />
                            </div>
                            <span className="font-mono text-gray-500 uppercase">{baseColor}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddPalette}
                        className="ml-auto px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Palette to System
                    </button>
                </div>

                {/* Live Preview Scale */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                        <span>50</span>
                        <span>500 (Base)</span>
                        <span>900</span>
                    </div>
                    <div className="h-16 w-full flex rounded-xl overflow-hidden ring-1 ring-gray-200">
                        {previewTokens.map((t, i) => (
                            <div
                                key={i}
                                className="flex-1 h-full flex items-end justify-center pb-2 group relative"
                                style={{ backgroundColor: t.value }}
                            >
                                <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 bg-black/70 text-white px-1.5 py-0.5 rounded transition-opacity">
                                    {t.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Existing Palettes Section */}
            <section className="space-y-8">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <PaletteIcon className="w-5 h-5 mr-2 text-gray-500" />
                    구축된 시스템 색상 ({colorTokens.length})
                </h3>

                {Object.entries(groupedTokens).map(([groupName, groupTokens]) => (
                    <div key={groupName} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{groupName}</h4>
                            <span className="text-xs text-gray-400">{groupTokens.length} steps</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
                            {groupTokens.map((token) => {
                                const isSelected = selectedId === token.id;
                                return (
                                    <div
                                        key={token.id}
                                        onClick={() => selectItem(token.id, 'token')}
                                        className={clsx(
                                            "group relative aspect-square rounded-lg cursor-pointer transition-all",
                                            isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-10 scale-105" : "hover:scale-105 hover:shadow-lg"
                                        )}
                                        style={{ backgroundColor: token.value }}
                                    >
                                        {/* Tooltip-like Info */}
                                        <div className="absolute inset-x-0 bottom-0 p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium shadow-sm break-all">
                                                {token.name.split(' ').slice(1).join(' ') || token.name}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {colorTokens.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">아직 등록된 색상이 없습니다. 위에서 팔레트를 생성해보세요!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
