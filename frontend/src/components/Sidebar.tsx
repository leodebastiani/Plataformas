import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <aside className="sidebar border-r border-border bg-background">
            <div className="sidebar-header flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-lg shadow-brand/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <span className="font-bold text-2xl tracking-tight text-brand">ServiceTrack</span>
            </div>

            <nav className="sidebar-menu flex-1 px-4 mt-6">
                <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                </Link>

                <Link to="/users" className={`sidebar-item ${isActive('/users')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Users
                </Link>

                <Link to="/platforms" className={`sidebar-item ${isActive('/platforms')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Platforms
                </Link>
            </nav>

            <div className="mt-auto p-4 border-t border-border/50 bg-secondary/30">
                <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-surface/50 border border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold border border-brand/20 shadow-lg shadow-brand/5">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-primary truncate leading-tight">{user.name || 'Admin User'}</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-wider truncate">{user.position || 'System Admin'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-danger bg-danger/5 hover:bg-danger/10 border border-danger/40 rounded-xl transition-all active:scale-[0.98]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout System
                </button>
            </div>

            <style>{`
                .sidebar-item.active {
                    background-color: var(--primary-light);
                    color: var(--primary);
                }
            `}</style>
        </aside>
    );
}
