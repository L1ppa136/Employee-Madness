import { useState, useEffect } from 'react';

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const [firstname, setFirstname] = useState(employee?.name?.firstname ?? '');
  const [middlename, setMiddlename] = useState(employee?.name?.middlename ?? '');
  const [lastname, setLastname] = useState(employee?.name?.lastname ?? '');
  const [level, setLevel] = useState(employee?.level ?? '');
  const [position, setPosition] = useState(employee?.position ?? '');
  const [equipments, setEquipments] = useState([]);
  const [equipment, setEquipment] = useState(employee?.equipment ?? '');
  const [brands, setBrands] = useState([]);
  const [favouriteBrand, setFavouriteBrand] = useState(employee?.favouriteBrand ?? '');
  const [startingDate, setStartingDate] = useState(employee?.startingDate ?? '');
  const [currentSalary, setCurrentSalary] = useState(employee?.currentSalary ?? 0);
  const [desiredSalary, setDesiredSalary] = useState(employee?.desiredSalary ?? 0);
  const [favouriteColor, setFavouriteColor] = useState(employee?.favouriteColor ?? 'rgb(0,0,0)');
  const [divisions, setDivisions] = useState([]);
  const [division, setDivision] = useState(employee?.division ?? '');

  const fetchEquipments = () => {
    return fetch('/api/equipments').then((res) => res.json());
  };

  const fetchDivisions = () => {
    return fetch('/api/divisions').then((res) => res.json());
  };

  const fetchBrands = () => {
    return fetch('/api/brands').then((res) => res.json());
  };

  useEffect(() => {
    fetchEquipments().then((equipments) => setEquipments(equipments));
    fetchBrands().then((brands) => setBrands(brands));
    fetchDivisions().then((divisions) => setDivisions(divisions));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    if (employee) {
      return onSave({
        ...employee,
        name: {
          firstname,
          middlename,
          lastname,
        },
        level,
        position,
        equipment,
        favouriteBrand,
        startingDate,
        currentSalary,
        desiredSalary,
        favouriteColor,
        division,
      });
    }

    return onSave({
      name: {
        firstname,
        middlename,
        lastname,
      },
      level,
      position,
      equipment,
      favouriteBrand,
      startingDate,
      currentSalary,
      desiredSalary,
      favouriteColor,
      division,
    });
  };

  return (
    <form className='EmployeeForm' onSubmit={onSubmit}>
      <div className='control'>
        <label htmlFor='firstname'>Firstname:</label>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          name='firstname'
          id='firstname'
        />
      </div>

      <div className='control'>
        <label htmlFor='middlename'>Middlename:</label>
        <input
          value={middlename}
          onChange={(e) => setMiddlename(e.target.value)}
          name='middlename'
          id='middlename'
        />
      </div>

      <div className='control'>
        <label htmlFor='lastname'>Lastname:</label>
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          name='lastname'
          id='lastname'
        />
      </div>

      <div className='control'>
        <label htmlFor='level'>Level:</label>
        <input value={level} onChange={(e) => setLevel(e.target.value)} name='level' id='level' />
      </div>

      <div className='control'>
        <label htmlFor='position'>Position:</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          name='position'
          id='position'
        />
      </div>

      <div className='control'>
        <label htmlFor='startingDate'>Starting date:</label>
        <input
          type='date'
          value={startingDate}
          onChange={(e) => setStartingDate(e.target.value)}
          name='startingDate'
          id='startingDate'
        />
      </div>

      <div className='control'>
        <label htmlFor='currentSalary'>Current salary (annual):</label>
        <input
          type='number'
          value={currentSalary}
          onChange={(e) => setCurrentSalary(e.target.value)}
          name='currentSalary'
          id='currentSalary'
        />
        <label>$</label>
      </div>

      <div className='control'>
        <label htmlFor='desiredSalary'>Desired salary (annual):</label>
        <input
          type='number'
          value={desiredSalary}
          onChange={(e) => setDesiredSalary(e.target.value)}
          name='desiredSalary'
          id='desiredSalary'
        />
        <label>$</label>
      </div>

      <div className='control'>
        <label>Division:</label>
        <select id='division-select' value={division} onChange={(e) => setDivision(e.target.value)}>
          <option value=''>Select a division...</option>
          {divisions.map((division) => {
            return (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className='control'>
        <label htmlFor='favouriteColor'>Favourite color:</label>
        <input
          type='color'
          value={favouriteColor}
          onChange={(e) => setFavouriteColor(e.target.value)}
          name='favouriteColor'
          id='favouriteColor'
        />
      </div>

      <div className='control'>
        <label>Link equipment to employee:</label>
        <select
          id='equipment-select'
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
        >
          <option value=''>Select an equipment...</option>
          {equipments.map((equipment) => {
            return (
              <option key={equipment._id} value={equipment.designation}>
                {equipment.designation}
              </option>
            );
          })}
        </select>
      </div>

      <div className='control'>
        <label>Favourite brand of employee:</label>
        <select
          id='brand-select'
          value={favouriteBrand}
          onChange={(e) => setFavouriteBrand(e.target.value)}
        >
          <option value=''>Select a brand...</option>
          {brands.map((brand) => {
            return (
              <option key={equipment._id} value={brand._id}>
                {brand.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className='buttons'>
        <button type='submit' disabled={disabled}>
          {employee ? 'Update Employee' : 'Create Employee'}
        </button>

        <button type='button' onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
