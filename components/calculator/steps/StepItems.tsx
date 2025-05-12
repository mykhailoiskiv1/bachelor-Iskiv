'use client';

import { CalcItem, SelectedItemState } from '../types';
import { motion } from 'framer-motion';
import StickyFooter from '@/components/ui/StickyFooter';

type Props = {
  items: CalcItem[];
  selectedItems: Record<number, SelectedItemState>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Record<number, SelectedItemState>>>;
  next: () => void;
  prev: () => void;
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

export default function StepItems({
  items,
  selectedItems,
  setSelectedItems,
  next,
  prev,
}: Props) {
  const toggleCondition = (itemId: number, conditionId: number) => {
    setSelectedItems((prev) => {
      const existing = prev[itemId] || { quantity: 0, conditionIds: [] };
      const alreadySelected = existing.conditionIds.includes(conditionId);
      const updated = alreadySelected
        ? existing.conditionIds.filter((id) => id !== conditionId)
        : [...existing.conditionIds, conditionId];
      return {
        ...prev,
        [itemId]: { ...existing, conditionIds: updated },
      };
    });
  };

  const updateQuantity = (itemId: number, value: number) => {
    setSelectedItems((prev) => {
      const existing = prev[itemId] || { quantity: 0, conditionIds: [] };
      return {
        ...prev,
        [itemId]: { ...existing, quantity: value },
      };
    });
  };

  return (
    <>
      <motion.div
        key="items"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 pb-24 sm:pb-0"
      >
        <motion.h2
          variants={itemVariants}
          className="text-md font-semibold text-[var(--color-text-primary)]"
        >
          Specify quantity and conditions for each service:
        </motion.h2>

        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="text-base font-medium text-[var(--color-text-primary)]">{item.name}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Unit: {item.unitType}</div>
              </div>

              <input
                type="number"
                min={0}
                inputMode="decimal"
                pattern="[0-9]*"
                className="w-full sm:w-28 px-4 py-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                value={selectedItems[item.id]?.quantity || ''}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                placeholder="Quantity"
              />
            </div>

            {item.conditions.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-1">
                <div className="text-xs font-medium text-[var(--color-text-primary)]">Optional conditions:</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.conditions.map((cond) => {
                    const selected = selectedItems[item.id]?.conditionIds?.includes(cond.id) || false;
                    return (
                      <button
                        key={cond.id}
                        onClick={() => toggleCondition(item.id, cond.id)}
                        type="button"
                        className={`text-xs px-4 py-2 rounded-full border transition whitespace-nowrap ${
                          selected
                            ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                            : 'bg-gray-100 text-[var(--color-text-primary)] border-[var(--color-border)]'
                        }`}
                      >
                        {cond.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

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
            onClick={next}
            className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full text-sm hover:bg-opacity-90 transition"
          >
            Next
          </button>
        </motion.div>
      </motion.div>

      <StickyFooter label="Next" onClick={next} />
    </>
  );
}
