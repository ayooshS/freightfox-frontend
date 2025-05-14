import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slice/vehicleSlice';
import shiporderReducer from './slice/shiporder';
import authReducer from './slice/authentication';


export const store = configureStore({
	reducer: {
		vehicle: vehicleReducer,
		order: shiporderReducer,
		auth: authReducer,

	},
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

