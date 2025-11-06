'use client';

import React, { useState } from 'react';
import type { ProcedureId, FAQItem } from '@/lib/types';

interface FAQProps {
  procedureId?: ProcedureId;
  items?: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ procedureId, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // If items are provided, use them (for server-side loaded data)
  // Otherwise, this is a client component and will need items passed from server
  const faqItems = items || []

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mb-12">
      <h2 className="text-elderly-xl font-bold text-elderly-primary mb-6">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white border-elderly border-elderly-gray-medium rounded-lg"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2 rounded-lg"
              aria-expanded={openIndex === index}
            >
              <span className="text-elderly-base font-semibold text-elderly-text pr-4">
                {item.question}
              </span>
              <span className="text-elderly-lg text-elderly-primary flex-shrink-0">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-elderly-sm text-elderly-text leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

