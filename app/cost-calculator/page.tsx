'use client';

import Header from '@/components/layout/Header';
import FooterMinimal from '@/components/layout/FooterMinimal';
import CalculatorLayout from '@/components/calculator/CalculatorLayout';

export default function CostCalculatorPage() {
  return (
    <>
      <Header />
      <CalculatorLayout />
      <FooterMinimal />
    </>
  );
}
