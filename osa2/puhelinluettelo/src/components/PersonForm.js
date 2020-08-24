import React from 'react';

const PersonForm = (props) => {
    return(
        <div>
        <form onSubmit={props.submitName}>
            <div>name: <input value={props.name}
            onChange={props.nameInput}/></div>
            <div>number: <input value={props.number}
            onChange={props.numberInput}/></div>
            <div><button type="submit">add</button></div>
      </form>
        </div>
    )
}

export default PersonForm