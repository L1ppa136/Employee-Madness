import React, { useState, useEffect } from 'react';
import Loading from '../Components/Loading';

export default function SearchEmployees() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchResult = window.location.href.split('/')[window.location.href.split('/').length - 1];

  function fetchEmployees(name) {
    return fetch(`/api/employees/search/${name}`).then((res) => res.json());
  }

  useEffect(() => {
    const href = window.location.href.split('/');
    const searchedName = href[href.length - 1];
    fetchEmployees(searchedName).then((employees) => setResults(employees));
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='EmployeeTable'>
      <h2>Search results for "{searchResult}"</h2>
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
