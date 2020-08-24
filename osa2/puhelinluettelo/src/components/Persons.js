import React from 'react';

const Persons = (props) => {
    return(
        <div>
            {props.showPersons.map( person => 
            <p key={person.name}>
              {person.name} &nbsp;
              {person.number} &nbsp;
              <button onClick={() => props.deletePerson(person.id)}>delete</button>
              </p>)}
        </div>
    )
}

export default Persons