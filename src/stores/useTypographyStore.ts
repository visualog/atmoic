'use client';

import { create } from 'zustand';

// 1. Type Scale Item Definition
export interface TypeScaleItem {
    id: string;          // e.g., "display-xl", "body-md"
    name: string;        // e.g., "Display XL", "Body MD"
    size: number;        // in pixels
    lineHeight: number;  // unitless multiplier
    letterSpacing: number; // css letter-spacing in percent (e.g. -2 for -2%)
    weight: number;      // 400, 600, etc.
    usage: string;       // e.g., "랜딩 메인 히어로"
}

// 2. Font Family Definition
export interface FontFamily {
    name: string;        // e.g., "Pretendard"
    value: string;       // e.g., "'Pretendard Variable', Pretendard, -apple-system, ..."
    isDefault?: boolean;
}

// 3. Available Font Families
export const FONT_FAMILIES: FontFamily[] = [
    {
        name: 'Pretendard',
        value: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', sans-serif",
        isDefault: true
    },
    {
        name: 'Inter',
        value: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    {
        name: 'Noto Sans KR',
        value: "'Noto Sans KR', sans-serif"
    },
    {
        name: 'Spoqa Han Sans Neo',
        value: "'Spoqa Han Sans Neo', sans-serif"
    },
    {
        name: 'System UI',
        value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    }
];

// 4. Default Type Scale (User-defined)
export const DEFAULT_TYPE_SCALE: TypeScaleItem[] = [
    { id: 'display-xl', name: 'Display XL', size: 60, lineHeight: 1.1, letterSpacing: 0, weight: 600, usage: '랜딩 메인 히어로' },
    { id: 'heading-xl', name: 'Heading XL', size: 32, lineHeight: 1.25, letterSpacing: 0, weight: 600, usage: '페이지 타이틀' },
    { id: 'heading-lg', name: 'Heading LG', size: 28, lineHeight: 1.3, letterSpacing: 0, weight: 600, usage: '큰 섹션 헤더' },
    { id: 'heading-md', name: 'Heading MD', size: 24, lineHeight: 1.3, letterSpacing: 0, weight: 600, usage: '일반 섹션 헤더' },
    { id: 'heading-sm', name: 'Heading SM', size: 20, lineHeight: 1.35, letterSpacing: 0, weight: 600, usage: '카드/모듈 타이틀' },
    { id: 'body-lg', name: 'Body LG', size: 18, lineHeight: 1.6, letterSpacing: 0, weight: 400, usage: '읽기 많은 본문' },
    { id: 'body-md', name: 'Body MD', size: 16, lineHeight: 1.6, letterSpacing: 0, weight: 400, usage: '기본 본문' },
    { id: 'body-sm', name: 'Body SM', size: 14, lineHeight: 1.6, letterSpacing: 0, weight: 400, usage: '보조 설명, 서브 텍스트' },
    { id: 'label-md', name: 'Label MD', size: 14, lineHeight: 1.4, letterSpacing: 0, weight: 600, usage: '버튼/폼 라벨, 필터 라벨' },
    { id: 'label-sm', name: 'Label SM', size: 12, lineHeight: 1.4, letterSpacing: 0, weight: 600, usage: '뱃지, 테이블 헤더, 태그' },
    { id: 'caption', name: 'Caption', size: 12, lineHeight: 1.5, letterSpacing: 0, weight: 400, usage: '메타 정보, 작은 설명' },
    { id: 'micro', name: 'Micro', size: 11, lineHeight: 1.5, letterSpacing: 0, weight: 400, usage: '툴팁, 헬프 텍스트 (최소 권장)' },
];

// 5. Store Interface
interface TypographyState {
    selectedFont: FontFamily;
    typeScale: TypeScaleItem[];
    selectedScaleId: string | null;

    // Actions
    setSelectedFont: (font: FontFamily) => void;
    updateScaleItem: (id: string, updates: Partial<TypeScaleItem>) => void;
    reorderTypeScale: (newOrder: TypeScaleItem[]) => void;
    selectScaleItem: (id: string | null) => void;
    resetTypeScale: () => void;
    resetScaleItem: (id: string) => void; // Reset single item to default
    generateTypeScale: (baseSize: number, ratio: number) => void;
}

const SCALE_STEPS: Record<string, number> = {
    'display-xl': 5, // 16 * 1.25^5Scale ~ 48.8 -> 60? 1.3^5 ~ 59. 
    'heading-xl': 4,
    'heading-lg': 3,
    'heading-md': 2,
    'heading-sm': 1,
    'body-lg': 0.5, // Optional half step
    'body-md': 0,   // Base
    'body-sm': -1,
    'label-md': -1,
    'label-sm': -2,
    'caption': -2,
    'micro': -3,
};

// 6. Store Implementation
export const useTypographyStore = create<TypographyState>((set) => ({
    selectedFont: FONT_FAMILIES.find(f => f.isDefault) || FONT_FAMILIES[0],
    typeScale: DEFAULT_TYPE_SCALE,
    selectedScaleId: null,

    setSelectedFont: (font) => set({ selectedFont: font }),

    updateScaleItem: (id, updates) => set((state) => ({
        typeScale: state.typeScale.map((item) =>
            item.id === id ? { ...item, ...updates } : item
        )
    })),

    reorderTypeScale: (newOrder) => set({ typeScale: newOrder }),

    selectScaleItem: (id) => set({ selectedScaleId: id }),

    resetTypeScale: () => set({
        typeScale: DEFAULT_TYPE_SCALE,
        selectedFont: FONT_FAMILIES.find(f => f.isDefault) || FONT_FAMILIES[0]
    }),

    resetScaleItem: (id) => set((state) => {
        const defaultItem = DEFAULT_TYPE_SCALE.find(item => item.id === id);
        if (!defaultItem) return state;

        return {
            typeScale: state.typeScale.map((item) =>
                item.id === id ? { ...defaultItem } : item
            )
        };
    }),

    generateTypeScale: (baseSize, ratio) => set((state) => {
        const newScale = state.typeScale.map(item => {
            const step = SCALE_STEPS[item.id];
            if (step === undefined) return item;

            const newSize = Math.round(baseSize * Math.pow(ratio, step));
            return { ...item, size: newSize };
        });
        return { typeScale: newScale };
    }),
}));

