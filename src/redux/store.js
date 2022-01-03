import {configureStore} from '@reduxjs/toolkit';
import user from './slices/user';
import campaigns from './slices/campaigns';

export const store = configureStore({
  reducer: {
    user,
    campaigns,
  },
});
