export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full mt-auto py-8">
            <div className="px-6 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 py-2 px-4 rounded-full bg-secondary/5 border border-border/30 backdrop-blur-sm">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-secondary/60 uppercase">
                        V1.2 Alpha Stage
                    </span>
                </div>

                <div className="text-center group">
                    <p className="text-sm text-secondary/40 font-medium">
                        © {currentYear} Plataformas • Handcrafted by
                        <span className="text-primary/70 transition-all duration-300 ml-1">
                            Leonardo Debastiani
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
