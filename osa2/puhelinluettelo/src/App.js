import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'
import axios from 'axios'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const baseUrl = '/api/persons'
  //'https://cryptic-bayou-39171.herokuapp.com/api/persons'
  //'http://localhost:3001/api/persons'

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const names = persons.map( person => person.name )
    console.log(names)

    if (names.includes(newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){ 
        const personToBeUpdated = persons.find(person => person.name === newName )
        const updatedPerson = { ...personToBeUpdated, number: newNumber}
        //siirrä tämä vielä serviceen?
        axios
          .put(`${baseUrl}/${updatedPerson.id}`, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== personToBeUpdated.id ? person : response.data))          
          })

          .catch(error => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            
          })
          setErrorMessage(
            `${newName}'s number was updated`
          )
          setTimeout(() =>{
            setErrorMessage(null)
          }, 5000)
      }
    } else {

      const personObject = {
        name : newName,
        number : newNumber
      }  

      console.log('lisätään', personObject)

      personService
        .create(personObject)
        .then(response => {
          console.log('response.data', response.data)
          setPersons(persons.concat(response.data))
        })

        /*
        .then(returnedPerson => {
          console.log('takaisin', returnedPerson)
          setPersons(persons.concat(returnedPerson))    
        })
        */
       
        .catch(error => {
          console.log(error.response.data)
          const error_info = error.response.data.error
          setErrorMessage(`${error_info}`)
        })
        

        setErrorMessage(
          `${newName} was added to phonebook`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
       
    }
    setNewName('')
    setNewNumber('')
  }

  const deleteName = (id) => {
    const personToBeDeleted = persons.find(person => person.id === id )
    
    if (window.confirm(`Delete ${personToBeDeleted.name}?`)) {
      axios
      .delete(`${baseUrl}/${id}`)    
      .then(response => console.log(response))
      const remainingNames = persons.filter(person => person.id !== id)
      setPersons(remainingNames)

      setErrorMessage(
        `${personToBeDeleted.name} was deleted from phonebook`
      )
      setTimeout(() =>{
        setErrorMessage(null)
      }, 5000)
    }
     
  }

  const handleNameInput = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)   
  }

  const handleNumberInput = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  } 

  const filteredPersons = () => {
    if (filter === (''))
        { 
          return persons
        }
        else {
          return persons.filter(person => person.name.toLowerCase().includes(filter))
        }                
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {errorMessage} />
      <Filter filternames={handleFilter}/>
      
      <h3>Add a new</h3>
      
      <PersonForm submitName={addName} 
        nameInput={handleNameInput} 
        numberInput={handleNumberInput}
        name={newName}
        number={newNumber}/>

      <h3>Numbers</h3>
      <Persons showPersons={filteredPersons()} deletePerson={deleteName} />
    </div>
  )

}

export default App