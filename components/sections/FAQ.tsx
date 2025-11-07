'use client';

import React, { useState } from 'react';
import type { ProcedureId, FAQItem } from '@/lib/types';

interface FAQGroup {
  title: string;
  items: FAQItem[];
}

interface FAQProps {
  procedureId?: ProcedureId;
  items?: FAQItem[];
  groupedItems?: FAQGroup[];
  showTitle?: boolean;
}

export const FAQ: React.FC<FAQProps> = ({ procedureId, items, groupedItems, showTitle = false }) => {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  // If items are provided, use them (for server-side loaded data)
  // Otherwise, this is a client component and will need items passed from server
  const faqItems = items || []

  const toggleItem = (index: number) => {
    const newIndexes = new Set(openIndexes);
    if (newIndexes.has(index)) {
      newIndexes.delete(index);
    } else {
      newIndexes.add(index);
    }
    setOpenIndexes(newIndexes);
  };

  // Display grouped items if provided
  if (groupedItems && groupedItems.length > 0) {
    let globalIndex = 0;
    return (
      <section className="mb-12">
        <h2 className="text-elderly-xl font-bold text-elderly-primary mb-6">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {groupedItems.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
                {group.title}
              </h3>
              <div className="space-y-4">
                {group.items.map((item, itemIndex) => {
                  const currentIndex = globalIndex++;
                  return (
                    <div
                      key={currentIndex}
                      className="bg-white border-elderly border-elderly-gray-medium rounded-lg"
                    >
                      <button
                        onClick={() => toggleItem(currentIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2 rounded-lg"
                        aria-expanded={openIndexes.has(currentIndex)}
                      >
                        <span className="text-elderly-base font-semibold text-elderly-text pr-4">
                          {item.question}
                        </span>
                        <span className="text-elderly-lg text-elderly-primary flex-shrink-0">
                          {openIndexes.has(currentIndex) ? '−' : '+'}
                        </span>
                      </button>
                      {openIndexes.has(currentIndex) && (
                        <div className="px-6 pb-4">
                          <p className="text-elderly-sm text-elderly-text leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback: if groupedItems is empty or undefined, show items if available
  if (faqItems.length > 0) {
    return (
      <section className="mb-12">
        {showTitle && (
          <h2 className="text-elderly-xl font-bold text-elderly-primary mb-6">
            Frequently Asked Questions
          </h2>
        )}
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border-elderly border-elderly-gray-medium rounded-lg"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2 rounded-lg"
                aria-expanded={openIndexes.has(index)}
              >
                <span className="text-elderly-base font-semibold text-elderly-text pr-4">
                  {item.question}
                </span>
                <span className="text-elderly-lg text-elderly-primary flex-shrink-0">
                  {openIndexes.has(index) ? '−' : '+'}
                </span>
              </button>
              {openIndexes.has(index) && (
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
  }

  // If no items at all, return null
  return null;
};

