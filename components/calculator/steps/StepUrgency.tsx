'use client';

import { motion } from 'framer-motion';
import StickyFooter from '@/components/ui/StickyFooter';

type Props = {
    urgency: 'standard' | 'urgent' | 'emergency';
    setUrgency: (u: 'standard' | 'urgent' | 'emergency') => void;
    next: () => void;
    prev: () => void;
    handleEstimate: () => void;
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
};

export default function StepUrgency({
    urgency,
    setUrgency,
    next,
    prev,
    handleEstimate,
}: Props) {
    const options: { value: 'standard' | 'urgent' | 'emergency'; label: string; note?: string }[] = [
        { value: 'standard', label: 'Standard', note: '2–7 days' },
        { value: 'urgent', label: 'Urgent', note: 'within 48 hours' },
        { value: 'emergency', label: 'Emergency', note: 'same-day response' },
    ];

    return (
        <>
            <motion.div
                key="urgency"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8 pb-24 sm:pb-0"
            >
                <motion.h2
                    variants={itemVariants}
                    className="text-md font-semibold text-[var(--color-text-primary)]"
                >
                    How urgent is the request?
                </motion.h2>

                <motion.div
                    variants={containerVariants}
                    className="flex flex-col gap-4 sm:grid sm:grid-cols-3"
                >
                    {options.map((opt) => (
                        <motion.button
                            key={opt.value}
                            variants={itemVariants}
                            onClick={() => setUrgency(opt.value)}
                            className={`w-full px-4 py-4 rounded-xl text-sm border text-left transition whitespace-nowrap ${urgency === opt.value
                                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                                    : 'bg-white text-[var(--color-text-primary)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
                                }`}
                        >
                            <div className="font-medium">{opt.label}</div>
                            {opt.note && (
                                <div
                                    className={`text-xs mt-1 ${urgency === opt.value
                                            ? 'text-white/90'
                                            : 'text-[var(--color-text-secondary)]'
                                        }`}
                                >
                                    {opt.note}
                                </div>
                            )}
                        </motion.button>
                    ))}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="pt-4 flex justify-between gap-4 hidden sm:flex"
                >
                    <button
                        onClick={prev}
                        className="px-6 py-2 rounded-full text-sm border border-[var(--color-border)] hover:bg-gray-100 transition"
                    >
                        Back
                    </button>

                    <button
                        onClick={() => {
                            handleEstimate();
                            next();
                        }}
                        className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full text-sm hover:bg-opacity-90 transition"
                    >
                        Next
                    </button>
                </motion.div>
            </motion.div>

            <StickyFooter
                label="Next"
                onClick={() => {
                    handleEstimate();
                    next();
                }}
            />
        </>
    );
}
