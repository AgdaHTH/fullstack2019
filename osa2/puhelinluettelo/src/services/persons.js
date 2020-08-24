import axios from 'axios'
const baseUrl = '/api/persons'
//'https://cryptic-bayou-39171.herokuapp.com/api/persons'
//'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newObject) => {
    console.log('servicessä', newObject)
    return axios.post(baseUrl, newObject)
    /*
    
    const request = axios.post(baseUrl, newObject)
    console.log('request', request)
    return request.then(response => response.data)*/
}
  

//const deletePerson = id => {
  //  axios.delete(`${baseUrl}/${id}`)
    //return request.then(response => response.data)
//}


/*
const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}*/

export default {
    getAll: getAll,
    create: create,
    //deletePerson : deletePerson
    //update: update
}