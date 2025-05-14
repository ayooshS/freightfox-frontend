import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Auth = {
	isauthenticated: boolean;
	name?: string;
	email?: string;
	picture?: string;
	exp?: number;
};

const initialState: Auth = {
	isauthenticated: false,
	name: undefined,
	email: undefined,
	picture: undefined,
	exp: undefined,

};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<Auth>) => {
			state.isauthenticated = true;
			state.name = action.payload.name;
			state.email = action.payload.email;
			state.picture = action.payload.picture;
			state.exp = action.payload.exp;
		},
		logout: (state) => {
			state.isauthenticated = false;
			state.name = undefined;
			state.email = undefined;
			state.picture = undefined;
			state.exp = undefined;
		},
	},
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
