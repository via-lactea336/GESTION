type Step3Props = {
    prevStep: () => void;
  };
  
  const Step3: React.FC<Step3Props> = ({ prevStep }) => {
    return (
      <div>
        <h2>Step 3: Review Order</h2>
        {/* Aquí iría el resumen del pedido */}
        <button onClick={prevStep}>Back to Payment</button>
        <button>Confirm and Pay</button>
      </div>
    );
  };
  
  export default Step3;