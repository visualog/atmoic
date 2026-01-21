import { create } from 'zustand';

export interface RadiusItem {
    id: string;      // e.g., 'sm', 'md'
    name: string;    // e.g., 'Small', 'Medium'
    value: number;   // px
}

interface RadiusState {
    radiusScale: RadiusItem[];
    selectedRadiusId: string | null;

    // Actions
    updateRadius: (id: string, value: number) => void;
    selectRadius: (id: string | null) => void;
    resetRadius: () => void;
}

const DEFAULT_RADIUS_SCALE: RadiusItem[] = [
    { id: 'none', name: 'None', value: 0 },
    { id: 'xs', name: 'Extra Small', value: 2 },
    { id: 'sm', name: 'Small', value: 4 },
    { id: 'md', name: 'Medium', value: 6 }, // Default Tailwind/Radix-like base
    { id: 'lg', name: 'Large', value: 8 },
    { id: 'xl', name: 'Extra Large', value: 12 },
    { id: '2xl', name: '2XL', value: 16 },
    { id: '3xl', name: '3XL', value: 24 },
    { id: 'full', name: 'Full', value: 9999 },
];

export const useRadiusStore = create<RadiusState>((set) => ({
    radiusScale: DEFAULT_RADIUS_SCALE,
    selectedRadiusId: null,

    updateRadius: (id, value) => set((state) => ({
        radiusScale: state.radiusScale.map((item) =>
            item.id === id ? { ...item, value } : item
        )
    })),

    selectRadius: (id) => set({ selectedRadiusId: id }),

    resetRadius: () => set({
        radiusScale: DEFAULT_RADIUS_SCALE
    }),
}));
