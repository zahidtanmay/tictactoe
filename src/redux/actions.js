import { CHECK, STATUS_CHANGE, SOCKET_DATA, ERROR_DATA, INIT_GAME } from "./actionTypes";



export const check = content => ({
  type: CHECK,
  payload: {
    content
  }
})


export const statusChange = content => ({
  type: STATUS_CHANGE,
  payload: {
    content
  }
})

export const socketData = content => ({
  type: SOCKET_DATA,
  payload: {
    content
  }
})

export const setError = content => ({
  type: ERROR_DATA,
  payload: {
    content
  }
})

export const initGame = content => ({
  type: INIT_GAME,
  payload: {
    content
  }
})

