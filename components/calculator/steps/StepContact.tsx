'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ContactForm } from '../types';
import StickyFooter from '@/components/ui/StickyFooter';

type Errors = Partial<Record<keyof ContactForm, string>>;
type Touched = Partial<Record<keyof ContactForm, boolean>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s-]{7,15}$/;

export default function StepContact({
    contact,
    setContact,
    next,
}: {
    contact: ContactForm;
    setContact: (data: ContactForm) => void;
    next: () => void;
}) {
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});

    const validateField = (field: keyof ContactForm, value: string): string => {
        switch (field) {
            case 'name':
                return value.trim().length > 1 ? '' : 'Must be at least 2 characters';
            case 'email':
                return emailRegex.test(value) ? '' : 'Invalid email format';
            case 'postcode':
                return value.trim().length > 2 ? '' : 'Must be at least 3 characters';
            case 'phone':
                return value === '' || phoneRegex.test(value)
                    ? ''
                    : 'Invalid phone number';
            default:
                return '';
        }
    };

    useEffect(() => {
        const newErrors: Errors = {};
        (['name', 'email', 'postcode', 'phone'] as (keyof ContactForm)[]).forEach(
            (field) => {
                if (touched[field]) {
                    const error = validateField(field, contact[field] ?? '');
                    if (error) newErrors[field] = error;
                }
            }
        );
        setErrors(newErrors);
    }, [contact, touched]);

    const handleChange = (field: keyof ContactForm) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setContact({ ...contact, [field]: e.target.value });
    };

    const handleBlur = (field: keyof ContactForm) => () => {
        setTouched({ ...touched, [field]: true });
        const error = validateField(field, contact[field] ?? '');
        setErrors({ ...errors, [field]: error });
    };

    const isValid =
        !validateField('name', contact.name) &&
        !validateField('email', contact.email) &&
        !validateField('postcode', contact.postcode);

    const inputClass = (field: keyof ContactForm) => {
        const base =
            'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ';
        if (touched[field] && errors[field]) {
            return base + 'border-red-500 focus:ring-2 focus:ring-red-500';
        }
        return (
            base +
            'border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-accent)]'
        );
    };

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
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="text"
                        autoComplete="name"
                        value={contact.name}
                        onChange={handleChange('name')}
                        onBlur={handleBlur('name')}
                        className={inputClass('name')}
                        placeholder="e.g. John Smith"
                    />
                    {touched.name && errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={contact.email}
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        className={inputClass('email')}
                        placeholder="you@example.com"
                    />
                    {touched.email && errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Phone (optional)
                    </label>
                    <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={contact.phone}
                        onChange={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        className={inputClass('phone')}
                        placeholder="+44..."
                    />
                    {touched.phone && errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="text"
                        autoComplete="postal-code"
                        value={contact.postcode}
                        onChange={handleChange('postcode')}
                        onBlur={handleBlur('postcode')}
                        className={inputClass('postcode')}
                        placeholder="E.g. W1U 6RT"
                    />
                    {touched.postcode && errors.postcode && (
                        <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>
                    )}
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
