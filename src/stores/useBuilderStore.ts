import { create } from 'zustand';

type SelectionType = 'token' | 'component' | null;

interface BuilderState {
    selectedId: string | null;
    selectedType: SelectionType;

    // Actions
    selectItem: (id: string, type: SelectionType) => void;
    clearSelection: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
    selectedId: null,
    selectedType: null,

    selectItem: (id, type) => set({ selectedId: id, selectedType: type }),
    clearSelection: () => set({ selectedId: null, selectedType: null }),
}));
