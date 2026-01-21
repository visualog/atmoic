import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Box, Component, Palette, Type, Ruler, CheckCircle2, Circle, LayoutTemplate, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { useTokenStore } from '@/stores/useTokenStore';

// Navigation items configuration
const NAV_ITEMS = {
    foundation: [
        { href: '/builder', icon: Palette, label: '색상', type: 'color' },
        { href: '/builder/typography', icon: Type, label: '타이포그래피', type: 'typography' },
        { href: '/builder/spacing', icon: Ruler, label: '간격', type: 'spacing' },
        { href: '/builder/radius', icon: Circle, label: '곡률', type: 'radius' },
        { href: '/builder/shadows', icon: Layers, label: '그림자', type: 'shadows' },
        { href: '/builder/layout', icon: LayoutTemplate, label: '레이아웃', type: 'layout' },
        { href: '/builder/interaction', icon: MousePointerClick, label: '상호작용', type: 'interaction' },
    ],
    components: [
        { href: '/builder/atoms', icon: Box, label: '아톰', type: 'atoms' },
        { href: '/builder/molecules', icon: Component, label: '몰리큘', type: 'molecules' },
        { href: '/builder/organisms', icon: Layers, label: '오가니즘', type: 'organisms' },
    ],
};

export default function Sidebar() {
    const pathname = usePathname();
    const { isDarkMode } = useBuilderStore();
    const { tokens } = useTokenStore();

    const isActive = (href: string) => pathname === href;

    // Check if a section is "complete" (has tokens)
    const isSectionComplete = (type: string) => {
        if (type === 'color') return tokens.some(t => t.type === 'color' && t.id.startsWith('primary-'));
        if (type === 'typography') return tokens.some(t => t.type === 'typography');
        if (type === 'spacing') return tokens.some(t => t.type === 'spacing');
        return false;
    };

    const totalSteps = NAV_ITEMS.foundation.length;
    const completedSteps = NAV_ITEMS.foundation.filter(item => isSectionComplete(item.type)).length;
    const progressPercent = Math.round((completedSteps / totalSteps) * 100);

    return (
        <div
            className={`w-64 h-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#191919]' : 'bg-white'}`}
            style={{ boxShadow: isDarkMode ? 'inset -1px 0 0 0 #222222' : 'inset -1px 0 0 0 #e5e7eb' }}
        >
            <div
                className={`h-14 flex items-center px-6 transition-colors duration-300`}
                style={{ boxShadow: isDarkMode ? 'inset 0 -1px 0 0 #222222' : 'inset 0 -1px 0 0 #e5e7eb' }}
            >
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Atomic</h1>
            </div>

            <div className={`px-6 py-4`} style={{ boxShadow: isDarkMode ? 'inset 0 -1px 0 0 #222222' : 'inset 0 -1px 0 0 #f3f4f6' }}>
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>System Progress</span>
                    <span className="text-[10px] font-bold text-blue-500">{progressPercent}%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-[#222222]' : 'bg-gray-100'}`}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-blue-600 rounded-full"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className={`px-4 mb-2 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    파운데이션
                </div>
                <nav className="space-y-1 px-2 mb-6">
                    {NAV_ITEMS.foundation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md group transition-colors ${active
                                    ? isDarkMode
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'bg-blue-50 text-blue-600'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-[#222222]'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <Icon className={`mr-3 h-4 w-4 ${active ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    {item.label}
                                </div>
                                {isSectionComplete(item.type) && (
                                    <CheckCircle2 className={`h-3.5 w-3.5 ${active ? 'text-blue-500' : 'text-green-500'}`} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    컴포넌트
                </div>
                <nav className="space-y-1 px-2">
                    {NAV_ITEMS.components.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${active
                                    ? isDarkMode
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'bg-blue-50 text-blue-600'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-[#222222]'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <Icon className={`mr-3 h-4 w-4 ${active ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    {item.label}
                                </div>
                                {isSectionComplete(item.type) && (
                                    <CheckCircle2 className={`h-3.5 w-3.5 ${active ? 'text-blue-500' : 'text-green-500'}`} />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className={`px-6 py-3 border-t ${isDarkMode ? 'border-[#222222]' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Version</span>
                    <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>v0.1.0</span>
                </div>
            </div>
        </div>
    );
}
