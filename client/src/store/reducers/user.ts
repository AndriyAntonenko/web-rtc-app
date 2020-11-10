import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: [] as string[],
  reducers: {
    addUser: (state, action) => {
      return [...state, ...action.payload]
    },
    deleteUser: (state, action) => {
      console.info(action)
      return state.filter(userId => userId !== action.payload.id);
    }
  }
});

const { actions, reducer } = userSlice;

export { actions, reducer };

