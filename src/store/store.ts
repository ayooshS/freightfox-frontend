import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slice/vehicleSlice';
import shiporderReducer from './slice/shiporder';


export const store = configureStore({
	reducer: {
		vehicle: vehicleReducer,
		order: shiporderReducer
	},
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

