import React from 'react';
import { useTokenStore } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { X, Trash2 } from 'lucide-react';

export default function PropertyPanel() {
    const { tokens, updateToken, removeToken } = useTokenStore();
    const { selectedId, clearSelection } = useBuilderStore();

    // Find the selected token
    const selectedToken = tokens.find(t => t.id === selectedId);

    // If no token selected, render nothing (handled by Layout animation)
    if (!selectedId || !selectedToken) {
        return null;
    }

    return (
        <div className="w-80 border-l border-gray-200 h-full bg-white flex flex-col shadow-xl z-20">
            {/* Header */}
            <div className="h-14 border-b border-gray-200 flex items-center justify-between bg-gray-50 px-4 shrink-0">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center">
                    {selectedToken.type} 편집
                </h2>
                <button
                    onClick={clearSelection}
                    className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">

                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">토큰 이름</label>
                    <input
                        type="text"
                        value={selectedToken.name}
                        onChange={(e) => updateToken(selectedToken.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="예: Primary 500"
                    />
                </div>

                {/* Value Input (Color Picker for colors) */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">값</label>
                    <div className="flex gap-2">
                        {selectedToken.type === 'color' && (
                            <div className="relative">
                                <input
                                    type="color"
                                    value={selectedToken.value}
                                    onChange={(e) => updateToken(selectedToken.id, { value: e.target.value })}
                                    className="w-10 h-10 p-0 border border-gray-300 rounded-md overflow-hidden cursor-pointer"
                                />
                            </div>
                        )}
                        <input
                            type="text"
                            value={selectedToken.value}
                            onChange={(e) => updateToken(selectedToken.id, { value: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* ID Read-only */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">토큰 ID</label>
                    <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-xs font-mono text-gray-500 select-all">
                        {selectedToken.id}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Delete Button */}
                <button
                    onClick={() => {
                        removeToken(selectedToken.id);
                        clearSelection();
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    토큰 삭제
                </button>

            </div>
        </div>
    );
}
