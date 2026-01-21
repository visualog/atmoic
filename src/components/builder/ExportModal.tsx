import React, { useState } from 'react';
import { Token } from '@/stores/useTokenStore';
import { generateCssVariables } from '@/services/export/cssGenerator';
import { Copy, Check, X, Code } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokens: Token[];
}

export default function ExportModal({ isOpen, onClose, tokens }: ExportModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const cssCode = generateCssVariables(tokens);

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] ring-1 ring-inset ring-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4" style={{ boxShadow: 'inset 0 -1px 0 0 #f3f4f6' }}>
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Code className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">CSS 변수 내보내기</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Code Area */}
                <div className="flex-1 overflow-auto bg-gray-900 p-6">
                    <pre className="font-mono text-sm text-gray-300 whitespace-pre">
                        {cssCode}
                    </pre>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end" style={{ boxShadow: 'inset 0 1px 0 0 #f3f4f6' }}>
                    <button
                        onClick={handleCopy}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                복사완료!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                CSS 복사
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
