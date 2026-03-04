/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--text-primary)', // Off-white
                secondary: 'var(--text-secondary)', // Muted slate
                muted: 'var(--text-muted)', // Darker slate
                brand: 'var(--primary)', // ServiceTrack Green
                'brand-hover': 'var(--primary-hover)',
                'brand-light': 'var(--primary-light)',
                background: 'var(--bg-primary)', // #080C14
                surface: 'var(--surface)', // #1B2433
                'surface-hover': 'var(--surface-hover)',
                border: 'var(--border)',
                'border-light': 'var(--border-light)',
                success: 'var(--success)',
                'success-light': 'var(--success-light)',
                warning: 'var(--warning)',
                'warning-light': 'var(--warning-light)',
                danger: 'var(--danger)',
                'danger-light': 'var(--danger-light)',
                info: 'var(--info)',
                'info-light': 'var(--info-light)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            }
        },
    },
    plugins: [],
}
