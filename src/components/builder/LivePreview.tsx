import React from 'react';
import { Bell, Search, Menu, User, Settings, Check } from 'lucide-react';

export default function LivePreview() {
    return (
        <div className="bg-gray-100 p-8 rounded-2xl border border-gray-200 overflow-hidden relative min-h-[500px]">
            {/* Simulation of an App Interface */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-md mx-auto transform transition-all hover:scale-[1.01]">

                {/* App Header */}
                <div
                    className="h-16 flex items-center justify-between px-4 border-b"
                    style={{
                        backgroundColor: 'var(--neutral-1, #ffffff)',
                        borderColor: 'var(--neutral-6, #e5e7eb)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                                backgroundColor: 'var(--primary-9, #3b82f6)',
                                color: 'var(--primary-foreground, #ffffff)'
                            }}
                        >
                            <span className="font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold" style={{ color: 'var(--neutral-12, #1f2937)' }}>Dashboard</span>
                    </div>
                    <div className="flex gap-2" style={{ color: 'var(--neutral-11, #9ca3af)' }}>
                        <Search className="w-5 h-5" />
                        <Bell className="w-5 h-5" />
                        <div className="w-6 h-6 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-3, #e5e7eb)' }}>
                            <User className="w-full h-full p-1" style={{ color: 'var(--neutral-11, #6b7280)' }} />
                        </div>
                    </div>
                </div>

                {/* App Content */}
                <div className="p-6 space-y-6" style={{ backgroundColor: 'var(--neutral-2, #f9fafb)' }}>

                    {/* Hero Card */}
                    <div
                        className="rounded-xl p-6 relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, var(--primary-9, #3b82f6), var(--primary-10, #1d4ed8))`,
                            color: 'var(--primary-foreground, #ffffff)'
                        }}
                    >
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-1">Welcome back, Designer!</h3>
                            <p style={{ color: 'var(--primary-foreground, #ffffff)', opacity: 0.9 }} className="text-sm mb-4">You have 3 pending tasks today.</p>
                            <button
                                className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors hover:opacity-90"
                                style={{
                                    backgroundColor: 'var(--neutral-1, #ffffff)',
                                    color: 'var(--primary-11, #2563eb)'
                                }}
                            >
                                View Tasks
                            </button>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white opacity-10"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-black opacity-10"></div>
                    </div>

                    {/* Action Row */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {[
                            { label: 'Create', active: true },
                            { label: 'Edit', active: false },
                            { label: 'Share', active: false },
                        ].map((btn, i) => (
                            <button
                                key={i}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${btn.active
                                    ? 'border-transparent'
                                    : 'hover:opacity-80'
                                    }`}
                                style={btn.active ? {
                                    backgroundColor: 'var(--primary-9, #3b82f6)',
                                    color: 'var(--primary-foreground, #ffffff)'
                                } : {
                                    backgroundColor: 'var(--neutral-1, #ffffff)',
                                    color: 'var(--neutral-11, #4b5563)',
                                    borderColor: 'var(--neutral-6, #e5e7eb)'
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {/* Form Elements */}
                    <div
                        className="p-4 rounded-xl border space-y-4"
                        style={{
                            backgroundColor: 'var(--neutral-1, #ffffff)',
                            borderColor: 'var(--neutral-6, #e5e7eb)'
                        }}
                    >
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Project Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter project name..."
                                className="w-full px-3 py-2 border rounded-lg text-sm transition-all outline-none ring-2 ring-transparent focus:ring-opacity-20 placeholder:text-[var(--neutral-9)]"
                                style={{
                                    backgroundColor: 'var(--neutral-2, #f9fafb)',
                                    borderColor: 'var(--neutral-6, #e5e7eb)',
                                    color: 'var(--neutral-12, #111827)'
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                <div
                                    className="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                                    style={{
                                        borderColor: 'var(--primary-9, #3b82f6)',
                                        backgroundColor: 'var(--primary-9, #3b82f6)'
                                    }}
                                >
                                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--primary-foreground, #ffffff)' }} />
                                </div>
                                Notifications
                            </label>
                            <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    );
}
