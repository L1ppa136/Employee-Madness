import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DivisionForm from '../Components/DivisionForm';
import Loading from '../Components/Loading';

const updateDivision = (division) => {
  return fetch(`/api/divisions/${division._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(division),
  })
    .then((res) => res.json())
    .then(() =>
      fetch(`/api/employees/${division.boss}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ division: division._id }),
      })
    )
    .then((res) => res.json());
};

const fetchDivision = (id) => {
  return fetch(`/api/divisions/${id}`).then((res) => res.json());
};

const DivisionUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [division, setDivision] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [divisionLoading, setDivisionLoading] = useState(true);

  useEffect(() => {
    setDivisionLoading(true);
    fetchDivision(id).then((division) => {
      setDivision(division);
      setDivisionLoading(false);
    });
  }, [id]);

  const handleUpdateDivision = (division) => {
    setUpdateLoading(true);
    updateDivision(division).then(() => {
      setUpdateLoading(false);
      navigate('/divisions');
    });
  };

  if (divisionLoading) {
    return <Loading />;
  }

  return (
    <DivisionForm
      division={division}
      onSave={handleUpdateDivision}
      disabled={updateLoading}
      onCancel={() => navigate('/divisions')}
    />
  );
};

export default DivisionUpdater;
