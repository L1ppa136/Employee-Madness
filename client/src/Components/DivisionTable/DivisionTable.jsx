import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DivisionTable.css';

export default function DivisionTable({ divisions, bosses, setDivisions }) {
  const [divToBeDeleted, setDivToBeDeleted] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteDivision = (id) => {
    return fetch(`/api/divisions/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((div) => {
        const UpdatedDivisions = divisions.filter((division) => division._id !== div._id);
        setDivisions(UpdatedDivisions);
      });
  };

  const handleDeleteDivConfirmation = (id) => {
    setShowConfirmation(true);
    setDivToBeDeleted(id);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setDivToBeDeleted('');
  };

  const handleDelete = (id) => {
    deleteDivision(id);
    setShowConfirmation(false);
    setDivToBeDeleted('');
  };

  return (
    <div>
      {showConfirmation && (
        <div className='divDeleteConfirm-overlay'>
          <div className='divDeleteConfirm-dialog'>
            <p>Are you sure to delete this Division?</p>
            <div>
              <button onClick={() => handleDelete(divToBeDeleted)}>Delete</button>
              <button onClick={() => handleCancelConfirmation()}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Division name</th>
            <th>Manager</th>
            <th>Location</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          {divisions.map((division) => (
            <tr key={division._id}>
              <td className='linkToDivisionDetails'>
                <Link to={`/divisions/${division._id}`}>{division.name}</Link>
              </td>
              <td>{bosses[division.boss]}</td>
              <td>{`${division.location.city}, ${division.location.country}`}</td>
              <td>{division.budget}</td>
              <td>
                <Link to={`/divisions/update/${division._id}`}>
                  <button>Update</button>
                </Link>
                <button onClick={() => handleDeleteDivConfirmation(division._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
