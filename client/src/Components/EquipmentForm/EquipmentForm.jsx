import { useState } from 'react';

const EquipmentForm = ({ onSave, disabled, equipment, onCancel }) => {
  const [designation, setDesignation] = useState(equipment?.designation ?? '');
  const [type, setType] = useState(equipment?.type ?? '');
  const [amount, setAmount] = useState(equipment?.amount ?? '');

  const onSubmit = (e) => {
    e.preventDefault();

    if (equipment) {
      return onSave({
        ...equipment,
        designation,
        type,
        amount,
      });
    }

    return onSave({
      designation,
      type,
      amount,
    });
  };

  return (
    <form className='EquipmentForm' onSubmit={onSubmit}>
      <div className='control'>
        <label htmlFor='designation'>Designation:</label>
        <input
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          designation='designation'
          id='designation'
        ></input>
      </div>

      <div className='control'>
        <label htmlFor='type'>Type:</label>
        <input value={type} onChange={(e) => setType(e.target.value)} type='type' id='type'></input>
      </div>

      <div className='control'>
        <label htmlFor='amount'>Amount:</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          amount='amount'
          id='amount'
        ></input>
      </div>

      <div className='buttons'>
        <button type='submit' disabled={disabled}>
          {equipment ? 'Update Equipment' : 'Create Equipment'}
        </button>

        <button type='button' onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;
