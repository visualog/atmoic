'use client';

import React from 'react';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useBuilderStore } from '@/stores/useBuilderStore';

interface GridOverlayProps {
    className?: string;
    show?: boolean;
}

export default function GridOverlay({ className, show }: GridOverlayProps) {
    const { breakpoints, activeCheckpoint, isOverlayVisible } = useLayoutStore();
    const { isDarkMode } = useBuilderStore();

    // Allow prop override or store state
    const isVisible = show !== undefined ? show : isOverlayVisible;

    if (!isVisible) return null;

    const config = breakpoints[activeCheckpoint];

    // Create columns array
    const columns = Array.from({ length: config.columns });

    return (
        <div
            className={`absolute inset-0 z-50 pointer-events-none flex ${className || ''}`}
            style={{
                paddingLeft: `${config.margin}px`,
                paddingRight: `${config.margin}px`,
                gap: `${config.gutter}px`,
            }}
        >
            {columns.map((_, i) => (
                <div
                    key={i}
                    className="flex-1 h-full"
                    style={{
                        backgroundColor: isDarkMode ? 'rgba(255, 100, 100, 0.05)' : 'rgba(255, 0, 0, 0.05)',
                        borderLeft: isDarkMode ? '1px solid rgba(255, 100, 100, 0.1)' : '1px solid rgba(255, 0, 0, 0.1)',
                        borderRight: isDarkMode ? '1px solid rgba(255, 100, 100, 0.1)' : '1px solid rgba(255, 0, 0, 0.1)',
                    }}
                />
            ))}
        </div>
    );
}
