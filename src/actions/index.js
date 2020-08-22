import * as actionTypes from './types'

//User

export const setUser = (user) => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
    },
  }
}

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER,
  }
}

export const setLoading = (flag) => {
  return {
    type: actionTypes.SET_LOADING,
    payload: flag,
  }
}

//Channel

export const setCurrentChannel = (channel) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel,
    },
  }
}
