'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { useRadiusStore, RadiusItem } from '@/stores/useRadiusStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTokenStore } from '@/stores/useTokenStore';

export default function RadiusVisualizer() {
    const { radiusScale, selectedRadiusId, selectRadius } = useRadiusStore();
    const { isDarkMode } = useBuilderStore();
    const { getTokensByType } = useTokenStore();

    // Get primary color from tokens
    const tokens = getTokensByType('color');
    const primaryColor = tokens.find(t => t.name === 'Primary 9')?.value || tokens.find(t => t.name === 'Primary 6')?.value || '#3b82f6';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    곡률 스케일 (Radius Scale)
                </span>
                <div className="flex items-center text-[10px] text-gray-500 gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm ring-1 ring-inset ring-blue-500/20" style={{ backgroundColor: `${primaryColor}20` }}></div>
                        <span>Preview</span>
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl ring-1 ring-inset ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
                <div className="overflow-hidden p-[1px] -m-[1px]">
                    {radiusScale.map((item, index) => (
                        <RadiusItemRow
                            key={item.id}
                            item={item}
                            isSelected={selectedRadiusId === item.id}
                            isLast={index === radiusScale.length - 1}
                            onSelect={() => selectRadius(item.id)}
                            isDarkMode={isDarkMode}
                            primaryColor={primaryColor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function RadiusItemRow({
    item,
    isSelected,
    isLast,
    onSelect,
    isDarkMode,
    primaryColor
}: {
    item: RadiusItem;
    isSelected: boolean;
    isLast: boolean;
    onSelect: () => void;
    isDarkMode: boolean;
    primaryColor: string;
}) {
    const [isHovered, setIsHovered] = React.useState(false);
    const borderColor = isDarkMode ? '#1a1a1a' : '#eceef2';

    return (
        <div
            onClick={onSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative flex items-center p-4 cursor-pointer transition-all duration-200 ${isSelected
                ? ''
                : isDarkMode ? 'hover:bg-[#222222]' : 'hover:bg-gray-50'
                }`}
            style={{
                backgroundColor: isSelected
                    ? (isDarkMode ? `${primaryColor}15` : `${primaryColor}08`)
                    : undefined,
                boxShadow: isLast ? 'none' : `inset 0 -1px 0 0 ${borderColor}`
            }}
        >
            {/* Hover/Selection Highlight Overlay */}
            {(isSelected || isHovered) && (
                <div
                    className="absolute inset-0 z-10 pointer-events-none ring-1 ring-inset transition-opacity duration-200"
                    style={{
                        boxShadow: `inset 0 0 0 1.5px ${isSelected ? `${primaryColor}` : `${primaryColor}90`}`
                    }}
                />
            )}

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 z-20" style={{ backgroundColor: primaryColor }}></div>
            )}

            {/* Info Section */}
            <div className="w-40 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-[#2e2e2e] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {item.id.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-medium" style={{ color: primaryColor }}>
                        {item.value}px
                    </span>
                </div>
            </div>

            {/* Visualization Box */}
            <div className="flex-1 px-4 flex justify-end">
                <div
                    className={`h-12 w-12 border-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-[#222222]' : 'border-gray-300 bg-gray-50'}`}
                    style={{
                        borderRadius: `${item.value}px`,
                        borderColor: isSelected || isHovered ? primaryColor : undefined,
                        backgroundColor: isSelected ? `${primaryColor}20` : undefined
                    }}
                ></div>
            </div>
        </div>
    );
}
