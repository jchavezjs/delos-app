import instance from './Request';

export const login = async (email, password) => {
  const request = await instance();
  let data = await request
    .post('/auth', {
      email,
      password,
    })
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

export const getDetails = async user => {
  const request = await instance();
  let data = await request
    .get(`/user/${user}`)
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

