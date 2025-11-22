import React from 'react';

// SVG Icons
const ActivityIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);

const Step: React.FC<{ number: number; icon: React.ReactNode; title: string; desc: string; delay: string }> = ({ number, icon, title, desc, delay }) => (
  <div className={`group bg-white p-8 rounded-xl border-2 border-gray-100 shadow-sm flex flex-col items-center text-center relative transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-blue-300 ${delay}`}>
    <div className="absolute -top-5 bg-elderly-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <div className="text-blue-500 mb-4 mt-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
      {icon}
    </div>
    <h3 className="text-elderly-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-elderly-base text-gray-600">{desc}</p>
  </div>
);

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white mb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-elderly-2xl md:text-elderly-hero font-bold mb-4">How It Works - Just 3 Simple Steps</h2>
          <p className="text-elderly-lg text-gray-600 bg-blue-50 inline-block px-4 py-2 rounded-lg">
            💡 Takes just 2 minutes, no medical jargon, no contact info needed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <Step 
            number={1} 
            icon={<ActivityIcon />}
            title="Choose Your Procedure" 
            desc="Select from cataract, hip replacement, or knee replacement surgery."
            delay=""
          />
          <Step 
            number={2} 
            icon={<MapPinIcon />}
            title="Select Your Location" 
            desc="Pick your city to find surgeons in your area." 
            delay=""
          />
          <Step 
            number={3} 
            icon={<BarChartIcon />}
            title="Compare Options" 
            desc="See NHS wait times vs private costs instantly." 
            delay=""
          />
        </div>
      </div>
    </section>
  );
};

