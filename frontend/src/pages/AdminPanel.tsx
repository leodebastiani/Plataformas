import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformService } from '../services/api';
import Footer from '../components/Footer';

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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadPlatforms();
    }, []);

    const loadPlatforms = async () => {
        try {
            const res = await platformService.getAll();
            // Get top 5 platforms (you can add logic to sort by usage)
            const topPlatforms = res.data.slice(0, 5);
            setPlatforms(topPlatforms);
        } catch (error) {
            console.error('Error loading platforms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="nav-bar">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">ServiceTrack</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/platforms')}
                                className="btn btn-secondary"
                            >
                                Platforms
                            </button>
                            <button
                                onClick={() => navigate('/users')}
                                className="btn btn-secondary"
                            >
                                Users
                            </button>
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                    <p className="text-secondary">Overview of your most used platforms</p>
                </div>

                {platforms.length === 0 ? (
                    /* Empty State */
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <h3 className="empty-state-title">Começe a registrar suas plataformas</h3>
                        <p className="empty-state-description mb-6">
                            Você ainda não tem nenhuma plataforma registrada. Comece adicionando sua primeira plataforma.
                        </p>
                        <button
                            onClick={() => navigate('/platforms/new')}
                            className="btn btn-primary"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add First Platform
                        </button>
                    </div>
                ) : (
                    /* Top 5 Platforms Grid */
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Top Platforms</h3>
                            <button
                                onClick={() => navigate('/platforms')}
                                className="btn btn-secondary text-sm"
                            >
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {platforms.map((platform) => (
                                <div
                                    key={platform.id}
                                    className="platform-card"
                                    onClick={() => navigate(`/platforms/edit/${platform.id}`)}
                                >
                                    <div className="platform-icon">
                                        {getPlatformIcon(platform.name)}
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">{platform.name}</h4>
                                    <p className="text-secondary text-sm mb-4 line-clamp-2">
                                        {platform.description || 'No description available'}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`badge ${platform.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                                            {platform.status}
                                        </span>
                                        <span className="badge badge-blue">
                                            {platform.licenseType}
                                        </span>
                                        {platform.expirationDate && (
                                            <span className="badge badge-yellow">
                                                Expires: {new Date(platform.expirationDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card hover:border-blue-500 cursor-pointer" onClick={() => navigate('/platforms/new')}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Add New Platform</h4>
                                        <p className="text-sm text-secondary">Register a new platform</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card hover:border-yellow-500 cursor-pointer" onClick={() => navigate('/users/new')}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Add New User</h4>
                                        <p className="text-sm text-secondary">Create a new user account</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
