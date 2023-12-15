import { useEffect, useState } from 'react';
import Loading from '../Components/Loading';
import DivisionTable from '../Components/DivisionTable';

const fetchDivisions = () => {
  return fetch('/api/divisions').then((res) => res.json());
};

const deleteDivision = (id) => {
  return fetch(`/api/divisions/${id}`, { method: 'DELETE' }).then((res) => res.json());
};

const fetchEmployees = () => {
  return fetch('/api/employees').then((res) => res.json());
};

const DivisionList = () => {
  const [loading, setLoading] = useState(true);
  const [divisions, setDivisions] = useState([]);
  const [bosses, setBosses] = useState([]);

  useEffect(() => {
    fetchEmployees().then((employees) => {
      fetchDivisions().then((divisions) => {
        const managers = {};
        divisions.forEach((div) => {
          const filtered = employees.filter((emp) => emp._id === div.boss);
          filtered.forEach((emp) => (managers[emp._id] = Object.values(emp.name).join(' ')));
        });
        setBosses(managers);
      });
    });
  }, []);

  const handleDelete = (id) => {
    deleteDivision(id);

    setDivisions((divisions) => {
      return divisions.filter((division) => division._id !== id);
    });
  };

  useEffect(() => {
    fetchDivisions().then((divisions) => {
      setLoading(false);
      setDivisions(divisions);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <DivisionTable
      divisions={divisions}
      setDivisions={setDivisions}
      bosses={bosses}
      onDelete={handleDelete}
    />
  );
};

export default DivisionList;
