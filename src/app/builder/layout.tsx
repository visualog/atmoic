'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/builder/Sidebar';
import PropertyPanel from '@/components/builder/PropertyPanel';
import ExportModal from '@/components/builder/ExportModal';
import { useTokenStore } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { Code2, Download } from 'lucide-react';
import { clsx } from 'clsx';

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isExportOpen, setIsExportOpen] = useState(false);
    const { tokens } = useTokenStore();
    const { selectedId } = useBuilderStore();

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
            {/* 1. Left Sidebar (Navigation) */}
            <Sidebar />

            {/* 2. Center Canvas (Preview) */}
            <main className="flex-1 overflow-hidden relative flex flex-col">
                {/* Toolbar Area */}
                <div className="h-14 border-b border-gray-200 bg-white flex items-center px-6 justify-between shrink-0 z-10">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">아토믹</span>
                        <span>/</span>
                        <span>파운데이션</span>
                        <span>/</span>
                        <span className="text-blue-600 font-medium">색상</span>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsExportOpen(true)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Code2 className="w-4 h-4 mr-2 text-gray-500" />
                            코드 보기
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            내보내기
                        </button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto bg-gray-100 p-8">
                    <div className="min-h-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {children}
                    </div>
                </div>
            </main>

            {/* 3. Right Sidebar (Properties) - Animated Container */}
            <div
                className={clsx(
                    "bg-white border-l border-gray-200 h-full transition-[width] duration-300 ease-in-out overflow-hidden shadow-xl z-20",
                    selectedId ? "w-80 border-l" : "w-0 border-none"
                )}
            >
                <div className="w-80 h-full"> {/* Inner container to fix width */}
                    <PropertyPanel />
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                tokens={tokens}
            />
        </div>
    );
}
