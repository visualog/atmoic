import React from 'react';
import { Bell, Search, Menu, User, Settings, Check } from 'lucide-react';

export default function LivePreview() {
    return (
        <div className="bg-gray-100 p-8 rounded-2xl border border-gray-200 shadow-inner overflow-hidden relative min-h-[500px]">
            {/* Simulation of an App Interface */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-md mx-auto transform transition-all hover:scale-[1.01]">

                {/* App Header */}
                <div
                    className="h-16 flex items-center justify-between px-4 border-b"
                    style={{
                        backgroundColor: 'var(--white, #ffffff)',
                        borderColor: 'var(--neutral-200, #e5e7eb)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: 'var(--primary-600, #2563eb)' }}
                        >
                            <span className="font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold text-gray-800">Dashboard</span>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                        <Search className="w-5 h-5" />
                        <Bell className="w-5 h-5" />
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                            <User className="w-full h-full p-1 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* App Content */}
                <div className="p-6 space-y-6 bg-gray-50/50">

                    {/* Hero Card */}
                    <div
                        className="rounded-xl p-6 text-white shadow-md relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, var(--primary-500, #3b82f6), var(--primary-700, #1d4ed8))`
                        }}
                    >
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-1">Welcome back, Designer!</h3>
                            <p className="text-blue-100 text-sm mb-4">You have 3 pending tasks today.</p>
                            <button
                                className="px-4 py-2 bg-white text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                                style={{ color: 'var(--primary-600, #2563eb)' }}
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
                                        ? 'text-white border-transparent'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                style={btn.active ? { backgroundColor: 'var(--primary-500, #3b82f6)' } : {}}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {/* Form Elements */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Project Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter project name..."
                                className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-all outline-none ring-2 ring-transparent focus:ring-opacity-20"
                                style={{
                                    borderColor: 'var(--neutral-200, #e5e7eb)',
                                    // We simulate focus color using a CSS variable if possible, but hard to do inline without state
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                <div
                                    className="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                                    style={{
                                        borderColor: 'var(--primary-500, #3b82f6)',
                                        backgroundColor: 'var(--primary-500, #3b82f6)'
                                    }}
                                >
                                    <Check className="w-3.5 h-3.5 text-white" />
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

            {/* Floating Badge (Simulation) */}
            <div
                className="absolute bottom-6 right-6 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-100 flex items-center gap-2 text-sm font-semibold text-gray-700 animate-bounce"
            >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Live Preview
            </div>
        </div>
    );
}
