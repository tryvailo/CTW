'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';

// MessageSquarePlus Icon
const MessageSquarePlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const PROCEDURES = [
  { id: 'cataract', name: 'Cataract Surgery' },
  { id: 'hip', name: 'Hip Replacement' },
  { id: 'knee', name: 'Knee Replacement' },
];

export const SubmitExperienceForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [procedure, setProcedure] = useState('');
  const [weeks, setWeeks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to send data would go here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="submit-experience" className="py-16 bg-elderly-primary-light border-y-2 border-blue-200">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-elderly-2xl font-bold mb-4">Help Improve Our Data</h2>
        <p className="text-elderly-lg mb-8">
          <span className="font-bold text-elderly-primary">3,214</span> patients have shared their experiences. Your story matters too.
        </p>

        {submitted ? (
          <div className="bg-green-100 p-8 rounded-xl border border-green-300">
            <h3 className="text-green-800 font-bold text-2xl mb-2">Thank you!</h3>
            <p className="text-green-800 text-lg">Your experience helps others make better decisions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-xl shadow-md text-left">
            <div className="mb-6">
              <label htmlFor="exp-procedure" className="block text-elderly-base font-bold mb-2">Which procedure are you waiting for?</label>
              <select 
                id="exp-procedure" 
                required 
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg text-elderly-base bg-white min-h-touch"
              >
                <option value="">Select a procedure</option>
                {PROCEDURES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-8">
              <label htmlFor="exp-weeks" className="block text-elderly-base font-bold mb-2">How many weeks have you been waiting?</label>
              <input 
                type="number" 
                id="exp-weeks"
                required
                min="0"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                placeholder="e.g. 24" 
                className="w-full p-4 border-2 border-gray-300 rounded-lg text-elderly-base min-h-touch"
              />
            </div>

            <Button type="submit" className="w-full" size="large">
              <MessageSquarePlusIcon />
              <span className="ml-2">Submit My Experience</span>
            </Button>
            <p className="text-center mt-4 text-gray-500 text-elderly-sm">Anonymous • No personal data collected</p>
          </form>
        )}
      </div>
    </section>
  );
};
