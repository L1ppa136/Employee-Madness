import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EmployeeTable.css';
import Searchbar from '../Searchbar';
import Pagination from '../Pagination/Pagination';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import '../DeleteConfirmationDialog/DeleteConfirmationDialog.css';

const fetchBrands = () => {
  return fetch('/api/brands').then((res) => res.json());
};

const EmployeeTable = ({ setEmployees, employees, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState(null);
  const [order, setOrder] = useState(false);
  const [headerName, setHeaderName] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [brands, setBrands] = useState({});
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    fetchBrands()
      .then((brands) => {
        const favouriteBrands = {};
        brands.map((brand) => (favouriteBrands[brand._id] = brand.name));
        setBrands(favouriteBrands);
      })
      .then(() => fetch('/api/divisions'))
      .then((response) => response.json())
      .then((divisions) => {
        const Divisions = {};
        divisions.map((div) => (Divisions[div._id] = div.name));
        setDivisions(Divisions);
      })
      .catch((error) => {
        console.error('Error fetching brands and divisions:', error);
      });
  }, []);

  function handleArrange(prop) {
    setOrder(!order);
    setHeaderName(prop);

    const compareValues = (a, b) => {
      if (prop.includes('name')) {
        return a.name[prop].localeCompare(b.name[prop]);
      } else if (prop.toLowerCase().includes('salary')) {
        return a[prop] - b[prop];
      } else if (prop === 'desiredDiff') {
        return a.desiredSalary - a.currentSalary - (b.desiredSalary - b.currentSalary);
      } else {
        return a[prop].localeCompare(b[prop]);
      }
    };

    const sortedEmployees = [...employees].sort(compareValues);

    if (!order) {
      sortedEmployees.reverse();
    }

    setEmployees(sortedEmployees);
  }

  function getSortIndicator(prop) {
    if (prop === headerName) {
      return order ? '↑' : '↓';
    }
    return null;
  }

  function handleAttendance(employee) {
    const updatedEmployees = employees.map((emp) => {
      if (emp._id === employee._id) {
        return {
          ...emp,
          presence: { ...emp.presence, present: !emp.presence.present },
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees); // Update local state immediately

    const updateEmployee = {
      ...employee,
      presence: { ...employee.presence, present: !employee.presence.present },
    };

    fetch(`/api/employees/${employee._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateEmployee),
    }).then((res) => res.json());
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(10);

  // Calculate starting and ending indices for the current page
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(currentPage * employeesPerPage);

  // Calculate the total number of pages
  const [totalPages, setTotalPages] = useState(Math.ceil(employees.length / employeesPerPage));

  useEffect(() => {
    setTotalPages(Math.ceil(employees.length / employeesPerPage));
    setStartIndex((currentPage - 1) * employeesPerPage);
    setEndIndex(currentPage * employeesPerPage);
    setTotalPages(Math.ceil(employees.length / employeesPerPage));
  }, [startIndex, currentPage, employeesPerPage, employees, searchTerm, filterTerm]);

  function handleDeleteConfirmation(employee) {
    setEmployeeToDelete(employee);
    setShowConfirmation(true);
  }

  function handleDeleteCancel() {
    setShowConfirmation(false);
    setEmployeeToDelete(null);
  }

  function handleDeleteConfirm() {
    if (employeeToDelete) {
      onDelete(employeeToDelete._id);
      setShowConfirmation(false);
      setEmployeeToDelete(null);
    }
  }

  return (
    <div className='EmployeeTable'>
      <Searchbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterTerm={filterTerm}
        setFilterTerm={setFilterTerm}
      />
      {showConfirmation && (
        <div className='delete-confirmation-overlay'>
          <DeleteConfirmationDialog
            employee={employeeToDelete}
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
          />
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleArrange('firstname')}>
              Firstname {getSortIndicator('firstname')}
            </th>
            <th onClick={() => handleArrange('middlename')}>
              Middlename {getSortIndicator('middlename')}
            </th>
            <th onClick={() => handleArrange('lastname')}>
              Lastname {getSortIndicator('lastname')}
            </th>
            <th onClick={() => handleArrange('level')}>Level {getSortIndicator('level')}</th>
            <th onClick={() => handleArrange('position')}>
              Position {getSortIndicator('position')}
            </th>
            <th onClick={() => handleArrange('brand')}>
              Favourite Brand {getSortIndicator('brand')}
            </th>
            <th onClick={() => handleArrange('startingDate')}>
              Starting date {getSortIndicator('startingDate')}
            </th>
            <th onClick={() => handleArrange('currentSalary')}>
              Current Salary {getSortIndicator('currentSalary')}
            </th>
            <th onClick={() => handleArrange('desiredSalary')}>
              Desired Salary {getSortIndicator('desiredSalary')}
            </th>
            <th onClick={() => handleArrange('desiredDiff')}>
              Salary Diff {getSortIndicator('desiredDiff')}
            </th>
            <th onClick={() => handleArrange('division')}>
              Division {getSortIndicator('division')}
            </th>
            <th onClick={() => handleArrange('favouriteColor')}>
              Favourite color {getSortIndicator('favouriteColor')}
            </th>
            <th onClick={() => handleArrange('present')}>Present {getSortIndicator('present')}</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter((employee) =>
              searchTerm && !filterTerm
                ? employee.name.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  employee.name.middlename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  employee.name.lastname.toLowerCase().includes(searchTerm.toLowerCase())
                : searchTerm && filterTerm === 'position'
                ? employee.position.toLowerCase().includes(searchTerm.toLowerCase())
                : searchTerm && filterTerm === 'level'
                ? employee.level.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .slice(startIndex, endIndex)
            .map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name.firstname}</td>
                <td>{employee.name.middlename}</td>
                <td>{employee.name.lastname}</td>
                <td>{employee.level}</td>
                <td>{employee.position}</td>
                <td>{brands[employee.favouriteBrand]}</td>
                <td>{employee.startingDate.toString().split('T')[0]}</td>
                <td>{employee.currentSalary.toString()}</td>
                <td>{employee.desiredSalary.toString()}</td>
                <td>{(employee.desiredSalary - employee.currentSalary).toString()}</td>
                <td>{divisions[employee.division]}</td>
                <td style={{ background: employee.favouriteColor }}></td>
                <td>
                  <input
                    type='checkbox'
                    name='present'
                    checked={employee.presence.present}
                    onChange={() => handleAttendance(employee)}
                  ></input>
                </td>
                <td>
                  <Link to={`/update/${employee._id}`}>
                    <button type='button'>Update</button>
                  </Link>
                  <button type='button' onClick={() => handleDeleteConfirmation(employee)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        startIndex={startIndex}
        setStartIndex={setStartIndex}
        endIndex={endIndex}
        setEndIndex={setEndIndex}
        employeesPerPage={employeesPerPage}
        setEmployeesPerPage={setEmployeesPerPage}
      />
      <Link to='/employees/assign'>
        <button type='button'>Assign Employees to Divisions</button>
      </Link>
    </div>
  );
};

export default EmployeeTable;
