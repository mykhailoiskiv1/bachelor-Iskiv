'use client';

import type { Step } from '@/types';

type Props = {
    currentStep: Step;
    onStepClick?: (step: Step) => void;
};

const steps: { key: Step; label: string }[] = [
    { key: 'contact', label: 'Contact' },
    { key: 'category', label: 'Category' },
    { key: 'items', label: 'Items' },
    { key: 'urgency', label: 'Urgency' },
    { key: 'summary', label: 'Summary' },
];

export default function StepProgressBar({ currentStep, onStepClick }: Props) {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
        <div className="w-full flex items-center justify-between mb-8 relative">
            {steps.map((step, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                const isClickable = index <= currentIndex;

                return (
                    <div key={step.key} className="flex-1 flex flex-col items-center text-xs">
                        <button
                            type="button"
                            disabled={!isClickable}
                            onClick={() => isClickable && onStepClick?.(step.key)}
                            aria-label={`Go to step ${step.label}`}
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold z-20 relative transition ${isClickable ? 'cursor-pointer' : 'cursor-default'
                                } ${isActive
                                    ? 'bg-[var(--color-accent)] text-white'
                                    : isCompleted
                                        ? 'bg-[var(--color-border)] text-[var(--color-text-primary)]'
                                        : 'bg-gray-100 text-gray-400'
                                }`}
                        >
                            {index + 1}
                        </button>

                        <span
                            className={`mt-2 text-[10px] sm:text-[11px] ${isActive
                                    ? 'text-[var(--color-text-primary)] font-medium'
                                    : 'text-[var(--color-text-secondary)]'
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}

            <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 z-0" />
            <div
                className="absolute top-3 left-3 h-0.5 bg-[var(--color-accent)] z-10 transition-transform duration-500 ease-in-out origin-left"
                style={{
                    transform: `scaleX(${currentIndex / (steps.length - 1)})`,
                }}
            />
        </div>
    );
}
