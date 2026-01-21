import { useTokenStore } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTypographyStore } from '@/stores/useTypographyStore';
import { X, Trash2, Type, RotateCcw } from 'lucide-react';

export default function PropertyPanel() {
    const { tokens, updateToken, removeToken } = useTokenStore();
    const { selectedId, selectedType, clearSelection, isDarkMode } = useBuilderStore();
    const { typeScale, updateScaleItem, resetScaleItem } = useTypographyStore();

    // Find the selected item based on type
    const selectedToken = selectedType === 'token' ? tokens.find(t => t.id === selectedId) : null;
    const selectedScale = selectedType === 'typography' ? typeScale.find(t => t.id === selectedId) : null;

    // If nothing selected, render nothing
    if (!selectedId || (!selectedToken && !selectedScale)) {
        return null;
    }

    return (
        <div className={`w-80 ring-1 ring-inset ring-l h-full flex flex-col shadow-xl z-20 ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'}`}>
            {/* Header */}
            <div className={`h-14 border-b flex items-center justify-between px-4 shrink-0 ${isDarkMode ? 'bg-[#161616] border-[#222222]' : 'bg-gray-50 border-gray-200'}`}>
                <h2 className={`text-sm font-bold uppercase tracking-wide flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {selectedType === 'typography' ? (
                        <>
                            <Type className="w-4 h-4 mr-2" />
                            타이포그래피 편집
                        </>
                    ) : (
                        `${selectedToken?.type} 편집`
                    )}
                </h2>
                <button
                    onClick={clearSelection}
                    className={`p-1 rounded-md transition-colors ${isDarkMode ? 'hover:bg-[#222222]' : 'hover:bg-gray-200'}`}
                >
                    <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">

                {/* Typography Editing */}
                {selectedType === 'typography' && selectedScale && (
                    <>
                        {/* Scale Name (Read-only) */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>스케일 이름</label>
                            <div className={`px-3 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'bg-[#222222] text-white' : 'bg-gray-100 text-gray-900'}`}>
                                {selectedScale.name}
                            </div>
                        </div>

                        {/* Font Size Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>글자 크기</label>
                                <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedScale.size}px</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="96"
                                value={selectedScale.size}
                                onChange={(e) => updateScaleItem(selectedScale.id, { size: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        {/* Line Height Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>행간 (Line Height)</label>
                                <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedScale.lineHeight}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="2.5"
                                step="0.05"
                                value={selectedScale.lineHeight}
                                onChange={(e) => updateScaleItem(selectedScale.id, { lineHeight: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        {/* Font Weight Select */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>굵기 (Weight)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[300, 400, 500, 600, 700].map((weight) => (
                                    <button
                                        key={weight}
                                        onClick={() => updateScaleItem(selectedScale.id, { weight })}
                                        className={`px-2 py-1.5 text-xs font-medium rounded-md ring-1 ring-inset transition-colors ${selectedScale.weight === weight
                                            ? 'bg-blue-600 ring-blue-600 text-white'
                                            : isDarkMode
                                                ? 'bg-[#222222] ring-[#2e2e2e] text-gray-300 hover:ring-[#3e3e3e]'
                                                : 'bg-white ring-gray-200 text-gray-700 hover:ring-gray-300'
                                            }`}
                                    >
                                        {weight}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Letter Spacing Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>자간 (Letter Spacing)</label>
                                <span className="text-xs font-mono text-gray-500">{selectedScale.letterSpacing || 0}%</span>
                            </div>
                            <input
                                type="range"
                                min="-5"
                                max="10"
                                step="0.5"
                                value={selectedScale.letterSpacing || 0}
                                onChange={(e) => updateScaleItem(selectedScale.id, { letterSpacing: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        {/* Usage (Editable) */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>용도 설명</label>
                            <input
                                type="text"
                                value={selectedScale.usage}
                                onChange={(e) => updateScaleItem(selectedScale.id, { usage: e.target.value })}
                                className={`w-full px-3 py-2 ring-1 ring-inset rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-transparent transition-all ${isDarkMode
                                    ? 'bg-[#222222] ring-[#2e2e2e] text-white placeholder-gray-500'
                                    : 'bg-white ring-gray-300 text-gray-900'
                                    }`}
                                placeholder="예: 페이지 타이틀"
                            />
                        </div>

                        <hr className={isDarkMode ? 'border-[#2e2e2e]' : 'border-gray-100'} />

                        {/* Reset Button */}
                        <button
                            onClick={() => resetScaleItem(selectedScale.id)}
                            className={`w-full flex items-center justify-center px-4 py-2 ring-1 ring-inset rounded-md text-sm transition-colors ${isDarkMode
                                ? 'ring-[#2e2e2e] text-gray-300 hover:bg-[#222222]'
                                : 'ring-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            기본값으로 초기화
                        </button>
                    </>
                )}

                {/* Token Editing (Original) */}
                {selectedType === 'token' && selectedToken && (
                    <>
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>토큰 이름</label>
                            <input
                                type="text"
                                value={selectedToken.name}
                                onChange={(e) => updateToken(selectedToken.id, { name: e.target.value })}
                                className={`w-full px-3 py-2 ring-1 ring-inset rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-transparent transition-all ${isDarkMode
                                    ? 'bg-[#222222] ring-[#2e2e2e] text-white'
                                    : 'bg-white ring-gray-300 text-gray-900'
                                    }`}
                                placeholder="예: Primary 500"
                            />
                        </div>

                        {/* Value Input (Color Picker for colors) */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>값</label>
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
                                    className={`flex-1 px-3 py-2 ring-1 ring-inset rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-transparent transition-all ${isDarkMode
                                        ? 'bg-[#222222] ring-[#2e2e2e] text-white'
                                        : 'bg-white ring-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* ID Read-only */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>토큰 ID</label>
                            <div className={`px-3 py-2 rounded-md text-xs font-mono select-all ${isDarkMode ? 'bg-[#222222] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                {selectedToken.id}
                            </div>
                        </div>

                        <hr className={isDarkMode ? 'border-[#2e2e2e]' : 'border-gray-100'} />

                        {/* Delete Button */}
                        <button
                            onClick={() => {
                                removeToken(selectedToken.id);
                                clearSelection();
                            }}
                            className="w-full flex items-center justify-center px-4 py-2 ring-1 ring-inset ring-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            토큰 삭제
                        </button>
                    </>
                )}

            </div>
        </div >
    );
}
