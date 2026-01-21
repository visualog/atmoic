import React from 'react';
import { Check } from 'lucide-react';
import { useBuilderStore } from '@/stores/useBuilderStore';

interface StatusMessageProps {
    message: string;
}

export default function StatusMessage({ message }: StatusMessageProps) {
    const { isDarkMode } = useBuilderStore();

    return (
        <div className={`text-xs px-2 p-2 rounded ring-1 ring-inset flex items-center gap-2 transition-colors ${isDarkMode
            ? 'bg-[#222222] ring-[#2e2e2e] text-green-400'
            : 'bg-green-50 ring-green-100 text-green-600'
            }`}>
            <Check className="w-3 h-3" />
            {message}
        </div>
    );
}
