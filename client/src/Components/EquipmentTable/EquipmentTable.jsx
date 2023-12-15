import { Link } from 'react-router-dom';
import './EquipmentTable.css';
import React, { useState } from 'react';
import Searchbar from '../Searchbar';

const EquipmentTable = ({ equipments, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState(null);
  const [order, setOrder] = useState(false);
  const [headerName, setHeaderName] = useState(null);

  function handleArrange(prop) {
    setOrder(!order);
    setHeaderName(prop);

    if (order) {
      equipments.sort((a, b) => {
        if (typeof a[prop] === 'string' && typeof b[prop] === 'string') {
          return a[prop].localeCompare(b[prop]);
        } else {
          return a[prop] - b[prop];
        }
      });
    } else {
      equipments.sort((a, b) => {
        if (typeof a[prop] === 'string' && typeof b[prop] === 'string') {
          return b[prop].localeCompare(a[prop]);
        } else {
          return b[prop] - a[prop];
        }
      });
    }
  }

  function getSortIndicator(prop) {
    if (prop === headerName) {
      return order ? '↑' : '↓';
    }
    return null;
  }

  return (
    <div className='EquipmentTable'>
      <Searchbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterTerm={filterTerm}
        setFilterTerm={setFilterTerm}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleArrange('designation')}>
              Designation {getSortIndicator('designation')}
            </th>
            <th onClick={() => handleArrange('type')}>Type {getSortIndicator('type')}</th>
            <th onClick={() => handleArrange('amount')}>Amount {getSortIndicator('amount')}</th>
          </tr>
        </thead>
        <tbody>
          {equipments
            .filter((equipment) =>
              searchTerm
                ? equipment.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  equipment.type.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((equipment) => (
              <tr key={equipment._id}>
                <td>{equipment.designation}</td>
                <td>{equipment.type}</td>
                <td>{equipment.amount}</td>
                <td>
                  <Link to={`/equipments/update/${equipment._id}`}>
                    <button type='button'>Update</button>
                  </Link>
                  <button type='button' onClick={() => onDelete(equipment._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
