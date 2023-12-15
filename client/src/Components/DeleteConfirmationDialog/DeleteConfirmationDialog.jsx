import React from 'react';
import './DeleteConfirmationDialog.css';

const DeleteConfirmationDialog = ({ onCancel, onConfirm }) => {
  return (
    <div className='delete-confirmation-dialog'>
      <p>Are you sure you want to delete this employee?</p>
      <div>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
