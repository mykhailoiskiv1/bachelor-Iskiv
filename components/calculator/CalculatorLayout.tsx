'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    CalcProjectType,
    CalcCategory,
    CalcItem,
    ContactForm,
    SelectedItemState,
    Step,
} from './types';

import StepContact from './steps/StepContact';
import StepCategory from './steps/StepCategory';
import StepItems from './steps/StepItems';
import StepUrgency from './steps/StepUrgency';
import StepSummary from './steps/StepSummary';
import StepProgressBar from './StepProgressBar';

const steps: Step[] = ['contact', 'category', 'items', 'urgency', 'summary'];

export default function CalculatorLayout() {
    const [step, setStep] = useState<Step>('contact');
    const [contact, setContact] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        postcode: '',
    });

    const [projectTypes, setProjectTypes] = useState<CalcProjectType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CalcCategory | null>(null);
    const [items, setItems] = useState<CalcItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Record<number, SelectedItemState>>({});
    const [urgency, setUrgency] = useState<'standard' | 'urgent' | 'emergency'>('standard');
    const [estimate, setEstimate] = useState<{ estimateMin: number; estimateMax: number } | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch('/api/public/calculator/project-types')
            .then((res) => res.json())
            .then(setProjectTypes);
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetch(`/api/public/calculator/items?category=${selectedCategory.slug}`)
                .then((res) => res.json())
                .then(setItems);
        }
    }, [selectedCategory]);

    const handleEstimate = async () => {
        const selected = Object.entries(selectedItems).map(([id, data]) => ({
            id: Number(id),
            quantity: data.quantity,
            conditionIds: data.conditionIds ?? [],
        }));

        const res = await fetch('/api/public/calculator/estimate', {
            method: 'POST',
            body: JSON.stringify({ items: selected, urgency }),
        });

        const data = await res.json();
        setEstimate({
            estimateMin: data.minTotal,
            estimateMax: data.maxTotal,
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const selected = Object.entries(selectedItems).map(([id, data]) => ({
            id: Number(id),
            quantity: data.quantity,
            conditionIds: data.conditionIds,
        }));

        const payload = {
            ...contact,
            categorySlug: selectedCategory?.slug ?? '',
            data: selected,
            urgency,
            estimateMin: estimate?.estimateMin ?? 0,
            estimateMax: estimate?.estimateMax ?? 0,
        };

        const res = await fetch('/api/public/calculator/request', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (res.ok) setSubmitted(true);
        setIsSubmitting(false);
    };


    const next = () => {
        const currentIndex = steps.indexOf(step);
        setStep(steps[currentIndex + 1] as Step);
    };

    const prev = () => {
        const currentIndex = steps.indexOf(step);
        setStep(steps[currentIndex - 1] as Step);
    };

    const setStepManual = (newStep: Step) => {
        const currentIndex = steps.indexOf(step);
        const targetIndex = steps.indexOf(newStep);
        if (targetIndex <= currentIndex) {
            setStep(newStep);
        }
    };


    return (
        <main className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl font-bold mb-8 text-[var(--color-text-primary)] text-center">
                Cost Estimate Calculator
            </h1>

            <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 shadow-sm space-y-6">
                <AnimatePresence mode="wait">
                    {step === 'contact' && (
                        <StepContact contact={contact} setContact={setContact} next={next} />
                    )}
                    {step === 'category' && (
                        <StepCategory
                            projectTypes={projectTypes}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            next={next}
                            prev={prev}
                        />
                    )}
                    {step === 'items' && selectedCategory && (
                        <StepItems
                            items={items}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            next={next}
                            prev={prev}
                        />
                    )}
                    {step === 'urgency' && (
                        <StepUrgency
                            urgency={urgency}
                            setUrgency={setUrgency}
                            next={next}
                            prev={prev}
                            handleEstimate={handleEstimate}
                        />
                    )}
                    {step === 'summary' && estimate && (
                        <StepSummary
                            estimate={estimate}
                            submitted={submitted}
                            handleSubmit={handleSubmit}
                            prev={prev}
                            isSubmitting={isSubmitting}
                            items={items}
                            selectedItems={selectedItems}
                        />

                    )}
                    <StepProgressBar currentStep={step} onStepClick={setStepManual} />
                </AnimatePresence>
            </div>
        </main>
    );
}
