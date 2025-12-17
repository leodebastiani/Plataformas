import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { platformService, sectorService } from '../services/api';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function PlatformForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sectorsList, setSectorsList] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sectors: [] as string[],
        licenseType: 'UNLIMITED',
        licenseQuantity: '',
        expirationDate: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        loadData();
        if (id) loadPlatform();
    }, [id]);

    const loadData = async () => {
        try {
            const sectorsRes = await sectorService.getAll();
            setSectorsList(sectorsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const loadPlatform = async () => {
        try {
            const res = await platformService.getAll();
            const platform = res.data.find((p: any) => p.id === id);
            if (platform) {
                setFormData({
                    name: platform.name,
                    description: platform.description || '',
                    sectors: platform.sectors ? platform.sectors.map((s: any) => s.id) : [],
                    licenseType: platform.licenseType,
                    licenseQuantity: platform.licenseQuantity || '',
                    expirationDate: platform.expirationDate ? platform.expirationDate.split('T')[0] : '',
                    status: platform.status,
                });
            }
        } catch (error) {
            console.error('Error loading platform:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                ...formData,
                licenseQuantity: formData.licenseQuantity ? parseInt(formData.licenseQuantity as string) : null,
                expirationDate: formData.expirationDate || null,
            };

            if (id) {
                await platformService.update(id, dataToSend);
            } else {
                await platformService.create(dataToSend);
            }
            navigate('/platforms');
        } catch (error) {
            console.error('Error saving platform:', error);
            alert('Error saving platform');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="main-with-sidebar">
                <div className="top-nav">
                    <h1 className="text-xl font-bold text-gray-800">{id ? 'Edit Platform' : 'New Platform'}</h1>
                    <button onClick={() => navigate('/platforms')} className="btn btn-secondary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Platforms
                    </button>
                </div>

                <div className="p-8 max-w-4xl mx-auto">
                    <div className="mb-6">
                        <p className="text-secondary">
                            {id ? 'Update platform information' : 'Register a new platform'}
                        </p>
                    </div>

                    <div className="card">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    Platform Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Slack, GitHub, Notion"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input"
                                    rows={3}
                                    placeholder="Brief description of the platform..."
                                />
                            </div>

                            {/* Sectors */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    Sectors
                                </label>
                                <div className="card bg-hover max-h-64 overflow-y-auto">
                                    {sectorsList.length === 0 ? (
                                        <p className="text-sm text-secondary">No sectors available</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {sectorsList.map((sector) => (
                                                <label key={sector.id} className="flex items-center cursor-pointer hover:bg-primary/5 p-3 rounded-lg transition">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.sectors.includes(sector.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, sectors: [...formData.sectors, sector.id] });
                                                            } else {
                                                                setFormData({ ...formData, sectors: formData.sectors.filter(id => id !== sector.id) });
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="ml-3 text-sm">{sector.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* License Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">
                                    License Type
                                </label>
                                <select
                                    value={formData.licenseType}
                                    onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                                    className="input"
                                >
                                    <option value="UNLIMITED">Unlimited</option>
                                    <option value="LIMITED">Limited</option>
                                </select>
                            </div>

                            {/* License Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.licenseType === 'LIMITED' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-secondary">
                                            License Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.licenseQuantity}
                                            onChange={(e) => setFormData({ ...formData, licenseQuantity: e.target.value })}
                                            className="input"
                                            placeholder="Number of licenses"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-secondary">
                                        Expiration Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.expirationDate}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                        className="input"
                                    />
                                </div>

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
                                        id ? 'Update Platform' : 'Create Platform'
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
