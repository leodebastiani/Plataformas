export default function Footer() {
    return (
        <footer className="footer mt-auto">
            <div className="px-6">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="badge badge-yellow">BETA</span>
                        <span className="text-sm text-secondary">
                            ServiceTrack is a software, made by{' '}
                            <span className="text-primary font-medium">Leonardo Debastiani</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
