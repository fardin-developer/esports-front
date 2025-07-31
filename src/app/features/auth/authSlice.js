import { createSlice } from '@reduxjs/toolkit'
import { apiClient } from '../../apiClient';

const initialState = {
  token: null,
  isLoggedIn: false,
  userMobile: '',
  hydrated: false, // new flag to track hydration
  balance: 0, // wallet balance
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
      state.balance = 0
      // Clear localStorage when logging out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth')
      }
    },
    forceLogout: (state) => {
      // Force logout for 401 errors - same as logout but can be tracked separately
      state.token = null
      state.isLoggedIn = false
      state.userMobile = ''
      state.balance = 0
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth')
      }
    },
    rehydrateAuth: (state, action) => {
      // Only update if payload exists
      if (action.payload) {
        state.token = action.payload.token
        state.isLoggedIn = action.payload.isLoggedIn
        state.userMobile = action.payload.userMobile
        state.balance = action.payload.balance || 0
      }
      state.hydrated = true
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
  },
})

export const { login, logout, forceLogout, rehydrateAuth, setBalance } = authSlice.actions

// Thunk to fetch wallet balance
export const fetchWalletBalance = () => async (dispatch, getState) => {
  try {
    const response = await apiClient.get('/wallet/balance')
    if (response.success) {
      dispatch(setBalance(response.balance))
    }
  } catch (error) {
    console.error('Failed to fetch wallet balance:', error)
    // Don't dispatch anything on error to avoid infinite loops
  }
}

export default authSlice.reducer 