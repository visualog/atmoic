import { create } from 'zustand';

type SelectionType = 'token' | 'component' | 'typography' | null;

interface BuilderState {
    selectedId: string | null;
    selectedType: SelectionType;

    // Theme
    isDarkMode: boolean;
    toggleDarkMode: () => void;

    // Modals
    isExportModalOpen: boolean;
    setExportModalOpen: (open: boolean) => void;

    // Actions
    selectItem: (id: string, type: SelectionType) => void;
    clearSelection: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
    selectedId: null,
    selectedType: null,

    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

    isExportModalOpen: false,
    setExportModalOpen: (open) => set({ isExportModalOpen: open }),

    selectItem: (id, type) => set({ selectedId: id, selectedType: type }),
    clearSelection: () => set({ selectedId: null, selectedType: null }),
}));
