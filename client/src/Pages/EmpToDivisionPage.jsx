import React, { useState, useEffect } from 'react';

const fetchEmployees = () => {
  return fetch('/api/employees').then((res) => res.json());
};

const fetchDivisions = () => {
  return fetch('/api/divisions').then((res) => res.json());
};

const updateEmployee = (divisionid, employeeid) => {
  return fetch(`/api/employees/${employeeid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ division: divisionid }),
  }).then((res) => res.json());
};

export default function EmpToDivisionPage() {
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState([]);
  //   const [DivisionObject, setDivisionObject] = useState({});
  const [updateSwitcher, setUpdateSwitcher] = useState(false);

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        setEmployees(employees);
        return fetchDivisions();
      })
      .then((divisions) => {
        setDivisions(divisions);
      })
      .catch((error) => {
        console.error('Error fetching employees and divisions:', error);
      });
  }, [updateSwitcher]);

  //   useEffect(() => {
  //     const DivisionObject = {};
  //     divisions.map((division) => (DivisionObject[division._id] = division.name));
  //     setDivisionObject(DivisionObject);
  //   }, [divisions]);

  const handleEmpDivUpdate = (divisionid, employeeid) => {
    updateEmployee(divisionid, employeeid)
      .then(() => {
        setUpdateSwitcher(!updateSwitcher);
      })
      .catch((error) => {
        console.error('Error updating employee division:', error);
      });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Employee name</th>
            <th>Position</th>
            <th>Assign to</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{Object.values(employee.name).join(' ')}</td>
              <td>{employee.position}</td>
              <td>
                <select
                  value={employee.division}
                  onChange={(e) => handleEmpDivUpdate(e.target.value, employee._id)}
                >
                  <option value=''>Select a division...</option>
                  {divisions.map((division) => (
                    <option value={division._id} key={division._id}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
