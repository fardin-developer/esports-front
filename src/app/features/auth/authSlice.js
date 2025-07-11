import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  isLoggedIn: false,
  userMobile: '',
  hydrated: false, // new flag to track hydration
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token
      state.isLoggedIn = true
      state.userMobile = action.payload.userMobile
    },
    logout: (state) => {
      state.token = null
      state.isLoggedIn = false
      state.userMobile = ''
    },
    rehydrateAuth: (state, action) => {
      // Only update if payload exists
      if (action.payload) {
        state.token = action.payload.token
        state.isLoggedIn = action.payload.isLoggedIn
        state.userMobile = action.payload.userMobile
      }
      state.hydrated = true
    },
  },
})

export const { login, logout, rehydrateAuth } = authSlice.actions
export default authSlice.reducer 