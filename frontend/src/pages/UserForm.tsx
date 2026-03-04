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
            if (id) await userService.update(id, dataToSend);
            else await userService.create(dataToSend);
            navigate('/users');
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Erro ao salvar usuário');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-primary">
            <Sidebar />

            <main className="main-with-sidebar flex-1">
                <header className="px-10 py-8 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-primary">{id ? 'Editar Usuário' : 'Novo Usuário'}</h1>
                        <p className="text-secondary text-sm font-medium mt-1">Preencha os dados cadastrais abaixo.</p>
                    </div>
                    <button onClick={() => navigate('/users')} className="btn btn-secondary py-4 rounded-2xl font-bold px-8">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Voltar
                    </button>
                </header>

                <div className="p-10 max-w-4xl mx-auto w-full">
                    <div className="card p-10 sm:p-12">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand"
                                        placeholder="Ex: João Silva"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Email Corporativo</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand"
                                        placeholder="joao@empresa.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-border">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Setor</label>
                                    <select
                                        value={formData.sector}
                                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand appearance-none"
                                    >
                                        <option value="">Selecionar Setor</option>
                                        {sectors.map((s) => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Cargo</label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand"
                                        placeholder="Ex: Gerente"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand appearance-none"
                                    >
                                        <option value="ACTIVE">Ativo</option>
                                        <option value="INACTIVE">Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-border">
                                <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Atribuir Plataformas</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {platformsList.map((p) => (
                                        <label
                                            key={p.id}
                                            className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all cursor-pointer text-center group ${formData.platforms.includes(p.id)
                                                ? 'bg-brand/5 border-brand text-brand shadow-lg shadow-brand/5'
                                                : 'bg-surface border-border text-secondary hover:border-brand/40'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.platforms.includes(p.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setFormData({ ...formData, platforms: [...formData.platforms, p.id] });
                                                    else setFormData({ ...formData, platforms: formData.platforms.filter(id => id !== p.id) });
                                                }}
                                            />
                                            <span className="text-2xl mb-2">📊</span>
                                            <span className="text-xs font-black uppercase tracking-widest truncate w-full">{p.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand/20 hover:bg-brand-hover transition-all mt-6 active:scale-[0.98]"
                            >
                                {loading ? 'Salvando...' : (id ? 'Atualizar Usuário' : 'Criar Usuário')}
                            </button>
                        </form>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
