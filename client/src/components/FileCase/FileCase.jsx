import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgressBar from "./StepProgressBar";
import SubmissionSuccess from "./SubmissionSuccess";

// Import all our new and old step components
import Step1ComplainantDetails from "./steps/Step1ComplainantDetails";
import Step2OffenseDetails from "./steps/Step2OffenseDetails";
import Step3AccusedDetails from "./steps/Step3AccusedDetails";
import Step4WitnessDetails from "./steps/Step4WitnessDetails";
import Step5CaseNarrative from "./steps/Step5CaseNarrative";
import Step6EvidenceUpload from "./steps/Step6EvidenceUpload";
import Step7ReviewSubmit from "./steps/Step7ReviewSubmit";


const FileCase = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // NEW: Updated state to hold all the detailed information
  const [formData, setFormData] = useState({
    complainantDetails: {},
    offenseDetails: {},
    accusedPersons: [{ name: '', address: '' }], // Start with one empty entry
    witnesses: [{ name: '', contact: '' }], // Start with one empty entry
    caseNarrative: {},
    evidence: [],
  });

  const totalSteps = 7;

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };
  
  const handleFinalSubmit = () => {
    // This will be called by the final step after a successful API call
    console.log("Final form data submitted:", formData);
    // For now, let's navigate to a success page or the cases dashboard
    navigate('/cases');
  }

  const updateFormData = (stepKey, data) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ComplainantDetails data={formData.complainantDetails} onNext={nextStep} update={data => updateFormData("complainantDetails", data)} />;
      case 2:
        return <Step2OffenseDetails data={formData.offenseDetails} onNext={nextStep} onBack={prevStep} update={data => updateFormData("offenseDetails", data)} />;
      case 3:
        return <Step3AccusedDetails data={formData.accusedPersons} onNext={nextStep} onBack={prevStep} update={data => updateFormData("accusedPersons", data)} />;
      case 4:
        return <Step4WitnessDetails data={formData.witnesses} onNext={nextStep} onBack={prevStep} update={data => updateFormData("witnesses", data)} />;
      case 5:
        return <Step5CaseNarrative data={formData.caseNarrative} onNext={nextStep} onBack={prevStep} update={data => updateFormData("caseNarrative", data)} />;
      case 6:
        return <Step6EvidenceUpload data={formData.evidence} onNext={nextStep} onBack={prevStep} update={data => updateFormData("evidence", data)} />;
      case 7:
        return <Step7ReviewSubmit data={formData} onBack={prevStep} onSubmit={handleFinalSubmit} />;
      default:
        return <SubmissionSuccess />; // Or some other final state
    }
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">File a New Case</h1>
      <p className="text-gray-500 mb-8">Please provide the following details accurately to generate a professional FIR draft.</p>
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-8 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        {renderStep()}
      </div>
    </div>
  );
};

export default FileCase;