import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import Footer from '../components/Footer';

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
                            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                                Dashboard
                            </button>
                            <button onClick={handleExport} className="btn btn-accent">
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
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Users</h2>
                    <p className="text-secondary">Manage all your users</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    <th>Role</th>
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
                                            <span className={`badge ${user.role === 'ADMIN' ? 'badge-yellow' : 'badge-blue'}`}>
                                                {user.role}
                                            </span>
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

            <Footer />
        </div>
    );
}
