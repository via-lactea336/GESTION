type Step2Props = {
    nextStep: () => void;
    prevStep: () => void;
  };
  
  const Step2: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
    return (
      <div>
        <h2>Step 2: Payment Methods</h2>
        {/* Aquí iría el código para seleccionar métodos de pago */}
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Review Order</button>
      </div>
    );
  };
  
  export default Step2;