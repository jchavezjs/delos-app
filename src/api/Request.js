import axios from 'axios';

const getInstance = async () => {
  const baseURL = 'https://delos-on.herokuapp.com';
  const timeout = 60000;
  
  const request = axios.create({
    baseURL,
    timeout,
    headers: {'Content-Type': 'application/json'},
  });
  
  request.interceptors.request.use(
    async config => {
      const token = localStorage.getItem('delos_user');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  )
  return request;
};


export default getInstance;
