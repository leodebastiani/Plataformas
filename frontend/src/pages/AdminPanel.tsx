import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformService, userService } from '../services/api';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

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
        const latestInfo = items.reduce((latest, item) => {
            const itemDate = item.updatedAt || item.createdAt;
            if (!itemDate) return latest;
            const date = new Date(itemDate);
            return !latest || date > latest ? date : latest;
        }, null as Date | null);
        if (!latestInfo) return 'No updates recorded';
        return `Updated: ${latestInfo.toLocaleDateString('pt-BR')} ${latestInfo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-primary">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent mb-4"></div>
                    <p className="text-secondary font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-primary">
            <Sidebar />

            <main className="main-with-sidebar bg-background flex-1">
                <header className="px-10 py-6 flex items-center justify-between border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-30">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-primary">Dashboard</h1>
                        <p className="text-secondary/60 text-xs font-bold uppercase tracking-widest mt-1">Visão Geral do Sistema</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-brand/5 border border-brand/10 rounded-full backdrop-blur-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                            </span>
                            <span className="text-[10px] font-black tracking-widest text-brand uppercase">System Active</span>
                        </div>
                        <button className="p-2.5 text-secondary/60 hover:text-brand bg-surface/50 border border-border/50 rounded-xl transition-all hover:scale-105 active:scale-95">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto w-full space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard
                            label="Total Platforms"
                            value={platforms.length}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                            trend={getLatestUpdate(platforms)}
                            color="brand"
                        />
                        <StatCard
                            label="Total Users"
                            value={users.length}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                            trend={getLatestUpdate(users)}
                            color="info"
                        />
                        <StatCard
                            label="Active Licenses"
                            value={activePlatforms}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            trend={getLatestUpdate(activePlatformsList)}
                            color="success"
                        />
                        <StatCard
                            label="Expiring Soon"
                            value={expiringSoon}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            trend={getLatestUpdate(expiringSoonList)}
                            color="warning"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <div className="card border-info/10">
                                <div className="flex justify-between items-center mb-10 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-info rounded-full"></div>
                                        <h3 className="text-xl font-black text-primary tracking-tight">Recent Platforms</h3>
                                    </div>
                                    <button onClick={() => navigate('/platforms')} className="text-info/80 hover:text-info transition-colors font-black text-xs uppercase tracking-widest">
                                        Explorar Todas →
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Plataforma</th>
                                                <th>Status</th>
                                                <th>Tipo</th>
                                                <th className="text-right">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {platforms.slice(0, 5).map((platform) => (
                                                <tr key={platform.id} className="group/row">
                                                    <td className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-2xl border border-border group-hover/row:border-brand/40 transition-colors">
                                                            {getPlatformIcon(platform.name)}
                                                        </div>
                                                        <span className="font-bold text-primary group-hover/row:text-brand transition-colors">{platform.name}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${platform.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-muted/10 text-muted'}`}>
                                                            {platform.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="text-sm font-semibold text-secondary">{platform.licenseType}</span>
                                                    </td>
                                                    <td className="text-right">
                                                        <button onClick={() => navigate(`/platforms/edit/${platform.id}`)} className="p-2 text-info hover:text-white hover:bg-info bg-info/5 rounded-lg transition-all font-bold text-xs uppercase tracking-widest">
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="card border-brand/30 shadow-lg shadow-brand/5">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-2 h-8 bg-brand rounded-full"></div>
                                    <h3 className="text-xl font-black text-primary tracking-tight">Atalhos</h3>
                                </div>
                                <div className="space-y-5">
                                    <button
                                        onClick={() => navigate('/platforms/new')}
                                        className="w-full bg-brand text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-hover transition-all shadow-xl shadow-brand/20 active:scale-[0.98]"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                        Nova Plataforma
                                    </button>
                                    <button
                                        onClick={() => navigate('/users/new')}
                                        className="w-full bg-info text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-info/90 transition-all shadow-xl shadow-info/10 active:scale-[0.98]"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                        Novo Usuário
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </div >
    );
}
