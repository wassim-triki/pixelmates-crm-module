import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {}, // Add reducers here when needed
});

export default store; // ✅ Make sure it's exported as default
