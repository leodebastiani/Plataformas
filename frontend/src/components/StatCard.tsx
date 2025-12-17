import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    color?: 'primary' | 'success' | 'warning' | 'info';
}

export default function StatCard({ label, value, icon, trend, trendType = 'neutral', color = 'primary' }: StatCardProps) {
    const getBgColor = () => {
        switch (color) {
            case 'success': return 'linear-gradient(135deg, var(--success) 0%, #17a673 100%)';
            case 'warning': return 'linear-gradient(135deg, var(--warning) 0%, #dda20a 100%)';
            case 'info': return 'linear-gradient(135deg, var(--info) 0%, #2c9faf 100%)';
            default: return 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)';
        }
    };

    return (
        <div
            className="stat-card"
            style={{ background: getBgColor() }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="stat-card-value">{value}</div>
                    <div className="stat-card-label">{label}</div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm text-white">
                    {icon}
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center text-sm font-medium opacity-90">
                    <span className="flex items-center text-white/90">
                        {trendType === 'up' && (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        )}
                        {trendType === 'down' && (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        )}
                        {trend}
                    </span>
                </div>
            )}
        </div>
    );
}
