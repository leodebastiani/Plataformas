import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService, sectorService, platformService } from '../services/api';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sectors, setSectors] = useState<any[]>([]);
    const [platformsList, setPlatformsList] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        sector: '',
        position: '',
        status: 'ACTIVE',
        platforms: [] as string[],
    });

    useEffect(() => {
        loadData();
        if (id) loadUser();
    }, [id]);

    const loadData = async () => {
        try {
            const [sectorsRes, platformsRes] = await Promise.all([
                sectorService.getAll(),
                platformService.getAll(),
            ]);
            setSectors(sectorsRes.data);
            setPlatformsList(platformsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const loadUser = async () => {
        try {
            const res = await userService.getAll();
            const user = res.data.find((u: any) => u.id === id);
            if (user) {
                setFormData({
                    name: user.name,
                    email: user.email,
                    sector: user.sector || '',
                    position: user.position || '',
                    status: user.status,
                    platforms: user.platforms ? user.platforms.map((p: any) => p.id) : [],
                });
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = { ...formData, role: 'ADMIN' };

            if (id) {
                await userService.update(id, dataToSend);
            } else {
                await userService.create(dataToSend);
            }
            navigate('/users');
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="main-with-sidebar">
                <div className="top-nav">
                    <h1 className="text-xl font-bold text-gray-800">{id ? 'Edit User' : 'New User'}</h1>
                    <button onClick={() => navigate('/users')} className="btn btn-secondary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Users
                    </button>
                </div>

                <div className="p-8 max-w-4xl mx-auto">
                    <div className="mb-6">
                        <p className="text-secondary">
                            {id ? 'Update user information' : 'Create a new user account'}
                        </p>
                    </div>

                    <div className="card">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            {/* Sector and Position */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-secondary">
                                        Sector
                                    </label>
                                    <select
                                        value={formData.sector}
                                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                        className="input"
                                    >
                                        <option value="">Select Sector</option>
                                        {sectors.map((sector) => (
                                            <option key={sector.id} value={sector.name}>{sector.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-secondary">
                                        Position
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="input"
                                        placeholder="e.g., Developer, Manager"
                                    />
                                </div>
                            </div>

                            {/* Assigned Platforms */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    Assigned Platforms
                                </label>
                                <div className="card bg-hover max-h-64 overflow-y-auto">
                                    {platformsList.length === 0 ? (
                                        <p className="text-sm text-secondary">No platforms available</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {platformsList.map((platform) => (
                                                <label key={platform.id} className="flex items-center cursor-pointer hover:bg-primary/5 p-3 rounded-lg transition">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.platforms.includes(platform.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, platforms: [...formData.platforms, platform.id] });
                                                            } else {
                                                                setFormData({ ...formData, platforms: formData.platforms.filter(id => id !== platform.id) });
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="ml-3 text-sm">{platform.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="input"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        id ? 'Update User' : 'Create User'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
