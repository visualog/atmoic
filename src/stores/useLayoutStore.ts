import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface GridConfig {
    columns: number;
    gutter: number;
    margin: number;
}

interface LayoutState {
    breakpoints: {
        mobile: GridConfig;
        tablet: GridConfig;
        desktop: GridConfig;
    };
    activeCheckpoint: Breakpoint;
    isOverlayVisible: boolean;

    // Actions
    updateGridConfig: (breakpoint: Breakpoint, config: Partial<GridConfig>) => void;
    setActiveCheckpoint: (breakpoint: Breakpoint) => void;
    toggleOverlay: () => void;
    resetLayout: () => void;
}

const defaultBreakpoints = {
    mobile: {
        columns: 4,
        gutter: 16,
        margin: 16,
    },
    tablet: {
        columns: 8,
        gutter: 24,
        margin: 32,
    },
    desktop: {
        columns: 12,
        gutter: 24,
        margin: 80, // or 'auto' behavior simulation via max-width container, but foundation usually sets a base margin or max-width
    },
};

export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            breakpoints: defaultBreakpoints,
            activeCheckpoint: 'desktop',
            isOverlayVisible: false,

            updateGridConfig: (breakpoint, config) =>
                set((state) => ({
                    breakpoints: {
                        ...state.breakpoints,
                        [breakpoint]: {
                            ...state.breakpoints[breakpoint],
                            ...config,
                        },
                    },
                })),

            setActiveCheckpoint: (breakpoint) => set({ activeCheckpoint: breakpoint }),

            toggleOverlay: () => set((state) => ({ isOverlayVisible: !state.isOverlayVisible })),

            resetLayout: () => set({ breakpoints: defaultBreakpoints, activeCheckpoint: 'desktop' }),
        }),
        {
            name: 'layout-storage',
            version: 1,
        }
    )
);
