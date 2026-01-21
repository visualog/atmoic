'use client';

import React from 'react';
import { useTypographyStore, TypeScaleItem } from '@/stores/useTypographyStore';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { Check, GripVertical } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';

interface TypeScaleVisualizerProps {
    onSelect?: (item: TypeScaleItem) => void;
}

// Separate component for reorder item to use drag controls properly
const ScaleItem = ({
    item,
    isSelected,
    isDarkMode,
    selectedFont,
    onSelect
}: {
    item: TypeScaleItem;
    isSelected: boolean;
    isDarkMode: boolean;
    selectedFont: any;
    onSelect: (item: TypeScaleItem) => void;
}) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={item}
            dragListener={false}
            dragControls={controls}
            className="relative"
        >
            <div
                onClick={() => onSelect(item)}
                className={`w-full text-left p-4 rounded-xl ring-1 ring-inset transition-all duration-200 group flex items-start gap-3 cursor-pointer ${isSelected
                    ? isDarkMode
                        ? 'bg-blue-600/20 ring-blue-500/50'
                        : 'bg-blue-50 ring-blue-300'
                    : isDarkMode
                        ? 'bg-[#191919] ring-[#2e2e2e] hover:ring-[#3e3e3e]'
                        : 'bg-gray-50 ring-gray-200 hover:ring-gray-300'
                    }`}
            >
                {/* Drag Handle */}
                <div
                    onPointerDown={(e) => controls.start(e)}
                    className={`mt-1 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
                >
                    <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${isDarkMode ? 'bg-[#222222] text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                                {item.id}
                            </span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {item.size}px / {item.lineHeight} / {item.weight}
                            </span>
                        </div>
                        {isSelected && (
                            <Check className="w-4 h-4 text-blue-500" />
                        )}
                    </div>
                    <p
                        style={{
                            fontFamily: selectedFont.value,
                            fontSize: `${item.size}px`,
                            lineHeight: item.lineHeight,
                            fontWeight: item.weight,
                            letterSpacing: `${item.letterSpacing || 0}em`, // Using em for better scaling or use 'px'/'%' based on preference
                        }}
                        className={`${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}
                    >
                        {item.usage}
                    </p>
                </div>
            </div>
        </Reorder.Item>
    );
};

export default function TypeScaleVisualizer({ onSelect }: TypeScaleVisualizerProps) {
    const { typeScale, selectedFont, selectedScaleId, selectScaleItem, reorderTypeScale } = useTypographyStore();
    const { isDarkMode, selectItem } = useBuilderStore();

    const handleItemClick = (item: TypeScaleItem) => {
        selectScaleItem(item.id);
        selectItem(item.id, 'typography'); // Connect to PropertyPanel
        onSelect?.(item);
    };

    const handleReorder = (newGroupItems: TypeScaleItem[]) => {
        // We need to merge the new group order into the full typeScale list.
        // Strategy: 
        // 1. Identify which items are in this group (by ID, from newGroupItems).
        // 2. Remove all items belonging to this group from the current full list.
        // 3. Insert the newGroupItems at the position where the first item of the group was found.

        const groupIds = new Set(newGroupItems.map(i => i.id));

        // Find the index of the first item belonging to this group in the original list
        const firstIndex = typeScale.findIndex(i => groupIds.has(i.id));

        if (firstIndex === -1) return;

        // Create a list without the items of the current group
        const itemsWithoutGroup = typeScale.filter(i => !groupIds.has(i.id));

        // Construct the new full list
        const newTypeScale = [
            ...itemsWithoutGroup.slice(0, firstIndex),
            ...newGroupItems,
            ...itemsWithoutGroup.slice(firstIndex)
        ];

        reorderTypeScale(newTypeScale);
    };

    // Group items by category
    const displayItems = typeScale.filter(item => item.id.startsWith('display'));
    const headingItems = typeScale.filter(item => item.id.startsWith('heading'));
    const bodyItems = typeScale.filter(item => item.id.startsWith('body'));
    const labelItems = typeScale.filter(item => item.id.startsWith('label'));
    const otherItems = typeScale.filter(item => !item.id.startsWith('display') && !item.id.startsWith('heading') && !item.id.startsWith('body') && !item.id.startsWith('label'));

    const allGroups = [
        { name: 'Display', items: displayItems },
        { name: 'Headings', items: headingItems },
        { name: 'Body', items: bodyItems },
        { name: 'Labels', items: labelItems },
        { name: 'Others', items: otherItems },
    ].filter(group => group.items.length > 0);

    return (
        <div className="space-y-8">
            {allGroups.map(group => (
                <div key={group.name} className="space-y-3">
                    <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {group.name}
                    </h4>
                    <Reorder.Group
                        axis="y"
                        values={group.items}
                        onReorder={handleReorder}
                        className="space-y-2"
                    >
                        {group.items.map(item => (
                            <ScaleItem
                                key={item.id}
                                item={item}
                                isSelected={selectedScaleId === item.id}
                                isDarkMode={isDarkMode}
                                selectedFont={selectedFont}
                                onSelect={handleItemClick}
                            />
                        ))}
                    </Reorder.Group>
                </div>
            ))}
        </div>
    );
}
