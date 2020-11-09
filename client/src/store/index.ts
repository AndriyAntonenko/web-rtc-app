import { configureStore } from '@reduxjs/toolkit';
import { initialStore } from './initialStore';

import { reducer as users } from './reducers/user';
import { reducer as wsConnectionData } from './reducers/wsConnection';

function initStore() {
  const store = configureStore({
    preloadedState: initialStore,
    reducer: { users, wsConnectionData }
  });

  return store;
}

export { initStore };
