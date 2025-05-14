// src/components/FileCase/StepProgressBar.jsx
const StepProgressBar = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex items-center">
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
              ${step <= currentStep ? "bg-yellow-400 text-black" : "bg-slate-700 text-white"}`}
          >
            {step}
          </div>

          {/* Line */}
          {index !== totalSteps - 1 && (
            <div
              className={`flex-1 h-1 mx-2 
                ${step < currentStep ? "bg-yellow-400" : "bg-slate-600"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepProgressBar;
