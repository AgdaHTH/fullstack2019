import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const SingleCountry = ({country}) => {
  return ( 
    <div>
        <h3>{country.name}</h3>    
        <div>capital&nbsp;{country.capital}</div>
        <div>population&nbsp;{country.population}</div>
        <p></p>
        <div><h4>languages</h4>{country.languages.map(language => <li key={language.name}>{language.name}</li>)}</div>
        <p></p>
        <div><img src={country.flag} alt="flag" width="200" height="100" align="left"/></div>
        </div>
  )}

const Display = (props) => {
  //console.log('maat', props.countries)
  //console.log('filtteri', props.filter)
  //console.log(props)
  const filteredCountries = props.countries.filter(country => country.name.toLowerCase().includes(props.filter) )

      if (filteredCountries.length === 1) {
        return <SingleCountry country={filteredCountries[0]}/>
      } 

      if (filteredCountries.length <= 10) {
        return filteredCountries.map(country => <p key={country.name}> {country.name} &nbsp;
        <button  onClick = {() => props.handleClick(country.name)}>Show</button></p>)
      } 
      
      else {
        return "Too many matches, specify another filter"
      }
      
}

const App = () => {
  const [ filter, setFilter ] = useState('')
  const [ countries, setCountries ] = useState([])
  
  
  useEffect(() => {
    //console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        //console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const handleClick = (props) => {
    console.log('clicked', props)
    const countryName = props.toLowerCase()
    console.log('nimi', countryName)
    setFilter(countryName)
  }

  const handleInput = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
      
  return (
    <div>
      find countries: <input value={filter} onChange={handleInput}/>
      <br></br>
      <Display countries={countries} filter={filter} 
      handleClick={handleClick}/>    
    </div>
  )
}

export default App
