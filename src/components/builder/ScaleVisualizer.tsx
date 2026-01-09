import React from 'react';
import { clsx } from 'clsx';

interface ScaleVisualizerProps {
    scale: Record<string, string>; // e.g. blue: { blue1: '...', blue2: '...' }
    colorName: string; // e.g. "blue"
}

export default function ScaleVisualizer({ scale, colorName }: ScaleVisualizerProps) {
    // Extract values into an array [step1, step2, ... step12]
    const steps = Object.values(scale);

    const groups = [
        { label: 'Backgrounds', range: [0, 1], cols: 2 }, // Steps 1-2
        { label: 'Interactive components', range: [2, 4], cols: 3 }, // Steps 3-5
        { label: 'Borders and separators', range: [5, 7], cols: 3 }, // Steps 6-8
        { label: 'Solid colors', range: [8, 9], cols: 2 }, // Steps 9-10
        { label: 'Accessible text', range: [10, 11], cols: 2 }, // Steps 11-12
    ];

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[800px] space-y-2">
                {/* Header Labels */}
                <div className="flex text-xs text-gray-400 font-medium text-center border-b border-gray-100 pb-2">
                    {groups.map((group, idx) => (
                        <div key={idx} className="flex-1" style={{ flexGrow: group.cols }}>
                            {group.label}
                        </div>
                    ))}
                </div>

                {/* Step Numbers */}
                <div className="flex text-[10px] text-gray-300 font-mono text-center">
                    {steps.map((_, i) => (
                        <div key={i} className="flex-1">
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Color Blocks */}
                <div className="flex h-16 rounded-xl overflow-hidden">
                    {steps.map((value, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full flex items-end justify-center pb-2 group relative"
                            style={{ backgroundColor: value }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded transition-opacity z-10 whitespace-nowrap">
                                {colorName}{i + 1}: {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
