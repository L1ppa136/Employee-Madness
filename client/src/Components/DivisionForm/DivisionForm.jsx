import { useState, useEffect } from 'react';

const DivisionForm = ({ division, onSave, disabled, onCancel }) => {
  const [name, setName] = useState(division?.name ?? '');
  const [boss, setBoss] = useState(division?.boss ?? '');
  const [city, setCity] = useState(division?.location?.city ?? '');
  const [country, setCountry] = useState(division?.location?.country ?? '');
  const [budget, setBudget] = useState(division?.budget ?? 0);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = () => {
    return fetch('/api/employees').then((res) => res.json());
  };

  useEffect(() => {
    fetchEmployees().then((employees) => setEmployees(employees));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    if (division) {
      return onSave({
        ...division,
        name,
        boss,
        budget,
        location: {
          city,
          country,
        },
      });
    }

    return onSave({
      name,
      boss,
      budget,
      location: {
        city,
        country,
      },
    });
  };

  return (
    <form className='DivisionForm' onSubmit={onSubmit}>
      <div className='control'>
        <label htmlFor='name'>Division name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} name='name' id='name'></input>
      </div>

      <div className='control'>
        <label htmlFor='divBoss'>Manager:</label>
        <select value={boss} onChange={(e) => setBoss(e.target.value)} type='divBoss' id='divBoss'>
          <option value=''>Select Division Manager...</option>
          {employees.map((emp) => (
            <option value={emp._id}>{Object.values(emp.name).join(' ')}</option>
          ))}
        </select>
      </div>

      <div className='control'>
        <label htmlFor='city'>City:</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} city='city' id='city'></input>
      </div>

      <div className='control'>
        <label htmlFor='country'>Country:</label>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          city='city'
          id='city'
        ></input>
      </div>

      <div className='control'>
        <label htmlFor='budget'>Budget:</label>
        <input
          value={budget}
          type='number'
          onChange={(e) => setBudget(e.target.value)}
          budget='budget'
          id='budget'
        ></input>
      </div>

      <div className='buttons'>
        <button type='submit' disabled={disabled}>
          {division ? 'Update Division' : 'Create Division'}
        </button>

        <button type='button' onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DivisionForm;
