import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InteractionState {
    opacity: {
        disabled: number;
        hover: number;
        pressed: number;
        overlay: number;
    };
    updateOpacity: (key: keyof InteractionState['opacity'], value: number) => void;
    resetInteraction: () => void;
}

const defaultOpacity = {
    disabled: 0.4,
    hover: 0.9,
    pressed: 0.95,
    overlay: 0.5,
};

export const useInteractionStore = create<InteractionState>()(
    persist(
        (set) => ({
            opacity: defaultOpacity,

            updateOpacity: (key, value) =>
                set((state) => ({
                    opacity: {
                        ...state.opacity,
                        [key]: value,
                    },
                })),

            resetInteraction: () => set({ opacity: defaultOpacity }),
        }),
        {
            name: 'interaction-storage',
            version: 1,
        }
    )
);
