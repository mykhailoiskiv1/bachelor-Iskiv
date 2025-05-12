'use client';

import { motion } from 'framer-motion';
import { ContactForm } from '../types';
import StickyFooter from '@/components/ui/StickyFooter';

type Props = {
    contact: ContactForm;
    setContact: (data: ContactForm) => void;
    next: () => void;
};

export default function StepContact({ contact, setContact, next }: Props) {
    const isValid =
        contact.name.trim().length > 1 &&
        contact.email.trim().length > 3 &&
        contact.postcode.trim().length > 2;

    return (
        <>
            <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 pb-24 sm:pb-0"
            >
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="text"
                        autoComplete="name"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        placeholder="e.g. John Smith"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Phone (optional)
                    </label>
                    <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-border)]"
                        placeholder="+44..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="text"
                        autoComplete="postal-code"
                        value={contact.postcode}
                        onChange={(e) => setContact({ ...contact, postcode: e.target.value })}
                        className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        placeholder="E.g. W1U 6RT"
                        required
                    />
                </div>

                <div className="pt-6 hidden sm:block">
                    <button
                        onClick={next}
                        disabled={!isValid}
                        className="w-full sm:w-auto bg-[var(--color-accent)] text-white px-6 py-3 rounded-full text-sm font-medium transition-all hover:bg-opacity-90 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </motion.div>

            <StickyFooter label="Next" onClick={next} disabled={!isValid} />
        </>
    );
}
