'use client';

import React from 'react';
import { RotateCcw, Download } from 'lucide-react';
import { useBuilderStore } from '@/stores/useBuilderStore';

interface PageHeaderProps {
    title: string;
    description: string;
    onReset: () => void;
    children?: React.ReactNode;
}

export default function PageHeader({ title, description, onReset, children }: PageHeaderProps) {
    const { isDarkMode, setExportModalOpen } = useBuilderStore();

    return (
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {description}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {children}
                <button
                    onClick={onReset}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium ring-1 ring-inset rounded-lg transition-colors ${isDarkMode
                        ? 'bg-[#191919] ring-[#2e2e2e] text-gray-300 hover:bg-[#222222]'
                        : 'bg-white ring-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    초기화
                </button>
                <button
                    onClick={() => setExportModalOpen(true)}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4 mr-2" />
                    저장
                </button>
            </div>
        </div>
    );
}
