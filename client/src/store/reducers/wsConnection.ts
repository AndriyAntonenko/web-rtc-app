import { createSlice } from '@reduxjs/toolkit';
import { IWebSocketConnectionData } from '@webrtc_experiment/shared';

const wsConnectionSlice = createSlice({
  name: 'wsConnectionData',
  initialState: {} as Partial<IWebSocketConnectionData>,
  reducers: {
    addConnectionData: (state, action) => {
      return action.payload
    }
  }
});

const { actions, reducer } = wsConnectionSlice;

export { actions, reducer };
