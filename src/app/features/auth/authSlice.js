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

export const { login, logout, rehydrateAuth, setBalance } = authSlice.actions

// Thunk to fetch wallet balance
export const fetchWalletBalance = () => async (dispatch) => {
  try {
    const res = await apiClient.get('/wallet/balance');
    if (res.success) {
      dispatch(setBalance(res.balance));
    }
  } catch (e) {
    // Optionally handle error
    // dispatch(setBalance(0));
  }
};

export default authSlice.reducer 