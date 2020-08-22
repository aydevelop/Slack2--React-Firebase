import { combineReducers } from 'redux'
import * as actionTypes from '../actions/types'

const initialState = {
  currentUser: {},
  isLoading: true,
}

const user_reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false,
      }

    case actionTypes.CLEAR_USER:
      return {
        ...initialState,
        isLoading: false,
      }

    case actionTypes.SET_LOADING:
      return {
        isLoading: action.payload,
      }

    default:
      return state
  }
}

const rootReducer = combineReducers({
  user: user_reducer,
})

export default rootReducer
