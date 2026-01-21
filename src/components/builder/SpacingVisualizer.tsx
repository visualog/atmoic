'use client';

import React from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Info } from 'lucide-react';
import { useSpacingStore, SpacingItem } from '@/stores/useSpacingStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTokenStore } from '@/stores/useTokenStore';

export default function SpacingVisualizer() {
    const { spacingScale, selectedSpacingId, selectSpacingItem } = useSpacingStore();
    const { isDarkMode } = useBuilderStore();
    const { getTokensByType } = useTokenStore();

    // Get primary color from tokens
    const tokens = getTokensByType('color');
    const primaryColor = tokens.find(t => t.id === 'primary-600')?.value || tokens.find(t => t.id === 'primary-500')?.value || '#3b82f6';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    간격 스케일 (Spacing Scale)
                </span>
                <div className="flex items-center text-[10px] text-gray-500 gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm border" style={{ backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}30` }}></div>
                        <span>Visualization</span>
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl ring-1 ring-inset ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                <div className="overflow-hidden">
                    {spacingScale.map((item) => (
                        <SpacingItemRow
                            key={item.id}
                            item={item}
                            isSelected={selectedSpacingId === item.id}
                            onSelect={() => selectSpacingItem(item.id)}
                            isDarkMode={isDarkMode}
                            primaryColor={primaryColor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function SpacingItemRow({
    item,
    isSelected,
    onSelect,
    isDarkMode,
    primaryColor
}: {
    item: SpacingItem;
    isSelected: boolean;
    onSelect: () => void;
    isDarkMode: boolean;
    primaryColor: string;
}) {
    // rem value calculation (assuming 16px base)
    const remValue = (item.value / 16).toFixed(3).replace(/\.?0+$/, '');

    return (
        <div
            onClick={onSelect}
            className={`group relative flex items-center p-4 cursor-pointer transition-all duration-200 border-b last:border-b-0 ${isSelected
                ? ''
                : isDarkMode ? 'hover:bg-[#222222] border-[#222222]' : 'hover:bg-gray-50 border-gray-100'
                }`}
            style={isSelected ? { backgroundColor: isDarkMode ? `${primaryColor}15` : `${primaryColor}08` } : {}}
        >
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: primaryColor }}></div>
            )}

            {/* Info Section */}
            <div className="w-40 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-[#2e2e2e] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {item.id.replace('space-', '').toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-medium" style={{ color: primaryColor }}>
                        {item.value}px
                    </span>
                    <span className={`text-[10px] text-gray-500`}>
                        {remValue}rem
                    </span>
                </div>
            </div>

            {/* Visualization Bar */}
            <div className="flex-1 px-4">
                <div className="relative h-6 flex items-center">
                    <div
                        className={`h-full rounded transition-all duration-300 ${isSelected
                            ? 'ring-inset ring-1'
                            : 'ring-inset ring-1'
                            }`}
                        style={{
                            width: `${Math.min(item.value * 2, 100)}%`,
                            maxWidth: `${item.value}px`,
                            backgroundColor: isSelected ? `${primaryColor}40` : `${primaryColor}15`,
                            borderColor: isSelected ? `${primaryColor}60` : `${primaryColor}20`,
                            boxShadow: isSelected ? `0 0 0 2px ${primaryColor}10` : 'none'
                        }}
                    ></div>

                    {/* Size Label on Bar for larger values */}
                    {item.value > 40 && (
                        <span className="absolute left-3 text-[10px] font-mono font-semibold" style={{ color: primaryColor }}>
                            {item.value}
                        </span>
                    )}
                </div>
            </div>

            {/* Usage Tooltip (Visible on hover or selected) */}
            <div className={`pl-4 flex-shrink-0 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/5 dark:bg-white/5">
                    <Info className="w-3 h-3 text-gray-400" />
                    <span className="text-[10px] text-gray-500 max-w-[150px] truncate">
                        {item.usage}
                    </span>
                </div>
            </div>
        </div>
    );
}
