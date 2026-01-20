import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Box, Component, Palette, Type, Ruler } from 'lucide-react';
import { useBuilderStore } from '@/stores/useBuilderStore';

// Navigation items configuration
const NAV_ITEMS = {
    foundation: [
        { href: '/builder', icon: Palette, label: '색상 (Colors)' },
        { href: '/builder/typography', icon: Type, label: '타이포그래피' },
        { href: '/builder/spacing', icon: Ruler, label: '간격 (Spacing)' },
    ],
    components: [
        { href: '/builder/atoms', icon: Box, label: '아톰 (Atoms)' },
        { href: '/builder/molecules', icon: Component, label: '몰리큘 (Molecules)' },
        { href: '/builder/organisms', icon: Layers, label: '오가니즘 (Organisms)' },
    ],
};

export default function Sidebar() {
    const pathname = usePathname();
    const { isDarkMode } = useBuilderStore();

    const isActive = (href: string) => pathname === href;

    return (
        <div className={`w-64 border-r h-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#191919] border-[#222222]' : 'bg-white border-gray-200'
            }`}>
            <div className={`h-14 border-b flex items-center px-6 transition-colors duration-300 ${isDarkMode ? 'border-[#222222]' : 'border-gray-200'
                }`}>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Atomic</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className={`px-4 mb-2 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
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
                                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${active
                                        ? isDarkMode
                                            ? 'bg-blue-600/20 text-blue-400'
                                            : 'bg-blue-50 text-blue-600'
                                        : isDarkMode
                                            ? 'text-gray-300 hover:bg-[#222222]'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className={`mr-3 h-4 w-4 ${active ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                {item.label}
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
                                <Icon className={`mr-3 h-4 w-4 ${active ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
