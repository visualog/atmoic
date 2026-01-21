'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/builder/Sidebar';
import PropertyPanel from '@/components/builder/PropertyPanel';
import ExportModal from '@/components/builder/ExportModal';
import { useTokenStore } from '@/stores/useTokenStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { Download, Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';

// Breadcrumb mapping
const BREADCRUMB_MAP: Record<string, { category: string; page: string }> = {
    '/builder': { category: '파운데이션', page: '색상' },
    '/builder/typography': { category: '파운데이션', page: '타이포그래피' },
    '/builder/spacing': { category: '파운데이션', page: '간격' },
};

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isExportOpen, setIsExportOpen] = useState(false);
    const { tokens } = useTokenStore();
    const { selectedId, isDarkMode, toggleDarkMode } = useBuilderStore();

    // Get breadcrumb info
    const breadcrumb = BREADCRUMB_MAP[pathname] || { category: '파운데이션', page: '색상' };

    return (
        <div className={`flex h-screen w-full transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#111111]' : 'bg-gray-50'}`}>
            {/* 1. Left Sidebar (Navigation) */}
            <Sidebar />

            {/* 2. Center Canvas (Preview) */}
            <main className="flex-1 overflow-hidden relative flex flex-col">
                {/* Toolbar Area */}
                <div className={`h-14 flex items-center px-6 justify-between shrink-0 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#191919]' : 'bg-white'
                    }`}
                    style={{ boxShadow: isDarkMode ? 'inset 0 -1px 0 0 #222222' : 'inset 0 -1px 0 0 #e5e7eb' }}>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>아토믹</span>
                        <span>/</span>
                        <span>{breadcrumb.category}</span>
                        <span>/</span>
                        <span className="text-blue-600 font-medium">{breadcrumb.page}</span>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-1.5 rounded-md transition-colors ${isDarkMode
                                ? 'text-gray-400 hover:text-white hover:bg-[#222222]'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            title={isDarkMode ? "시작 모드로 전환" : "다크 모드로 전환"}
                        >
                            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            저장
                        </button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className={`flex-1 overflow-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#111111]' : 'bg-gray-100'}`}>
                    <div className={`min-h-full rounded-xl shadow-sm ring-1 ring-inset p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#191919] ring-[#222222]' : 'bg-white ring-gray-200'
                        }`}>
                        {children}
                    </div>
                </div>
            </main>

            {/* 3. Right Sidebar (Properties) - Animated Container */}
            <div
                className={clsx(
                    "h-full transition-[width,colors] duration-300 ease-in-out overflow-hidden shadow-xl z-20",
                    isDarkMode ? "bg-[#191919]" : "bg-white", // Dynamic colors
                    selectedId ? "w-80" : "w-0"
                )}
                style={selectedId ? { boxShadow: isDarkMode ? 'inset 1px 0 0 0 #222222' : 'inset 1px 0 0 0 #e5e7eb' } : {}}
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
