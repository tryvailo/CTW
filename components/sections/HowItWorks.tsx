import React from 'react';

// SVG иконка для шага 1
const StepOneIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="40" cy="40" r="38" fill="#005EB8" stroke="#003d7a" strokeWidth="2" />
    <text
      x="40"
      y="55"
      fontSize="48"
      fontWeight="700"
      fill="white"
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      1
    </text>
  </svg>
);

// SVG иконка для шага 2
const StepTwoIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="40" cy="40" r="38" fill="#005EB8" stroke="#003d7a" strokeWidth="2" />
    <text
      x="40"
      y="55"
      fontSize="48"
      fontWeight="700"
      fill="white"
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      2
    </text>
  </svg>
);

// SVG иконка для шага 3
const StepThreeIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="40" cy="40" r="38" fill="#005EB8" stroke="#003d7a" strokeWidth="2" />
    <text
      x="40"
      y="55"
      fontSize="48"
      fontWeight="700"
      fill="white"
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      3
    </text>
  </svg>
);

export const HowItWorks: React.FC = () => {
  return (
    <section className="mb-12 bg-elderly-primary-light p-8 rounded-lg border-elderly border-elderly-gray-medium">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-elderly-xl font-bold mb-8 text-center text-elderly-primary">
          How It Works - Just 3 Simple Steps
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Step 1 */}
          <div className="text-center bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <div className="flex justify-center mb-4">
              <StepOneIcon />
            </div>
            <h3 className="text-elderly-lg font-semibold mb-2 text-elderly-primary">
              Choose Your Procedure
            </h3>
            <p className="text-elderly-base text-elderly-text">
              Select from cataract, hip replacement, or knee replacement surgery
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <div className="flex justify-center mb-4">
              <StepTwoIcon />
            </div>
            <h3 className="text-elderly-lg font-semibold mb-2 text-elderly-primary">
              Select Your Location
            </h3>
            <p className="text-elderly-base text-elderly-text">
              Pick your city to find surgeons in your area
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <div className="flex justify-center mb-4">
              <StepThreeIcon />
            </div>
            <h3 className="text-elderly-lg font-semibold mb-2 text-elderly-primary">
              Compare Options
            </h3>
            <p className="text-elderly-base text-elderly-text">
              See NHS wait times vs private costs instantly
            </p>
          </div>
        </div>
        
        <p className="text-center text-elderly-base text-elderly-gray-dark">
          💡 Takes just 2 minutes, no medical jargon, no contact info needed
        </p>
      </div>
    </section>
  );
};

