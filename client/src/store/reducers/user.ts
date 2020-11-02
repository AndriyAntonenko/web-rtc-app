import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: [] as string[],
  reducers: {
    addUser: (state, action) => {
      return [...state, action.payload]
    }
  }
});

const { actions, reducer } = userSlice;

export { actions, reducer };

