import React from 'react';

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-based index
  activeColor?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, activeColor = 'indigo' }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-start justify-between">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 relative">
            {/* Line connecting steps */}
            {idx !== 0 && (
              <div 
                className={`absolute right-1/2 top-4 w-full h-0.5 -translate-y-1/2 z-0 ${
                  idx <= currentStep ? `bg-${activeColor}-500` : 'bg-slate-800'
                }`}
              ></div>
            )}
            
            {/* Step Circle */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2 ${
                idx < currentStep ? `bg-${activeColor}-500 border-${activeColor}-500 text-white` :
                idx === currentStep ? `border-${activeColor}-500 bg-slate-900 text-${activeColor}-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]` :
                'border-slate-800 bg-slate-950 text-slate-600'
              }`}
            >
              {idx < currentStep ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
              ) : (
                <span className="text-xs font-black">{idx + 1}</span>
              )}
            </div>
            
            {/* Label */}
            <div className="mt-3 text-center px-2">
              <p className={`text-[10px] font-black uppercase tracking-widest ${idx <= currentStep ? 'text-white' : 'text-slate-600'}`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-[8px] text-slate-500 mt-1 hidden md:block">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;