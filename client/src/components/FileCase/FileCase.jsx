import { useState } from "react";
import StepProgressBar from "./StepProgressBar";
import SubmissionSuccess from "./SubmissionSuccess";
import Step1ComplainantDetails from "./steps/Step1ComplainantDetails";
import Step2OffenseDetails from "./steps/Step2OffenseDetails";
import Step3AccusedDetails from "./steps/Step3AccusedDetails";
import Step4WitnessDetails from "./steps/Step4WitnessDetails";
import Step5CaseNarrative from "./steps/Step5CaseNarrative";
import Step6EvidenceUpload from "./steps/Step6EvidenceUpload";
import Step7ReviewSubmit from "./steps/Step7ReviewSubmit";

// This component now receives its data and logic via props from UploadCasePage
const FileCase = ({ data, update, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // This function now calls the 'update' function passed down from the parent
  const updateFormData = (stepKey, stepData) => {
    update(stepKey, stepData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ComplainantDetails
            data={data.complainantDetails}
            onNext={nextStep}
            update={(stepData) =>
              updateFormData("complainantDetails", stepData)
            }
          />
        );
      case 2:
        return (
          <Step2OffenseDetails
            data={data.offenseDetails}
            onNext={nextStep}
            onBack={prevStep}
            update={(stepData) => updateFormData("offenseDetails", stepData)}
          />
        );
      case 3:
        return (
          <Step3AccusedDetails
            data={data.accusedPersons}
            onNext={nextStep}
            onBack={prevStep}
            update={(stepData) => updateFormData("accusedPersons", stepData)}
          />
        );
      case 4:
        return (
          <Step4WitnessDetails
            data={data.witnesses}
            onNext={nextStep}
            onBack={prevStep}
            update={(stepData) => updateFormData("witnesses", stepData)}
          />
        );
      case 5:
        return (
          <Step5CaseNarrative
            data={data.caseNarrative}
            onNext={nextStep}
            onBack={prevStep}
            update={(stepData) => updateFormData("caseNarrative", stepData)}
          />
        );
      case 6:
        return (
          <Step6EvidenceUpload
            data={data.evidence}
            onNext={nextStep}
            onBack={prevStep}
            update={(stepData) => updateFormData("evidence", stepData)}
          />
        );
      case 7:
        // The final onSubmit function is passed to the last step
        return (
          <Step7ReviewSubmit
            data={data}
            onBack={prevStep}
            onSubmit={onSubmit}
          />
        );
      default:
        return <SubmissionSuccess />;
    }
  };

  return (
    // The component is now just a simple container for the steps
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-10">
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-8">{renderStep()}</div>
    </div>
  );
};

export default FileCase;
