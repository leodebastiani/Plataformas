import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformService } from '../services/api';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function PlatformsList() {
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
        if (!window.confirm('Tem certeza que deseja excluir esta plataforma?')) return;
        try {
            await platformService.delete(id);
            alert('Plataforma excluída com sucesso!');
            loadPlatforms();
        } catch (error) {
            console.error('Error deleting platform:', error);
            alert('Erro ao excluir plataforma');
        }
    };

    const handleExport = async () => {
        try {
            const response = await platformService.export();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'plataformas.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting platforms:', error);
            alert('Erro ao exportar plataformas');
        }
    };

    const filteredPlatforms = platforms.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-primary">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent mb-4"></div>
                    <p className="text-secondary font-medium">Carregando plataformas...</p>
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
                        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Plataformas</h1>
                        <p className="text-secondary text-sm font-medium mt-1">Gerencie as ferramentas e licenças disponíveis.</p>
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
                            onClick={() => navigate('/platforms/new')}
                            className="bg-brand text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-brand-hover transition-all shadow-xl shadow-brand/20 active:scale-[0.98]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            Nova Plataforma
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
                                placeholder="Buscar plataformas pelo nome..."
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
                                        <th className="pl-10">Plataforma</th>
                                        <th>Status</th>
                                        <th>Licença</th>
                                        <th>Sectores</th>
                                        <th className="pr-10 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPlatforms.map((platform) => (
                                        <tr key={platform.id}>
                                            <td className="pl-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-2xl border border-border">
                                                        📊
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-primary">{platform.name}</div>
                                                        <div className="text-xs text-secondary font-medium">Platform ID: {platform.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${platform.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-muted/10 text-muted'}`}>
                                                    {platform.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-primary">{platform.licenseType}</span>
                                                    {platform.licenseQuantity && (
                                                        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">{platform.licenseQuantity} Seats</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex -space-x-2">
                                                    {(platform.sectors || []).slice(0, 3).map((s: any, i: number) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-background text-[10px] font-black flex items-center justify-center text-brand shadow-sm" title={s.name}>
                                                            {s.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                    {(platform.sectors || []).length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-bg-secondary border-2 border-white text-[10px] font-black flex items-center justify-center text-secondary shadow-sm">
                                                            +{(platform.sectors || []).length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="pr-10 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => navigate(`/platforms/edit/${platform.id}`)}
                                                        className="p-3 bg-info-light text-info rounded-xl hover:bg-info hover:text-white transition-all shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(platform.id)}
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
        </div>
    );
}
