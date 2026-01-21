'use client';

import { useState } from 'react';
import { Bell, Search, User, Check, FileText, Plus, Users, BarChart3, ChevronRight } from 'lucide-react';

export default function LivePreview() {
    const [isApproved, setIsApproved] = useState(false);

    return (
        <div className="p-4 relative min-h-[500px]">
            {/* Simulation of an App Interface */}
            <div className="ring-2 ring-inset border overflow-hidden w-full transition-all"
                style={{
                    backgroundColor: 'var(--neutral-1)',
                    boxShadow: 'var(--shadow-layer-5)',
                    borderRadius: 'var(--radius-lg, 8px)',
                    borderWidth: '1px',
                    borderColor: 'var(--neutral-6, #e5e7eb)'
                }}>

                {/* App Header */}
                <div
                    className="h-14 flex items-center justify-between px-4"
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
                        <span className="font-bold text-base" style={{ color: 'var(--neutral-12, #1f2937)' }}>대시보드</span>
                    </div>
                    <div className="flex items-center gap-3" style={{ color: 'var(--neutral-11, #9ca3af)' }}>
                        <Search className="w-4 h-4 cursor-pointer hover:text-gray-900 transition-colors" />
                        <Bell className="w-4 h-4 cursor-pointer hover:text-gray-900 transition-colors" />
                        <div className="w-7 h-7 overflow-hidden cursor-pointer flex items-center justify-center" style={{ backgroundColor: 'var(--neutral-3, #e5e7eb)', borderRadius: 'var(--radius-full, 9999px)' }}>
                            <User className="w-4 h-4" style={{ color: 'var(--neutral-11, #6b7280)' }} />
                        </div>
                    </div>
                </div>

                {/* App Content */}
                <div
                    style={{
                        backgroundColor: 'var(--neutral-2, #f9fafb)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        padding: '16px'
                    }}
                >

                    {/* 1. Stat Cards Row */}
                    {[
                        { label: '총 매출', value: '₩45,231,000', trend: '+20.1%', positive: true },
                        { label: '활성 사용자', value: '2,350', trend: '+180.1%', positive: true },
                        { label: '이탈률', value: '12.23%', trend: '-4.3%', positive: false },
                        { label: '현재 접속자', value: '573', trend: '+201', positive: true },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="p-4 flex flex-col justify-between"
                            style={{
                                backgroundColor: 'var(--neutral-1, #ffffff)',
                                boxShadow: 'var(--shadow-layer-1), inset 0 0 0 1px var(--neutral-6, #e5e7eb)',
                                borderRadius: 'var(--radius-lg, 8px)',
                                gridColumn: 'span 1'
                            }}
                        >
                            <span className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2" style={{ color: 'var(--neutral-11)' }}>
                                {stat.label}
                            </span>
                            <div className="flex items-end justify-between gap-1 overflow-hidden">
                                <span className="text-xl font-bold truncate" style={{ color: 'var(--neutral-12)' }}>{stat.value}</span>
                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${stat.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* 2. Main Content & Sidebar Split */}

                    {/* Left: Main Chart/Actions Area (Span 2) */}
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Hero Section */}
                        <div
                            className="p-6 relative overflow-hidden flex flex-col justify-center min-h-[140px]"
                            style={{
                                background: `linear-gradient(135deg, var(--primary-9, #3b82f6), var(--primary-10, #1d4ed8))`,
                                color: 'var(--primary-foreground, #ffffff)',
                                borderRadius: 'var(--radius-lg, 8px)',
                                boxShadow: 'var(--shadow-layer-2)',
                            }}
                        >
                            <div className="relative z-10 max-w-lg">
                                <h3 className="font-bold text-xl mb-1">다시 오신 것을 환영합니다!</h3>
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
                                        시작하기
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
                                        문서 보기
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
                            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--neutral-4, #f3f4f6)' }}>
                                <h4 className="font-bold text-xs uppercase tracking-widest" style={{ color: 'var(--neutral-11)' }}>최근 요청</h4>
                            </div>
                            <div>
                                {[
                                    { name: '1분기 디자인 보고서', status: '승인됨', date: '2024.03.15' },
                                    { name: '웹사이트 리디자인', status: '진행 중', date: '2024.03.14' },
                                    { name: '모바일 앱 에셋', status: '대기 중', date: '2024.03.12' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-0" style={{ borderColor: 'var(--neutral-3)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100" style={{ backgroundColor: 'var(--neutral-3)', borderRadius: 'var(--radius-sm, 4px)' }}>
                                                <FileText className="w-4 h-4" style={{ color: 'var(--neutral-11)' }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: 'var(--neutral-12)' }}>{item.name}</p>
                                                <p className="text-xs" style={{ color: 'var(--neutral-10)' }}>{item.date}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === '승인됨' ? 'bg-green-100 text-green-700' :
                                            item.status === '진행 중' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`} style={{ borderRadius: 'var(--radius-full)' }}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar / Status (Span 2) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ gridColumn: 'span 2' }}>

                        {/* 시스템 상태 카드 */}
                        <div
                            className="p-4 flex flex-col justify-start gap-4"
                            style={{
                                backgroundColor: 'var(--neutral-1, #ffffff)',
                                boxShadow: 'var(--shadow-layer-1), inset 0 0 0 1px var(--neutral-6, #e5e7eb)',
                                borderRadius: 'var(--radius-lg, 8px)',
                            }}
                        >
                            <h4 className="font-bold text-xs uppercase tracking-widest" style={{ color: 'var(--neutral-11)' }}>시스템 상태</h4>
                            <div className="space-y-4">
                                <div className="p-3 rounded-xl flex items-center justify-between transition-colors" style={{ backgroundColor: 'var(--neutral-2)' }}>
                                    <div className="flex items-center gap-2.5">
                                        <div className="relative">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-40"></div>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: 'var(--neutral-12)' }}>운영 중</span>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-600">Stable</span>
                                </div>
                                <div className="space-y-2.5 px-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] font-medium" style={{ color: 'var(--neutral-11)' }}>API 가동률</span>
                                        <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--primary-11)' }}>99.9%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-primary-9 w-[99.9%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                                            style={{ backgroundColor: 'var(--primary-9)' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 빠른 작업 카드 */}
                        <div
                            className="p-4"
                            style={{
                                backgroundColor: 'var(--neutral-1, #ffffff)',
                                boxShadow: 'var(--shadow-layer-1), inset 0 0 0 1px var(--neutral-6, #e5e7eb)',
                                borderRadius: 'var(--radius-lg, 8px)',
                            }}
                        >
                            <h4 className="font-bold text-xs uppercase tracking-widest" style={{ color: 'var(--neutral-11)' }}>빠른 작업</h4>
                            <div className="mt-4 space-y-1.5">
                                {[
                                    { name: '새 프로젝트 생성', icon: Plus, bg: 'var(--primary-3, #eff6ff)', color: 'var(--primary-11, #1d4ed8)' },
                                    { name: '팀 관리', icon: Users, bg: 'transparent', color: 'var(--neutral-12)' },
                                    { name: '분석 보기', icon: BarChart3, bg: 'transparent', color: 'var(--neutral-12)' },
                                ].map((action, i) => (
                                    <button
                                        key={i}
                                        className="w-full px-3 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-between group hover:bg-gray-50 active:scale-[0.98]"
                                        style={{
                                            backgroundColor: action.bg !== 'transparent' ? action.bg : 'transparent',
                                            color: action.color
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <action.icon className="w-4 h-4" />
                                            {action.name}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}
