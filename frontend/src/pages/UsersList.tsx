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
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
        try {
            await userService.delete(id);
            alert('Usuário excluído com sucesso!');
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erro ao excluir usuário');
        }
    };

    const handleExport = async () => {
        try {
            const response = await userService.export();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'usuarios.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting users:', error);
            alert('Erro ao exportar usuários');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-primary">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent mb-4"></div>
                    <p className="text-secondary font-medium">Carregando usuários...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-primary">
            <Sidebar />

            <main className="main-with-sidebar flex-1">
                <header className="px-10 py-8 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Usuários</h1>
                        <p className="text-secondary text-sm font-medium mt-1">Gerencie os acessos e permissões do sistema.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExport}
                            className="bg-[#10B981] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#059669] transition-all shadow-xl shadow-[#10B981]/20 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Exportar Excel
                        </button>
                        <button
                            onClick={() => navigate('/users/new')}
                            className="bg-brand text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-brand-hover transition-all shadow-xl shadow-brand/20 active:scale-[0.98]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            Novo Usuário
                        </button>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto w-full">
                    <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:w-[480px]">
                            <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-muted">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar usuários por nome ou email..."
                                className="input pl-14 py-4 rounded-2xl focus:ring-4 focus:ring-brand/5 focus:border-brand"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="card p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th className="pl-10">Usuário</th>
                                        <th>Email</th>
                                        <th>Acessos</th>
                                        <th>Status</th>
                                        <th className="pr-10 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="pl-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center font-black text-sm border border-brand/10">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-primary">{user.name}</div>
                                                        <div className="text-xs text-secondary font-medium uppercase tracking-wider">{user.position || user.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-sm font-semibold text-secondary">{user.email}</td>
                                            <td>
                                                <button
                                                    onClick={() => { setSelectedUser(user); setShowPlatformsModal(true); }}
                                                    className="bg-brand-light text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-transform"
                                                >
                                                    {user.platforms?.length || 0} Plataformas
                                                </button>
                                            </td>
                                            <td>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${user.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-muted/10 text-muted'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="pr-10 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => navigate(`/users/edit/${user.id}`)}
                                                        className="p-3 bg-info-light text-info rounded-xl hover:bg-info hover:text-white transition-all shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-3 bg-danger-light text-danger rounded-xl hover:bg-danger hover:text-white transition-all shadow-sm"
                                                        title="Excluir"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>

            {/* Platforms Modal */}
            {showPlatformsModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content card p-10 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-primary tracking-tight">Acessos de {selectedUser.name}</h3>
                            <button onClick={() => setShowPlatformsModal(false)} className="text-muted hover:text-primary transition-colors">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        {selectedUser.platforms && selectedUser.platforms.length > 0 ? (
                            <ul className="space-y-4 mb-10 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {selectedUser.platforms.map((platform: any, index: number) => (
                                    <li key={index} className="flex items-center p-5 bg-bg-primary border border-border rounded-2xl group hover:border-brand/40 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center mr-5 text-brand border border-brand/10">
                                            📊
                                        </div>
                                        <span className="text-primary font-bold text-lg">{platform.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-16 text-muted bg-bg-primary rounded-3xl mb-10 border-2 border-dashed border-border">
                                <p className="font-bold">Nenhuma plataforma atribuída.</p>
                            </div>
                        )}
                        <button
                            onClick={() => setShowPlatformsModal(false)}
                            className="w-full bg-brand text-white py-4 rounded-2xl font-black shadow-lg shadow-brand/10 active:scale-[0.98] transition-transform"
                        >
                            FECHAR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
