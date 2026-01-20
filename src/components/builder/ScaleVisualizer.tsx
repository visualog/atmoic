import { useState } from 'react';
import { clsx } from 'clsx';
import { useBuilderStore } from '@/stores/useBuilderStore';

interface ScaleVisualizerProps {
    scale: Record<string, string>; // e.g. blue: { blue1: '...', blue2: '...' }
    colorName: string; // e.g. "blue"
    onSelect?: (index: number) => void;
    selectedIndex?: number | null;
}

export default function ScaleVisualizer({ scale, colorName, onSelect, selectedIndex }: ScaleVisualizerProps) {
    const { isDarkMode } = useBuilderStore();
    // Extract values into an array [step1, step2, ... step12]
    const steps = Object.values(scale);

    const groups = [
        { label: 'Backgrounds', range: [0, 1], cols: 2 }, // Steps 1-2
        { label: 'Interactive components', range: [2, 4], cols: 3 }, // Steps 3-5
        { label: 'Borders and separators', range: [5, 7], cols: 3 }, // Steps 6-8
        { label: 'Solid colors', range: [8, 9], cols: 2 }, // Steps 9-10
        { label: 'Accessible text', range: [10, 11], cols: 2 }, // Steps 11-12
    ];

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[800px] space-y-2">
                {/* Header Labels */}
                <div className={`flex text-xs font-medium text-center border-b pb-2 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                    {groups.map((group, idx) => {
                        const isGroupHovered = hoveredIndex !== null && hoveredIndex >= group.range[0] && hoveredIndex <= group.range[1];

                        return (
                            <div
                                key={idx}
                                className="flex-1 transition-colors duration-200"
                                style={{
                                    flexGrow: group.cols,
                                    color: isGroupHovered
                                        ? (isDarkMode ? '#e5e7eb' : '#374151') // gray-200 : gray-700
                                        : (isDarkMode ? '#6b7280' : '#9ca3af'), // gray-500 : gray-400
                                    fontWeight: isGroupHovered ? 700 : 500
                                }}
                            >
                                {group.label}
                            </div>
                        );
                    })}
                </div>

                {/* Step Numbers */}
                <div className="flex text-[10px] font-mono text-center">
                    {steps.map((_, i) => {
                        const isHovered = i === hoveredIndex;
                        const isSelected = i === selectedIndex;

                        return (
                            <div
                                key={i}
                                className="flex-1 transition-all duration-200"
                                style={{
                                    color: isSelected
                                        ? '#2563eb' // blue-600
                                        : (isHovered
                                            ? (isDarkMode ? '#d1d5db' : '#4b5563') // gray-300 : gray-600
                                            : (isDarkMode ? '#4b5563' : '#d1d5db')), // gray-600 : gray-300
                                    fontWeight: isHovered || isSelected ? 700 : 400,
                                    transform: isHovered || isSelected ? 'scale(1.2)' : 'scale(1)'
                                }}
                            >
                                {i + 1}
                            </div>
                        );
                    })}
                </div>

                {/* Color Blocks */}
                <div className="flex h-16 rounded-xl overflow-hidden">
                    {steps.map((value, i) => {
                        const isSelected = i === selectedIndex;

                        return (
                            <button
                                key={i}
                                className={clsx(
                                    "flex-1 h-full flex items-end justify-center pb-2 group relative transition-all duration-200 focus:outline-none",
                                    isSelected && "z-10 ring-2 ring-blue-500 ring-offset-2 rounded-sm"
                                )}
                                style={{ backgroundColor: value }}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => onSelect?.(i)}
                                title={`${colorName} ${i + 1}: ${value}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
