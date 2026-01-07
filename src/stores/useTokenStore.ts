import { create } from 'zustand';

// 1. Token Types Definition
export type TokenType = 'color' | 'typography' | 'spacing' | 'borderRadius' | 'shadow';

export interface Token {
  id: string;          // e.g., "primary-500", "font-sans"
  name: string;        // e.g., "Primary 500", "Sans Serif"
  value: string;       // e.g., "#6200EE", "Inter, sans-serif"
  type: TokenType;
  description?: string; // Optional description
}

interface TokenState {
  tokens: Token[];
  
  // Actions
  addToken: (token: Token) => void;
  updateToken: (id: string, updates: Partial<Token>) => void;
  removeToken: (id: string) => void;
  
  // Getters (Helper functions)
  getTokensByType: (type: TokenType) => Token[];
}

// 2. Initial Data (Basic Defaults)
const initialTokens: Token[] = [
  // Colors
  { id: 'primary-500', name: 'Primary 500', value: '#3b82f6', type: 'color' }, // Tailwind blue-500
  { id: 'neutral-50', name: 'Neutral 50', value: '#f9fafb', type: 'color' },
  { id: 'neutral-900', name: 'Neutral 900', value: '#111827', type: 'color' },
  
  // Spacing (4px grid)
  { id: 'spacing-4', name: 'Spacing 4', value: '1rem', type: 'spacing' }, // 16px
  { id: 'spacing-2', name: 'Spacing 2', value: '0.5rem', type: 'spacing' }, // 8px
  
  // Typography
  { id: 'font-base', name: 'Base Font', value: 'Inter, sans-serif', type: 'typography' },
];

// 3. Store Implementation
export const useTokenStore = create<TokenState>((set, get) => ({
  tokens: initialTokens,

  addToken: (token) => set((state) => ({ 
    tokens: [...state.tokens, token] 
  })),

  updateToken: (id, updates) => set((state) => ({
    tokens: state.tokens.map((t) => (t.id === id ? { ...t, ...updates } : t))
  })),

  removeToken: (id) => set((state) => ({
    tokens: state.tokens.filter((t) => t.id !== id)
  })),

  getTokensByType: (type) => {
    return get().tokens.filter((t) => t.type === type);
  },
}));
