import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformService, userService } from '../services/api';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

// Platform icons mapping
const platformIcons: { [key: string]: string } = {
    'default': '📊',
    'analytics': '📈',
    'communication': '💬',
    'storage': '💾',
    'security': '🔒',
    'productivity': '⚡',
    'development': '💻',
    'design': '🎨',
};

export default function AdminPanel() {
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [platformsRes, usersRes] = await Promise.all([
                platformService.getAll(),
                userService.getAll()
            ]);

            setPlatforms(platformsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPlatformIcon = (platformName: string) => {
        const name = platformName.toLowerCase();
        if (name.includes('analytics') || name.includes('data')) return platformIcons.analytics;
        if (name.includes('chat') || name.includes('slack') || name.includes('teams')) return platformIcons.communication;
        if (name.includes('drive') || name.includes('storage') || name.includes('cloud')) return platformIcons.storage;
        if (name.includes('security') || name.includes('auth')) return platformIcons.security;
        if (name.includes('code') || name.includes('git') || name.includes('dev')) return platformIcons.development;
        if (name.includes('design') || name.includes('figma')) return platformIcons.design;
        if (name.includes('productivity') || name.includes('notion')) return platformIcons.productivity;
        return platformIcons.default;
    };

    const activePlatformsList = platforms.filter(p => p.status === 'ACTIVE');
    const activePlatforms = activePlatformsList.length;

    const expiringSoonList = platforms.filter(p => {
        if (!p.expirationDate) return false;
        const exp = new Date(p.expirationDate);
        const now = new Date();
        const diffTime = exp.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 30;
    });
    const expiringSoon = expiringSoonList.length;
    const getLatestUpdate = (items: any[]) => {
        if (!items || items.length === 0) return 'No data';

        // Find the most recent date from updatedAt or createdAt
        const latestInfo = items.reduce((latest, item) => {
            const itemDate = item.updatedAt || item.createdAt;
            if (!itemDate) return latest;

            const date = new Date(itemDate);
            return !latest || date > latest ? date : latest;
        }, null as Date | null);

        if (!latestInfo) {
            return 'No updates recorded';
        }

        return `Updated: ${latestInfo.toLocaleDateString('pt-BR')} ${latestInfo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const platformsLastUpdated = getLatestUpdate(platforms);
    // Since we don't have the full users array with dates in the state (only count), 
    // we need to verify if we should fetch full users or if we can accept using the current fetch time for users if data is missing.
    // However, in loadData we fetched usersRes.data. Let's store users in state or just the date.
    // To properly fix this, I need to modify the state to store users or at least their max updated date.
    // For now, I'll calculate it inside the render assuming I have access, but wait, `usersCount` is just a number.
    // I need to change `loadData` to store the users list or the latest date.

    // Let's modify the component state to store the users list as well, or at least the timestamp.

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="main-with-sidebar">
                <div className="top-nav">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            <svg className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            label="Total Platforms"
                            value={platforms.length}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            }
                            trend={platformsLastUpdated}
                            trendType="neutral"
                            color="primary"
                        />
                        <StatCard
                            label="Total Users"
                            value={users.length}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                            trend={getLatestUpdate(users)}
                            trendType="neutral"
                            color="info"
                        />
                        <StatCard
                            label="Active Licenses"
                            value={activePlatforms}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            trend={getLatestUpdate(activePlatformsList)}
                            trendType="neutral"
                            color="success"
                        />
                        <StatCard
                            label="Expiring Soon"
                            value={expiringSoon}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            trend={getLatestUpdate(expiringSoonList)}
                            trendType="neutral"
                            color="warning"
                        />
                    </div>

                    {/* Quick Actions & Recent */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Platforms */}
                        <div className="lg:col-span-2 card">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="card-header mb-0">Recent Platforms</h3>
                                <button onClick={() => navigate('/platforms')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Platform</th>
                                            <th>Status</th>
                                            <th>License</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {platforms.slice(0, 5).map((platform) => (
                                            <tr key={platform.id}>
                                                <td className="flex items-center gap-3">
                                                    <span className="text-xl">{getPlatformIcon(platform.name)}</span>
                                                    <span className="font-medium">{platform.name}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${platform.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                                                        {platform.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-sm text-gray-600">{platform.licenseType}</span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => navigate(`/platforms/edit/${platform.id}`)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {platforms.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                                    No platforms found. Add your first one!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            <div className="card bg-white">
                                <h3 className="card-header">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/platforms/new')}
                                        className="w-full btn btn-primary justify-center py-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add New Platform
                                    </button>
                                    <button
                                        onClick={() => navigate('/users/new')}
                                        className="w-full btn btn-secondary justify-center py-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Add New User
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
