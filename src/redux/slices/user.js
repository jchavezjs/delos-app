import {createSlice} from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import {login} from '../../api/User';

const initialState = {
  info: localStorage.getItem('delos_user')
  ? jwt_decode(localStorage.getItem('delos_user'))
  : null,
}

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.info = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setInfo} = userSlice.actions;

export const signIn = (email, password) => async dispatch => {
  try {
    const response = await login(email, password);
    if (!response.error && response.status === 200) {
      const {token} = response.data;
      await localStorage.setItem('delos_user', token);
      dispatch(setInfo(jwt_decode(token)));
      return {
        status: 'success',
      };
    }
    if (response.error?.response?.status === 401) {
      return {
        status: 'error',
        type: 'not-found'
      };
    }
    return {
      status: 'error',
      type: 'unkown'
    };
  } catch (e) {
    return {
      status: 'error',
      type: 'unknown',
    };
  }
};


export default userSlice.reducer;
