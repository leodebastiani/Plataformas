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
            alert('Erro ao salvar plataforma');
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
                        <h1 className="text-3xl font-extrabold tracking-tight text-primary">{id ? 'Editar Plataforma' : 'Nova Plataforma'}</h1>
                        <p className="text-secondary text-sm font-medium mt-1">Preencha as informações abaixo.</p>
                    </div>
                    <button onClick={() => navigate('/platforms')} className="btn btn-secondary py-4 rounded-2xl font-bold px-8">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Voltar
                    </button>
                </header>

                <div className="p-10 max-w-4xl mx-auto w-full">
                    <div className="card p-10 sm:p-12">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Nome da Plataforma</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand"
                                        placeholder="Ex: Slack, GitHub"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand appearance-none"
                                    >
                                        <option value="ACTIVE">Ativa</option>
                                        <option value="INACTIVE">Inativa</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input focus:ring-4 focus:ring-brand/5 focus:border-brand"
                                    rows={4}
                                    placeholder="Uma breve descrição da ferramenta..."
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Setores com Acesso</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {sectorsList.map((sector) => (
                                        <label
                                            key={sector.id}
                                            className={`flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer group ${formData.sectors.includes(sector.id)
                                                ? 'bg-brand/5 border-brand text-brand shadow-lg shadow-brand/5'
                                                : 'bg-surface border-border text-secondary hover:border-brand/40'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.sectors.includes(sector.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setFormData({ ...formData, sectors: [...formData.sectors, sector.id] });
                                                    else setFormData({ ...formData, sectors: formData.sectors.filter(id => id !== sector.id) });
                                                }}
                                            />
                                            <span className="text-sm font-black truncate">{sector.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-border">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Tipo de Licença</label>
                                    <select
                                        value={formData.licenseType}
                                        onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand appearance-none"
                                    >
                                        <option value="UNLIMITED">Ilimitada</option>
                                        <option value="LIMITED">Limitada</option>
                                    </select>
                                </div>
                                <div className={`space-y-3 transition-opacity ${formData.licenseType === 'LIMITED' ? 'opacity-100' : 'opacity-30'}`}>
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Quantidade</label>
                                    <input
                                        type="number"
                                        disabled={formData.licenseType !== 'LIMITED'}
                                        value={formData.licenseQuantity}
                                        onChange={(e) => setFormData({ ...formData, licenseQuantity: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Expiração</label>
                                    <input
                                        type="date"
                                        value={formData.expirationDate}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                        className="input focus:ring-4 focus:ring-brand/5 focus:border-brand appearance-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand/20 hover:bg-brand-hover transition-all mt-6 active:scale-[0.98]"
                            >
                                {loading ? 'Salvando...' : (id ? 'Atualizar Plataforma' : 'Criar Plataforma')}
                            </button>
                        </form>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
