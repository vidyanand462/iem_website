import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({
  steps = [],
  currentStep = 1,
  onStepClick,
  allowClickCompleted = true,
}) => {
  return (
    <div className="w-full py-4">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isClickable = Boolean(onStepClick);

            return (
              <li key={step.id || step.title} className="relative flex-1">
                <div className="flex items-center">
                  {/* Connecting Line */}
                  {idx !== 0 && (
                    <div
                      className={`absolute left-0 top-4 -translate-y-1/2 w-full h-[2px] -ml-[50%] transition-colors ${
                        isCompleted || isCurrent ? 'bg-iem-blue' : 'bg-slate-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Step Bubble & Label */}
                  <div
                    onClick={() => isClickable && onStepClick(stepNum)}
                    className={`group relative z-10 flex flex-col items-center mx-auto text-center ${
                      isClickable ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isCompleted
                          ? 'bg-iem-blue text-white shadow-sm ring-4 ring-blue-50'
                          : isCurrent
                          ? 'bg-iem-navy text-white shadow ring-4 ring-blue-100 scale-105'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 text-white stroke-[2.5]" /> : stepNum}
                    </div>

                    <span
                      className={`mt-2 text-xs font-semibold hidden md:block max-w-[100px] leading-tight ${
                        isCurrent
                          ? 'text-iem-navy font-bold'
                          : isCompleted
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Stepper;
