import React from 'react';
import { useShadowStore } from '@/stores/useShadowStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { motion } from 'framer-motion';
import { Check, Layers } from 'lucide-react';

export default function ShadowVisualizer() {
    const { layers, selectedLayerId, selectLayer, getShadowString } = useShadowStore();
    const { isDarkMode } = useBuilderStore();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Shadow Scale
                </h3>
                <span className="text-xs text-gray-500">5 Levels</span>
            </div>

            <div className="space-y-3">
                {layers.map((layer) => {
                    const isSelected = selectedLayerId === layer.id;
                    const shadowValue = getShadowString(layer.id);

                    return (
                        <motion.div
                            key={layer.id}
                            onClick={() => selectLayer(layer.id)}
                            className={`group cursor-pointer relative rounded-xl border transition-all duration-200 ${isSelected
                                ? isDarkMode
                                    ? 'bg-[#191919] border-blue-500/50 ring-1 ring-blue-500/20'
                                    : 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100'
                                : isDarkMode
                                    ? 'bg-[#111111] border-[#222] hover:border-[#333]'
                                    : 'bg-white border-gray-100 hover:border-blue-100'
                                }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="p-4 flex items-center gap-4">
                                {/* Preview Box */}
                                <div
                                    className={`w-16 h-16 rounded-lg flex-shrink-0 transition-all duration-300 ${isDarkMode ? 'bg-[#222]' : 'bg-white'}`}
                                    style={{
                                        boxShadow: shadowValue,
                                        border: isDarkMode ? '1px solid #333' : '1px solid #f3f4f6'
                                    }}
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {layer.name}
                                        </span>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="bg-blue-500 rounded-full p-0.5"
                                            >
                                                <Check className="w-3 h-3 text-white" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 truncate mb-1.5">
                                        {layer.description}
                                    </p>
                                    <code className={`text-[10px] px-1.5 py-0.5 rounded font-mono block truncate ${isDarkMode ? 'bg-[#222] text-gray-500' : 'bg-gray-50 text-gray-500'
                                        }`}>
                                        {shadowValue}
                                    </code>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
