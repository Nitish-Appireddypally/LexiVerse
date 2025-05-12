import React, { useState } from "react";
import Stepper from "./Stepper";
import StepCaseDetails from "./StepCaseDetails";
import StepJurisdiction from "./StepJurisdiction";
import StepEvidenceUpload from "./StepEvidenceUpload";
import StepPreview from "./StepPreview";
import StepReviewSubmit from "./StepReviewSubmit";

const FileCaseLayout = () => {
const [step, setStep] = useState(0);
const [formData, setFormData] = useState({
title: "",
description: "",
ipcSections: [],
jurisdiction: "",
courtType: "",
evidenceFiles: [],
});

const steps = [
"Case Details",
"Jurisdiction",
"Upload Evidence",
"Preview Draft",
"Review & Submit",
];

const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

const updateForm = (newData) =>
setFormData((prev) => ({ ...prev, ...newData }));

const renderStep = () => {
switch (step) {
case 0:
return (
<StepCaseDetails data={formData} updateForm={updateForm} nextStep={nextStep} />
);
case 1:
return (
<StepJurisdiction data={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />
);
case 2:
return (
<StepEvidenceUpload data={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />
);
case 3:
return (
<StepPreview data={formData} nextStep={nextStep} prevStep={prevStep} />
);
case 4:
return (
<StepReviewSubmit data={formData} prevStep={prevStep} />
);
default:
return null;
}
};

return (
<div className="min-h-screen bg-[#F9FAFB] px-6 py-6 ml-64">
<Stepper steps={steps} currentStep={step} />
<div className="mt-8">{renderStep()}</div>
</div>
);
};

export default FileCaseLayout;