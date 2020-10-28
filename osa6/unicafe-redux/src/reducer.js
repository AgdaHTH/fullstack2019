const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const newState_good = {...state, good: state.good+1}
      return newState_good
    case 'OK':
      const newState_ok = {...state, ok: state.ok+1}
      return newState_ok
    case 'BAD':
      const newState_bad = {...state, bad: state.bad+1}
      return newState_bad
    case 'ZERO':
      const newState_zero = initialState
      return newState_zero
    default: return state
  }
  
}

export default counterReducer