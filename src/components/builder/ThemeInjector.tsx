import React, { useMemo } from 'react';
import { useTokenStore, Token } from '@/stores/useTokenStore';
import { useRadiusStore } from '@/stores/useRadiusStore';
import { useShadowStore } from '@/stores/useShadowStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useInteractionStore } from '@/stores/useInteractionStore';

interface ThemeInjectorProps {
    children: React.ReactNode;
    className?: string;
    customTokens?: Token[];
}

export default function ThemeInjector({ children, className, customTokens }: ThemeInjectorProps) {
    const { tokens: storeTokens } = useTokenStore();
    const { radiusScale } = useRadiusStore();
    const { layers: shadowLayers } = useShadowStore();
    const { breakpoints, activeCheckpoint } = useLayoutStore();
    const { opacity } = useInteractionStore();

    // Use custom tokens if provided, otherwise fallback to store tokens
    const activeTokens = customTokens || storeTokens;

    const cssVariables = useMemo(() => {
        const variables: Record<string, string> = {};

        // Inject Token Variables
        activeTokens.forEach(token => {
            const varName = '--' + token.name.toLowerCase().replace(/\s+/g, '-');
            variables[varName] = token.value;
        });

        // Inject Radius Variables
        radiusScale.forEach(item => {
            const varName = `--radius-${item.id}`;
            variables[varName] = `${item.value}px`;
        });

        // Inject Shadow Variables
        shadowLayers.forEach(layer => {
            const varName = `--shadow-${layer.id}`;
            const hexToRgb = (hex: string) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 0, g: 0, b: 0 };
            };
            const rgb = hexToRgb(layer.color);
            // Optimization for better visibility
            variables[varName] = `${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layer.opacity})`;
        });

        // Inject Layout Variables
        const currentLayout = breakpoints[activeCheckpoint];
        variables['--grid-columns'] = currentLayout.columns.toString();
        variables['--grid-gutter'] = `${currentLayout.gutter}px`;
        variables['--grid-margin'] = `${currentLayout.margin}px`;

        // Inject Interaction Variables
        variables['--opacity-disabled'] = opacity.disabled.toString();
        variables['--opacity-hover'] = opacity.hover.toString();
        variables['--opacity-pressed'] = opacity.pressed.toString();
        variables['--opacity-overlay'] = opacity.overlay.toString();

        return variables;
    }, [activeTokens, radiusScale, shadowLayers, breakpoints, activeCheckpoint, opacity]);

    return (
        <div style={cssVariables as React.CSSProperties} className={className}>
            {children}
        </div>
    );
}
