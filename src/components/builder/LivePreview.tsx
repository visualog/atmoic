'use client';

import { useState } from 'react';
import { Bell, Search, User, Check, FileText } from 'lucide-react';

export default function LivePreview() {
    const [isApproved, setIsApproved] = useState(false);

    return (
        <div className="p-6 relative min-h-[500px]">
            {/* Simulation of an App Interface */}
            <div className="ring-1 ring-inset overflow-hidden w-full transition-all"
                style={{
                    backgroundColor: 'var(--neutral-1)',
                    boxShadow: 'var(--shadow-layer-5)',
                    borderRadius: 'var(--radius-lg, 8px)'
                }}>

                {/* App Header */}
                <div
                    className="h-16 flex items-center justify-between px-6"
                    style={{
                        backgroundColor: 'var(--neutral-1, #ffffff)',
                        borderBottom: '1px solid var(--neutral-6, #e5e7eb)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 flex items-center justify-center"
                            style={{
                                backgroundColor: 'var(--primary-9, #3b82f6)',
                                color: 'var(--primary-foreground, #ffffff)',
                                borderRadius: 'var(--radius-md, 6px)'
                            }}
                        >
                            <span className="font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold text-lg" style={{ color: 'var(--neutral-12, #1f2937)' }}>Dashboard</span>
                    </div>
                    <div className="flex gap-4" style={{ color: 'var(--neutral-11, #9ca3af)' }}>
                        <Search className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
                        <Bell className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
                        <div className="w-8 h-8 overflow-hidden cursor-pointer" style={{ backgroundColor: 'var(--neutral-3, #e5e7eb)', borderRadius: 'var(--radius-full, 9999px)' }}>
                            <User className="w-full h-full p-1.5" style={{ color: 'var(--neutral-11, #6b7280)' }} />
                        </div>
                    </div>
                </div>

                {/* App Content */}
                <div
                    style={{
                        backgroundColor: 'var(--neutral-2, #f9fafb)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px',
                        padding: '24px'
                    }}
                >

                    {/* 1. Stat Cards Row */}
                    {[
                        { label: 'Total Revenue', value: '$45,231', trend: '+20.1%', positive: true },
                        { label: 'Active Users', value: '+2,350', trend: '+180.1%', positive: true },
                        { label: 'Bounce Rate', value: '12.23%', trend: '-4.3%', positive: false },
                        { label: 'Active Now', value: '+573', trend: '+201', positive: true },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="p-5 flex flex-col justify-between"
                            style={{
                                backgroundColor: 'var(--neutral-1, #ffffff)',
                                boxShadow: 'var(--shadow-layer-1), inset 0 0 0 1px var(--neutral-6, #e5e7eb)',
                                borderRadius: 'var(--radius-lg, 8px)',
                                gridColumn: 'span 1'
                            }}
                        >
                            <span className="text-xs font-medium uppercase tracking-wide opacity-70 mb-2" style={{ color: 'var(--neutral-11)' }}>
                                {stat.label}
                            </span>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-bold" style={{ color: 'var(--neutral-12)' }}>{stat.value}</span>
                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${stat.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* 2. Main Content & Sidebar Split */}

                    {/* Left: Main Chart/Actions Area (Span 3) */}
                    <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Hero Section */}
                        <div
                            className="p-8 relative overflow-hidden flex flex-col justify-center min-h-[160px]"
                            style={{
                                background: `linear-gradient(135deg, var(--primary-9, #3b82f6), var(--primary-10, #1d4ed8))`,
                                color: 'var(--primary-foreground, #ffffff)',
                                borderRadius: 'var(--radius-lg, 8px)',
                                boxShadow: 'var(--shadow-layer-2)',
                            }}
                        >
                            <div className="relative z-10 max-w-lg">
                                <h3 className="font-bold text-2xl mb-2">Welcome back, Designer!</h3>
                                <p style={{ color: 'var(--primary-foreground, #ffffff)', opacity: 0.9 }} className="mb-6">
                                    새로운 파운데이션 시스템이 성공적으로 통합되었습니다. 지금 바로 작업을 시작해보세요.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        className="px-4 py-2 text-sm font-semibold transition-transform active:scale-95"
                                        style={{
                                            backgroundColor: 'var(--neutral-1, #ffffff)',
                                            color: 'var(--primary-11, #2563eb)',
                                            borderRadius: 'var(--radius-md, 6px)',
                                            boxShadow: 'var(--shadow-layer-1)',
                                        }}
                                    >
                                        Get Started
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm font-semibold transition-opacity hover:bg-white/10"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            color: 'white',
                                            borderRadius: 'var(--radius-md, 6px)',
                                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        View Documentation
                                    </button>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-white" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
                        </div>

                        {/* Recent Items List */}
                        <div
                            className="flex-1 p-0 overflow-hidden"
                            style={{
                                backgroundColor: 'var(--neutral-1, #ffffff)',
                                boxShadow: 'var(--shadow-layer-1), inset 0 0 0 1px var(--neutral-6, #e5e7eb)',
                                borderRadius: 'var(--radius-lg, 8px)',
                            }}
                        >
                            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--neutral-4, #f3f4f6)' }}>
                                <h4 className="font-semibold text-sm" style={{ color: 'var(--neutral-12)' }}>Recent Requests</h4>
                            </div>
                            <div>
                                {[
                                    { name: 'Q1 Design Report', status: 'Approved', date: '2024.03.15' },
                                    { name: 'Website Redesign', status: 'In Progress', date: '2024.03.14' },
                                    { name: 'Mobile App Assets', status: 'Pending', date: '2024.03.12' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors border-b last:border-0" style={{ borderColor: 'var(--neutral-3)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100" style={{ backgroundColor: 'var(--neutral-3)', borderRadius: 'var(--radius-sm, 4px)' }}>
                                                <FileText className="w-4 h-4" style={{ color: 'var(--neutral-11)' }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: 'var(--neutral-12)' }}>{item.name}</p>
                                                <p className="text-xs" style={{ color: 'var(--neutral-10)' }}>{item.date}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`} style={{ borderRadius: 'var(--radius-full)' }}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar / Status (Span 1) */}
                    <div className="space-y-6" style={{ gridColumn: 'span 1' }}>

                        {/* System Status Card */}
                        <div
                            className="p-5"
                            style={{
                                backgroundColor: 'var(--neutral-1, #ffffff)',
                                boxShadow: 'var(--shadow-layer-1), inset 0 0 0 1px var(--neutral-6, #e5e7eb)',
                                borderRadius: 'var(--radius-lg, 8px)',
                            }}
                        >
                            <h4 className="font-semibold text-xs uppercase tracking-wide mb-4" style={{ color: 'var(--neutral-11)' }}>System Status</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"></div>
                                    <span className="text-sm font-medium" style={{ color: 'var(--neutral-12)' }}>Operational</span>
                                </div>
                                <div className="h-px w-full" style={{ backgroundColor: 'var(--neutral-4)' }}></div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span style={{ color: 'var(--neutral-11)' }}>API Uptime</span>
                                        <span className="font-medium text-green-600">99.9%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[99.9%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div
                            className="p-5"
                            style={{
                                backgroundColor: 'var(--neutral-1, #ffffff)',
                                boxShadow: 'var(--shadow-layer-1), inset 0 0 0 1px var(--neutral-6, #e5e7eb)',
                                borderRadius: 'var(--radius-lg, 8px)',
                            }}
                        >
                            <h4 className="font-semibold text-xs uppercase tracking-wide mb-4" style={{ color: 'var(--neutral-11)' }}>Quick Actions</h4>
                            <div className="space-y-2">
                                <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between group" style={{ color: 'var(--neutral-12)' }}>
                                    Create New Project
                                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between group" style={{ color: 'var(--neutral-12)' }}>
                                    Manage Team
                                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between group" style={{ color: 'var(--neutral-12)' }}>
                                    View Analytics
                                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}
