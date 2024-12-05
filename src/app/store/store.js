import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cityReducer from './slices/citySlice';
import availabiltyReducer from './slices/availabilityslice';
import serviceReducer from './slices/serviceslice';
import setupReducer from './slices/setupslice';
import teacherReducer from './slices/teacherslice'; 
import studentReducer from './slices/studentslice';
import contractReducer from './slices/contractsSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    cities: cityReducer,
    availability: availabiltyReducer,
    service: serviceReducer,
    setup: setupReducer,
    teachers: teacherReducer,
    students: studentReducer,
    contracts: contractReducer,

  },
  // Ensure Redux DevTools is enabled
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
