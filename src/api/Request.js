import axios from 'axios';

const getInstance = async file => {
  // const baseURL = 'https://3188-190-150-219-80.ngrok.io';
  const baseURL = 'https://delos-on.herokuapp.com';
  const timeout = 60000;
  
  const request = axios.create({
    baseURL,
    timeout,
    headers: {'Content-Type': file ? 'multipart/form-data' : 'application/json'},
  });
  
  request.interceptors.request.use(
    async config => {
      const token = localStorage.getItem('delos_user');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      if (file) {

      }
      return config;
    },
    error => Promise.reject(error)
  )
  return request;
};


export default getInstance;
