'use client';

import { useState } from 'react';
import { CalcCategory, CalcProjectType } from '../types';
import { motion } from 'framer-motion';
import StickyFooter from '@/components/ui/StickyFooter';

type Props = {
    projectTypes: CalcProjectType[];
    selectedCategory: CalcCategory | null;
    setSelectedCategory: (cat: CalcCategory | null) => void;
    next: () => void;
    prev: () => void;
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
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
};

export default function StepCategory({
    projectTypes,
    selectedCategory,
    setSelectedCategory,
    next,
    prev,
}: Props) {
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const selectedType = projectTypes.find((t) => t.id === selectedTypeId);

    return (
        <>
            <motion.div
                key="category"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8 pb-24 sm:pb-0"
            >
                {!selectedType ? (
                    <div className="space-y-4">
                        <motion.h2
                            variants={itemVariants}
                            className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                            Choose the type of project:
                        </motion.h2>

                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {projectTypes.map((type) => (
                                <motion.button
                                    key={type.id}
                                    variants={itemVariants}
                                    onClick={() => setSelectedTypeId(type.id)}
                                    className="p-4 rounded-lg border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] text-left transition"
                                >
                                    <div className="font-medium text-[var(--color-text-primary)]">{type.name}</div>
                                    {type.description && (
                                        <div className="text-xs mt-1 text-[var(--color-text-secondary)]">
                                            {type.description}
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <motion.h2
                            variants={itemVariants}
                            className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                            Choose a service category:
                        </motion.h2>

                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {selectedType.categories.map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    variants={itemVariants}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`p-4 rounded-lg border text-left transition ${selectedCategory?.id === cat.id
                                        ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                                        : 'bg-white border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]'
                                        }`}
                                >
                                    <div className="font-medium">{cat.name}</div>
                                    {cat.description && (
                                        <div
                                            className={`text-xs mt-1 ${selectedCategory?.id === cat.id
                                                ? 'text-white/90'
                                                : 'text-[var(--color-text-secondary)]'
                                                }`}
                                        >
                                            {cat.description}
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>
                )}

                <motion.div
                    variants={itemVariants}
                    className="pt-6 flex justify-between hidden sm:flex"
                >
                    <button
                        onClick={() => {
                            if (selectedTypeId) {
                                setSelectedTypeId(null);
                                setSelectedCategory(null);
                            } else {
                                prev();
                            }
                        }}
                        className="px-6 py-2 rounded-full text-sm border border-[var(--color-border)] hover:bg-gray-100 transition"
                    >
                        Back
                    </button>

                    <button
                        onClick={next}
                        disabled={!selectedCategory}
                        className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full text-sm hover:bg-opacity-90 transition disabled:opacity-50"
                    >
                        Next
                    </button>
                </motion.div>
            </motion.div>

            {/* Sticky Next button */}
            <StickyFooter
                label="Next"
                onClick={next}
                disabled={!selectedCategory}
            />
        </>
    );
}
