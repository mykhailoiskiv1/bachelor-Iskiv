'use client';

import { motion } from 'framer-motion';
import { CalcItem, SelectedItemState } from '../types';

type Props = {
    estimate: { estimateMin: number; estimateMax: number };
    submitted: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
    prev: () => void;
    items: CalcItem[];
    selectedItems: Record<number, SelectedItemState>;
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 },
};

export default function StepSummary({
    estimate,
    submitted,
    isSubmitting,
    handleSubmit,
    prev,
    items,
    selectedItems,
}: Props) {
    const selectedItemsList = items.filter((item) => selectedItems[item.id]?.quantity > 0);

    return (
        <motion.div
            key="summary"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="space-y-3">
                <h2 className="text-md font-semibold text-[var(--color-text-primary)]">You selected:</h2>

                {selectedItemsList.length === 0 && (
                    <p className="text-sm text-[var(--color-text-secondary)]">No services selected.</p>
                )}

                <ul className="space-y-4">
                    {selectedItemsList.map((item) => {
                        const selection = selectedItems[item.id];
                        const selectedConditions = item.conditions.filter((c) =>
                            selection.conditionIds.includes(c.id)
                        );

                        return (
                            <li
                                key={item.id}
                                className="border border-[var(--color-border)] rounded-lg px-4 py-3 bg-white text-sm"
                            >
                                <div className="font-medium text-[var(--color-text-primary)]">
                                    {item.name} — <span className="font-normal">x{selection.quantity}</span>
                                </div>

                                {selectedConditions.length > 0 && (
                                    <ul className="mt-1 list-disc list-inside text-[var(--color-text-secondary)] text-xs space-y-0.5">
                                        {selectedConditions.map((cond) => (
                                            <li key={cond.id}>{cond.label}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Estimated Project Cost</h2>
                <p className="text-2xl font-bold text-[var(--color-accent)]">
                    £{estimate.estimateMin} – £{estimate.estimateMax}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                    * Labour only. Material costs not included.
                </p>
            </motion.div>

            {!submitted ? (
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row justify-between gap-4 pt-4"
                >
                    <button
                        onClick={prev}
                        className="w-full sm:w-auto px-6 py-3 rounded-full text-sm border border-[var(--color-border)] hover:bg-gray-100 transition"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[var(--color-accent)] text-white px-6 py-3 rounded-full text-sm hover:bg-opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loader small border-white" /> Sending...
                            </>
                        ) : (
                            'Send Request'
                        )}
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    variants={itemVariants}
                    className="text-green-700 font-semibold text-sm text-center"
                >
                    ✅ Your request has been successfully submitted!
                </motion.div>
            )}
        </motion.div>
    );
}
