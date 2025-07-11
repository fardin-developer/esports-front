import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'

// Save auth state to localStorage
function saveAuthState(state) {
  try {
    const serializedState = JSON.stringify({
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
      userMobile: state.auth.userMobile,
    })
    localStorage.setItem('auth', serializedState)
  } catch (e) {}
}

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

store.subscribe(() => {
  saveAuthState(store.getState())
})

export default store 