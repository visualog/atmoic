'use client';

import { create } from 'zustand';

export interface SpacingItem {
    id: string;
    name: string;
    value: number; // px
    usage: string;
}

interface SpacingState {
    baseUnit: number; // 4 or 8
    spacingScale: SpacingItem[];
    selectedSpacingId: string | null;

    // Actions
    setBaseUnit: (unit: number) => void;
    updateSpacingItem: (id: string, value: number) => void;
    selectSpacingItem: (id: string | null) => void;
    generateScale: (unit: number) => void;
    resetScale: () => void;
}

const DEFAULT_SCALE_8: SpacingItem[] = [
    { id: 'space-xs', name: 'Extra Small', value: 4, usage: '매우 좁은 간격, 아이콘 내부' },
    { id: 'space-sm', name: 'Small', value: 8, usage: '좁은 여백, 요소 간 간격' },
    { id: 'space-md', name: 'Medium', value: 16, usage: '기본 여백, 컴포넌트 내부' },
    { id: 'space-lg', name: 'Large', value: 24, usage: '넓은 여백, 섹션 내부' },
    { id: 'space-xl', name: 'Extra Large', value: 32, usage: '매우 넓은 여백, 섹션 간격' },
    { id: 'space-2xl', name: '2XL', value: 48, usage: '레이아웃 여백' },
    { id: 'space-3xl', name: '3XL', value: 64, usage: '큰 레이아웃 여백' },
];

const DEFAULT_SCALE_4: SpacingItem[] = [
    { id: 'space-2xs', name: '2XS', value: 4, usage: '최소 간격' },
    { id: 'space-xs', name: 'Extra Small', value: 8, usage: '아이콘/작은 요소' },
    { id: 'space-sm', name: 'Small', value: 12, usage: '좁은 요소 간격' },
    { id: 'space-md', name: 'Medium', value: 16, usage: '기본 컴포넌트 여백' },
    { id: 'space-lg', name: 'Large', value: 20, usage: '적당한 섹션 여백' },
    { id: 'space-xl', name: 'Extra Large', value: 24, usage: '넓은 섹션 여백' },
    { id: 'space-2xl', name: '2XL', value: 32, usage: '대형 섹션 여백' },
    { id: 'space-3xl', name: '3XL', value: 40, usage: '레이아웃 핵심 여백' },
];

export const useSpacingStore = create<SpacingState>((set) => ({
    baseUnit: 4,
    spacingScale: DEFAULT_SCALE_4,
    selectedSpacingId: null,

    setBaseUnit: (unit) => set({ baseUnit: unit }),

    updateSpacingItem: (id, value) => set((state) => ({
        spacingScale: state.spacingScale.map((item) =>
            item.id === id ? { ...item, value } : item
        )
    })),

    selectSpacingItem: (id) => set({ selectedSpacingId: id }),

    generateScale: (unit) => set((state) => {
        const multipliers = [1, 2, 3, 4, 6, 8, 10, 12, 16];
        const newScale = multipliers.map((m, i) => ({
            id: `space-${i}`,
            name: `Step ${i + 1}`,
            value: unit * m,
            usage: i === 0 ? 'Base Unit' : `${m}x Base Unit`,
        }));
        return {
            baseUnit: unit,
            spacingScale: newScale
        };
    }),

    resetScale: () => set((state) => ({
        spacingScale: state.baseUnit === 8 ? DEFAULT_SCALE_8 : DEFAULT_SCALE_4
    })),
}));
