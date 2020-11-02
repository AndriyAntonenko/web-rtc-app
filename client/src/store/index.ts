import { configureStore } from '@reduxjs/toolkit';
import { initialStore } from './initialStore';

import { reducer as users } from './reducers/user';

function initStore() {
  const store = configureStore({
    preloadedState: initialStore,
    reducer: { users }
  });

  return store;
}

export { initStore };
