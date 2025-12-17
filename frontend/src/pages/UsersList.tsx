import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showPlatformsModal, setShowPlatformsModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await userService.getAll();
            setUsers(res.data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        // if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await userService.delete(id);
            console.log('Delete response:', response);
            alert('User deleted successfully!');
            loadUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error deleting user';
            alert(`Failed to delete user: ${errorMessage}`);
        }
    };

    const handleExport = async () => {
        try {
            const res = await userService.export();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting users:', error);
            alert('Error exporting users');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="main-with-sidebar">
                {/* Top Navigation */}
                <div className="top-nav">
                    <h1 className="text-xl font-bold text-gray-800">Users</h1>
                    <div className="flex items-center gap-3">
                        <button onClick={handleExport} className="btn btn-secondary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export
                        </button>
                        <button onClick={() => navigate('/users/new')} className="btn btn-primary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New User
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
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-12"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    {filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">👥</div>
                            <h3 className="empty-state-title">
                                {searchTerm ? 'No users found' : 'No users yet'}
                            </h3>
                            <p className="empty-state-description">
                                {searchTerm ? 'Try adjusting your search' : 'Start by creating your first user'}
                            </p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Acessos</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-semibold text-white text-sm">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{user.name}</div>
                                                        {user.position && (
                                                            <div className="text-sm text-secondary">{user.position}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-sm">{user.email}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowPlatformsModal(true);
                                                    }}
                                                    className="badge badge-blue hover:bg-blue-600 cursor-pointer transition"
                                                >
                                                    {user.platforms && user.platforms.length > 0
                                                        ? `${user.platforms.length} plataforma${user.platforms.length > 1 ? 's' : ''}`
                                                        : 'Ver acessos'
                                                    }
                                                </button>
                                            </td>
                                            <td>
                                                <span className={`badge ${user.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/users/edit/${user.id}`)}
                                                        className="text-blue-500 hover:text-blue-400 font-medium text-sm transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
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

                {/* Platforms Modal */}
                {showPlatformsModal && selectedUser && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Acessos de {selectedUser.name}</h3>
                                <button onClick={() => setShowPlatformsModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {selectedUser.platforms && selectedUser.platforms.length > 0 ? (
                                <ul className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
                                    {selectedUser.platforms.map((platform: any, index: number) => (
                                        <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700 font-medium">{platform.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg mb-6">
                                    <p>Este usuário não possui acessos a plataformas.</p>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button onClick={() => setShowPlatformsModal(false)} className="btn btn-secondary">
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
