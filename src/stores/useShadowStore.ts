import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShadowLayer {
    id: string;
    name: string;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
    description: string;
}

interface ShadowState {
    layers: ShadowLayer[];
    selectedLayerId: string;
    updateLayer: (id: string, updates: Partial<ShadowLayer>) => void;
    selectLayer: (id: string) => void;
    resetShadows: () => void;
    getShadowString: (id: string) => string;
}

const defaultLayers: ShadowLayer[] = [
    {
        id: 'layer-1',
        name: 'Layer 1 (XS)',
        x: 0,
        y: 1,
        blur: 2,
        spread: 0,
        color: '#000000',
        opacity: 0.05,
        description: 'Cards, Buttons (Low elevation)',
    },
    {
        id: 'layer-2',
        name: 'Layer 2 (SM)',
        x: 0,
        y: 1,
        blur: 3,
        spread: 0,
        color: '#000000',
        opacity: 0.1,
        description: 'Dropdowns, Popovers',
    },
    {
        id: 'layer-3',
        name: 'Layer 3 (MD)',
        x: 0,
        y: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 0.1,
        description: 'Navigation, Headers',
    },
    {
        id: 'layer-4',
        name: 'Layer 4 (LG)',
        x: 0,
        y: 10,
        blur: 15,
        spread: -3,
        color: '#000000',
        opacity: 0.1,
        description: 'Modals, Dialogs (High elevation)',
    },
    {
        id: 'layer-5',
        name: 'Layer 5 (XL)',
        x: 0,
        y: 20,
        blur: 25,
        spread: -5,
        color: '#000000',
        opacity: 0.1,
        description: 'Toasts, Floating Buttons (Highest)',
    },
];

export const useShadowStore = create<ShadowState>()(
    persist(
        (set, get) => ({
            layers: defaultLayers,
            selectedLayerId: 'layer-1',
            updateLayer: (id, updates) =>
                set((state) => ({
                    layers: state.layers.map((layer) =>
                        layer.id === id ? { ...layer, ...updates } : layer
                    ),
                })),
            selectLayer: (id) => set({ selectedLayerId: id }),
            resetShadows: () => set({ layers: defaultLayers }),
            getShadowString: (id) => {
                const layer = get().layers.find((l) => l.id === id);
                if (!layer) return 'none';

                // Convert hex color to rgba if needed, or simply string interpolation if using rgba directly?
                // Let's assume hex input for color and we manually construct rgba.
                // Actually, easiest is to use hex and opacity. But CSS shadow usually takes rgba.
                // Helper to convert hex to rgb
                const hexToRgb = (hex: string) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : { r: 0, g: 0, b: 0 };
                };

                const rgb = hexToRgb(layer.color);
                return `${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layer.opacity})`;
            }
        }),
        {
            name: 'radius-shadow-storage', // Note: name should probably be 'shadow-storage' but keeping pattern if needed. Actually 'radius-shadow' sounds like a mistake. Let's use 'shadow-storage'.
            version: 1,
        }
    )
);
