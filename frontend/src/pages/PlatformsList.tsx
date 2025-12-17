import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformService } from '../services/api';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function PlatformsList() {
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
    const [showSectorsModal, setShowSectorsModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadPlatforms();
    }, []);

    const loadPlatforms = async () => {
        try {
            const res = await platformService.getAll();
            setPlatforms(res.data);
        } catch (error) {
            console.error('Error loading platforms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        // if (!confirm('Are you sure you want to delete this platform?')) return;

        try {
            const response = await platformService.delete(id);
            console.log('Delete response:', response);
            alert('Platform deleted successfully!');
            loadPlatforms();
        } catch (error: any) {
            console.error('Error deleting platform:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error deleting platform';
            alert(`Failed to delete platform: ${errorMessage}`);
        }
    };

    const handleExport = async () => {
        try {
            const res = await platformService.export();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'platforms.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting platforms:', error);
            alert('Error exporting platforms');
        }
    };

    const filteredPlatforms = platforms.filter(platform =>
        platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="main-with-sidebar">
                {/* Top Navigation */}
                <div className="top-nav">
                    <h1 className="text-xl font-bold text-gray-800">Platforms</h1>
                    <div className="flex items-center gap-3">
                        <button onClick={handleExport} className="btn btn-secondary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export
                        </button>
                        <button onClick={() => navigate('/platforms/new')} className="btn btn-primary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Platform
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8">
                    {/* Search Bar */}
                    <div className="mb-6 max-w-md">
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search platforms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-12"
                            />
                        </div>
                    </div>

                    {/* Platforms Table */}
                    {filteredPlatforms.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🔍</div>
                            <h3 className="empty-state-title">
                                {searchTerm ? 'No platforms found' : 'No platforms yet'}
                            </h3>
                            <p className="empty-state-description">
                                {searchTerm ? 'Try adjusting your search' : 'Start by creating your first platform'}
                            </p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Platform</th>
                                        <th>Sectors</th>
                                        <th>License</th>
                                        <th>Expiration</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPlatforms.map((platform) => (
                                        <tr key={platform.id}>
                                            <td>
                                                <div>
                                                    <div className="font-semibold">{platform.name}</div>
                                                    <div className="text-sm text-secondary truncate max-w-xs">
                                                        {platform.description || 'No description'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setSelectedPlatform(platform);
                                                        setShowSectorsModal(true);
                                                    }}
                                                    className="badge badge-blue hover:bg-blue-600 cursor-pointer transition"
                                                >
                                                    {platform.sectors && platform.sectors.length > 0
                                                        ? `${platform.sectors.length} setor${platform.sectors.length > 1 ? 'es' : ''}`
                                                        : 'Ver setores'
                                                    }
                                                </button>
                                            </td>
                                            <td>
                                                <span className="badge badge-blue">
                                                    {platform.licenseType === 'LIMITED'
                                                        ? `${platform.licenseQuantity || 0} licenses`
                                                        : 'Unlimited'}
                                                </span>
                                            </td>
                                            <td className="text-sm">
                                                {platform.expirationDate
                                                    ? new Date(platform.expirationDate).toLocaleDateString()
                                                    : <span className="text-secondary">-</span>}
                                            </td>
                                            <td>
                                                <span className={`badge ${platform.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                                                    {platform.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/platforms/edit/${platform.id}`)}
                                                        className="text-blue-500 hover:text-blue-400 font-medium text-sm transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(platform.id)}
                                                        className="text-red-500 hover:text-red-400 font-medium text-sm transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Sectors Modal */}
                {showSectorsModal && selectedPlatform && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Setores de {selectedPlatform.name}</h3>
                                <button onClick={() => setShowSectorsModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {selectedPlatform.sectors && selectedPlatform.sectors.length > 0 ? (
                                <ul className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
                                    {selectedPlatform.sectors.map((sector: any, index: number) => (
                                        <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700 font-medium">{sector.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg mb-6">
                                    <p>Esta plataforma não está atribuída a nenhum setor.</p>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button onClick={() => setShowSectorsModal(false)} className="btn btn-secondary">
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </div>
    );
}
