import React from 'react';


const Persons = ({ personsToShow, handleDelete }) => {
  return (
    personsToShow.map(person =>
      <div key={person.id}><p key={person.name}>{person.name} {person.number}</p><button onClick={() => handleDelete(person)}>delete</button></div>
    )
  )
}

export default Persons

