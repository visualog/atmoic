import React from 'react';
import { Layers, Box, Component, Palette, Type, Ruler } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-64 border-r border-gray-200 h-full bg-white flex flex-col">
            <div className="h-14 border-b border-gray-200 flex items-center px-6">
                <h1 className="text-xl font-bold text-gray-800">Atomic</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    파운데이션
                </div>
                <nav className="space-y-1 px-2 mb-6">
                    <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 group">
                        <Palette className="mr-3 h-4 w-4 text-gray-500" />
                        색상 (Colors)
                    </button>
                    <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 group">
                        <Type className="mr-3 h-4 w-4 text-gray-500" />
                        타이포그래피
                    </button>
                    <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 group">
                        <Ruler className="mr-3 h-4 w-4 text-gray-500" />
                        간격 (Spacing)
                    </button>
                </nav>

                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    컴포넌트
                </div>
                <nav className="space-y-1 px-2">
                    <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 group">
                        <Box className="mr-3 h-4 w-4 text-gray-500" />
                        아톰 (Atoms)
                    </button>
                    <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 group">
                        <Component className="mr-3 h-4 w-4 text-gray-500" />
                        몰리큘 (Molecules)
                    </button>
                    <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 group">
                        <Layers className="mr-3 h-4 w-4 text-gray-500" />
                        오가니즘 (Organisms)
                    </button>
                </nav>
            </div>
        </div>
    );
}
