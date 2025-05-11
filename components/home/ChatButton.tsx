'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatModal from './ChatModal';
import { MessageCircle } from 'lucide-react';

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 bg-[var(--color-accent)] text-white p-4 rounded-full shadow-xl hover:bg-[var(--color-accent-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-light)]"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {open && (
        <ChatModal onClose={() => setOpen(false)} />
      )}
    </>
  );
}
