import React, { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Persons from './components/Persons';
import personsService from './services/persons';
import Notification from './components/Notification';


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorStyle, setErrorStyle] = useState({})

  const error = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  }

  const notification = {
    color: "blue",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  }

  useEffect(() => {
    personsService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      const confirm = window.confirm(
        `${newName} is already added to the phonebook. Replace the old number with a new one?`
      );
      if (confirm) {
        personsService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
          setNewName('');
          setNewNumber('');
          setErrorStyle(notification)
          setErrorMessage(
            `Number has been replaced for ${existingPerson.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        
      }
    } else {
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setErrorStyle(notification)
          setErrorMessage(
            `Added ${returnedPerson.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        });
    }
  };

  const deletePerson = (person) => {
    const confirm = window.confirm(`Delete ${person.name}?`);
    if (confirm) {
      personsService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id));
          setErrorStyle(notification)
          setErrorMessage(
            `Deleted ${person.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(() => {
          setErrorStyle(error)
          setErrorMessage(
            `Information of ${person.name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          personsService
            .getAll()
            .then(initialPersons => {
              setPersons(initialPersons)
            })
        })
    }
  };
  

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} errorStyle={errorStyle}/>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName} newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
        <Persons personsToShow={personsToShow} handleDelete={deletePerson} />
    </div>
  );
};

export default App;
