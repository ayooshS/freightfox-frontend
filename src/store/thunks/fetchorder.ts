import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchorder = createAsyncThunk('users/fetch', async () => {
	const response = await axios.get('/api/orders?status=new');

	return response.data;
});

export { fetchorder };