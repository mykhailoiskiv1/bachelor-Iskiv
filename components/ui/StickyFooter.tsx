'use client';

import { useEffect, useState } from 'react';

type Props = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export default function StickyFooter({ label, onClick, disabled }: Props) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handler = () => {
            setIsVisible(window.innerWidth < 640);
        };
        handler();
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border)] px-4 py-3 shadow z-50 sm:hidden">
            <button
                onClick={onClick}
                disabled={disabled}
                className="w-full bg-[var(--color-accent)] text-white text-sm px-4 py-3 rounded-full font-medium hover:bg-opacity-90 disabled:opacity-50 transition"
            >
                {label}
            </button>
        </div>
    );
}
