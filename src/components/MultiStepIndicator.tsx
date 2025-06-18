import React from 'react';
import { ShoppingCart, Truck, CreditCard, CheckCircle2, Check } from 'lucide-react';
import clsx from 'clsx';

interface Step {
  name: string;
  icon: React.ElementType; // Lucide icon component
}

interface MultiStepIndicatorProps {
  /** Array of step objects, each with a name and a Lucide icon component. Defaults to a 4-step checkout process. */
  steps?: Step[];
  /** Current active step, 0-indexed (e.g., 0 for the first step, 1 for the second). */
  currentStep: number;
}

const defaultStepsConfig: Step[] = [
  { name: "VAULT", icon: ShoppingCart },
  { name: "DELIVERY", icon: Truck },
  { name: "PAYMENT", icon: CreditCard },
  { name: "CONFIRM", icon: CheckCircle2 },
];

const MultiStepIndicator: React.FC<MultiStepIndicatorProps> = ({
  steps = defaultStepsConfig,
  currentStep,
}) => {
  console.log('MultiStepIndicator loaded, currentStep:', currentStep);

  return (
    <div className="flex items-start justify-between w-full max-w-3xl mx-auto px-2 sm:px-4 py-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isUpcoming = index > currentStep;

        const IconComponent = step.icon;

        return (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center text-center flex-shrink-0 group" style={{ minWidth: '60px' }}> {/* Added minWidth for smaller screens */}
              <div
                className={clsx(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out",
                  {
                    "bg-red-700 border-amber-500 text-amber-400 group-hover:bg-red-600": isCompleted, // Completed: Stark Red bg, Gold icon/border
                    "bg-sky-500 border-sky-300 text-white shadow-lg shadow-sky-500/70 scale-110 group-hover:shadow-sky-400/80": isActive, // Active: Arc Reactor Blue bg, White icon, glow
                    "bg-gray-700 border-gray-500 text-gray-400 group-hover:bg-gray-600 group-hover:border-gray-400": isUpcoming, // Upcoming: Stark Tech Grey bg
                  }
                )}
              >
                {isCompleted ? (
                  <Check size={20} className="md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                ) : (
                  <IconComponent size={20} className="md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                )}
              </div>
              <p
                className={clsx(
                  "mt-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                  "sm:text-sm", // Responsive text size
                  {
                    "text-amber-400 group-hover:text-amber-300": isCompleted,
                    "text-sky-400 group-hover:text-sky-300 font-bold": isActive,
                    "text-gray-500 group-hover:text-gray-400": isUpcoming,
                  }
                )}
              >
                {step.name}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "flex-1 h-1.5 mt-5 md:mt-6 mx-1 sm:mx-2 rounded-full transition-all duration-500 ease-in-out", // Positioned to align with center of circles
                  {
                    "bg-gradient-to-r from-red-600 via-amber-500 to-amber-600": isCompleted, // Metallic gradient for completed connector
                    "bg-gray-600": isActive || isUpcoming, // Dark grey for upcoming connectors
                  }
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MultiStepIndicator;