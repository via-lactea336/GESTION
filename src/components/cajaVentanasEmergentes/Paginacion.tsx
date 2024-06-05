import { useState } from 'react';
import Step1 from './ProductosRegistro';
import Step2 from './Pago';
import Step3 from './Resumen';

const CheckoutWizard = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
      <div> 
        {step === 1 && <Step1 nextStep={nextStep} />}
        {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Step3 prevStep={prevStep} />}
      </div>
  );
};

export default CheckoutWizard;