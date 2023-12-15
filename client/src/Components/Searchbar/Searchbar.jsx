import React from 'react';

export default function Searchbar({ searchTerm, setSearchTerm, filterTerm, setFilterTerm }) {
  const page = window.location.href.split('/');

  const handleFilterChange = (value) => {
    if (value === filterTerm) {
      setFilterTerm(null);
    } else {
      setFilterTerm(value);
    }
  };

  return (
    <>
      {!page.includes('equipments') ? (
        <div>
          <input
            placeholder='Filter employees...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label>
            <input
              type='checkbox'
              checked={filterTerm === 'level'}
              onChange={() => handleFilterChange('level')}
            />
            by Level
          </label>
          <label>
            <input
              type='checkbox'
              checked={filterTerm === 'position'}
              onChange={() => handleFilterChange('position')}
            />
            by Position
          </label>
        </div>
      ) : (
        <div>
          <input
            placeholder='Filter equipments...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
    </>
  );
}
