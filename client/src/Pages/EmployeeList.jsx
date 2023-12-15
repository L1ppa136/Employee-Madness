import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../Components/Loading';
import EmployeeTable from '../Components/EmployeeTable';

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: 'DELETE' }).then((res) => res.json());
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const maxSalary = queryParams.get('salaryLimit');

  const fetchEmployees = () => {
    const url = !maxSalary ? '/api/employees' : `/api/employees?salaryLimit=${maxSalary}`;
    return fetch(url).then((res) => res.json());
  };

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    fetchEmployees().then((employees) => {
      setLoading(false);
      setEmployees(employees);
    });
  }, [maxSalary]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <label className='salary-filter'>Filter employees by maximum salary:</label>
      <select onChange={(e) => navigate(`?salaryLimit=${e.target.value}`)}>
        <option value={''}>Select a salary limit...</option>
        <option value={45000}>45.000$</option>
        <option value={50000}>50.000$</option>
        <option value={55000}>55.000$</option>
      </select>
      <EmployeeTable setEmployees={setEmployees} employees={employees} onDelete={handleDelete} />
    </>
  );
};

export default EmployeeList;
