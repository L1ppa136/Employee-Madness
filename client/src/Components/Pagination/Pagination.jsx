import React from 'react';
import './Pagination.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';

export default function Pagination({
  employees,
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages,
  startIndex,
  setStartIndex,
  endIndex,
  setEndIndex,
  employeesPerPage,
  setEmployeesPerPage,
}) {
  return (
    <div className='Pagination'>
      <button onClick={() => setCurrentPage(1)} disabled={currentPage <= 1}>
        <FontAwesomeIcon icon={faAngleDoubleLeft} />
      </button>
      <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <div>{`${currentPage} / ${totalPages}`}</div>
      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
      <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages}>
        <FontAwesomeIcon icon={faAngleDoubleRight} />
      </button>
      <label>
        <select
          value={employeesPerPage}
          onChange={(e) => setEmployeesPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        Employees per page
      </label>
    </div>
  );
}
