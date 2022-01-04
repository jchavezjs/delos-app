import {createSlice} from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import {login, getDetails} from '../../api/User';

const initialState = {
  info: localStorage.getItem('delos_user')
  ? jwt_decode(localStorage.getItem('delos_user'))
  : null,
  details: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    setDetails: (state, action) => {
      state.details = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setInfo, setDetails} = userSlice.actions;

export const signIn = (email, password) => async dispatch => {
  try {
    const response = await login(email, password);
    if (!response.error && response.status === 200) {
      if (response.data.token) {
        const {token} = response.data;
        await localStorage.setItem('delos_user', token);
        dispatch(setInfo(jwt_decode(token)));
        return {
          status: 'success',
        };
      }
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

export const getUserDetails = user => async dispatch => {
  try {
    const response = await getDetails(user);
    if (!response.error && response.status === 200) {
      dispatch(setDetails(response.data.account));
      return {
        status: 'success',
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

export const logout = () => dispatch => {
  localStorage.removeItem('delos_user');
  dispatch(setInfo(null));
  dispatch(setDetails({}));
};

export const selectUser = state => state.user.info;
export const selectUserDetails = state => state.user.details;

export default userSlice.reducer;
