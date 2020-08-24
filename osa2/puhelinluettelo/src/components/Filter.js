import React from 'react'

const Filter = (props) => {
    return (
        <div> filter shown with &nbsp;
            <input onChange={props.filternames}/>
        </div>
    )
}

export default Filter