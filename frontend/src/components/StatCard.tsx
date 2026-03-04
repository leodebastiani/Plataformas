import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    color?: 'brand' | 'success' | 'warning' | 'info' | 'danger';
}

export default function StatCard({ label, value, icon, trend, color = 'brand' }: StatCardProps) {
    return (
        <div className={`stat-card group border-${color}/20 hover:border-${color}/60`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-${color}-light text-${color} transition-transform group-hover:scale-110 shadow-lg shadow-${color}/10`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-secondary font-semibold text-[10px] uppercase tracking-[0.2em] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">{label}</p>
                <h3 className="stat-card-value text-primary tracking-tighter">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] font-bold text-muted bg-surface/50 px-2 py-1 rounded-md border border-border">
                            {trend}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
