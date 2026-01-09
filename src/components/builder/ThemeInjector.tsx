import React, { useMemo } from 'react';
import { useTokenStore, Token } from '@/stores/useTokenStore';

interface ThemeInjectorProps {
    children: React.ReactNode;
    className?: string;
    customTokens?: Token[];
}

export default function ThemeInjector({ children, className, customTokens }: ThemeInjectorProps) {
    const { tokens: storeTokens } = useTokenStore();

    // Use custom tokens if provided, otherwise fallback to store tokens
    const activeTokens = customTokens || storeTokens;

    const cssVariables = useMemo(() => {
        const variables: Record<string, string> = {};

        activeTokens.forEach(token => {
            // Create variable name from token name
            // e.g. "Primary 500" -> "--primary-500"
            // e.g. "Brand Color" -> "--brand-color"
            // e.g. "Primary 1" -> "--primary-1"
            const varName = '--' + token.name.toLowerCase().replace(/\s+/g, '-');
            variables[varName] = token.value;
        });

        return variables;
    }, [activeTokens]);

    return (
        <div style={cssVariables as React.CSSProperties} className={className}>
            {children}
        </div>
    );
}
