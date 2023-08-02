import { configureStore } from '@reduxjs/toolkit'
import authSlice from './features/authSlice'
import feedSlice from './features/feedSlice'
import appSlice from './features/appSlice'

const store = configureStore({
  reducer: {
    app: appSlice,
    auth: authSlice,
    feed: feedSlice
  }
})

export default store