import React, { useState, useEffect } from 'react';
import Loading from '../Components/Loading';

export default function MissingEmployees() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchEmployees() {
    return fetch(`/api/missing`).then((res) => res.json());
  }

  useEffect(() => {
    fetchEmployees().then((employees) => setResults(employees));
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='EmployeeTable'>
      <h2>Missing Employees</h2>
      <table>
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Middlename</th>
            <th>Lastname</th>
            <th>Level</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {results.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name.firstname}</td>
              <td>{employee.name.middlename}</td>
              <td>{employee.name.lastname}</td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
