import React from 'react';

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      Filter shown with: <input value={filter} onChange={onChange} />
    </div>
  );
};

export default Filter;
