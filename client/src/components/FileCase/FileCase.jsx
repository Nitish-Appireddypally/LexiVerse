import { useState } from "react";
import StepProgressBar from "./StepProgressBar";
import Step1UserInfo from "./steps/Step1UserInfo";
import Step2CaseType from "./steps/Step2CaseType";
import Step3CaseDetails from "./steps/Step3CaseDetails";
import Step4EvidenceUpload from "./steps/Step4EvidenceUpload";
import Step5ReviewSubmit from "./steps/Step5ReviewSubmit";

const FileCase = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userInfo: {},
    caseType: "",
    caseDetails: "",
    evidence: [],
  });

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (stepKey, data) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));
  };

  // Handler for final case submission
  const handleSubmit = () => {
    // Placeholder for final submission logic (API call, etc.)
    console.log("Submitting case:", formData);
    // You could make an API call here or handle other logic
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1UserInfo data={formData.userInfo} onNext={nextStep} update={data => updateFormData("userInfo", data)} />;
      case 2:
        return <Step2CaseType data={formData.caseType} onNext={nextStep} onBack={prevStep} update={data => updateFormData("caseType", data)} />;
      case 3:
        return <Step3CaseDetails data={formData.caseDetails} onNext={nextStep} onBack={prevStep} update={data => updateFormData("caseDetails", data)} />;
      case 4:
        return <Step4EvidenceUpload data={formData.evidence} onNext={nextStep} onBack={prevStep} update={data => updateFormData("evidence", data)} />;
      case 5:
        return <Step5ReviewSubmit data={formData} onBack={prevStep} onSubmit={handleSubmit} />; // Pass handleSubmit here
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 text-white  p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">File a Case</h1>
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default FileCase;
