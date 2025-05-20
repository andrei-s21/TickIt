import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import itemsReducer from './Slices/listSlice';

const store = configureStore({
    reducer: {
      user: userReducer,
      items: itemsReducer,
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  
  export default store;