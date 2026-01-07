'use client';

import React from 'react';
import { useTokenStore } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { Plus } from 'lucide-react';
import { clsx } from 'clsx';

export default function BuilderPage() {
    const { tokens, getTokensByType } = useTokenStore();
    const { selectedId, selectItem } = useBuilderStore();

    const colorTokens = getTokensByType('color');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">컬러 팔레트</h2>
                <p className="text-gray-500 mt-1">
                    디자인 시스템의 기본 색상을 정의하세요. 여기서 정의된 색상은 전체 테마 생성에 사용됩니다.
                </p>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Color Cards */}
                {colorTokens.map((token) => {
                    const isSelected = selectedId === token.id;

                    return (
                        <div
                            key={token.id}
                            onClick={() => selectItem(token.id, 'token')}
                            className={clsx(
                                "group relative bg-white border rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer",
                                isSelected
                                    ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-20 shadow-md transform scale-[1.02]"
                                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                            )}
                        >
                            {/* Color Preview */}
                            <div
                                className="h-32 w-full"
                                style={{ backgroundColor: token.value }}
                            />

                            {/* Token Info */}
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900">{token.name}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {token.value}
                                    </code>
                                    <span className="text-xs text-gray-400">
                                        {token.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Color Button */}
                <button
                    onClick={() => console.log('Add Color Clicked')}
                    className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <Plus className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">색상 추가</span>
                </button>
            </div>
        </div>
    );
}
