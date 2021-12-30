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
