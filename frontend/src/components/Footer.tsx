export default function Footer() {
    return (
        <footer className="footer">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="badge badge-yellow">BETA</span>
                        <span className="text-sm text-secondary">
                            ServiceTrack is open source software, made by{' '}
                            <span className="text-primary font-medium">Leonardo Debastiani</span>
                        </span>
                    </div>
                    <div className="text-sm text-secondary">
                        © {new Date().getFullYear()} ServiceTrack. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
