import instance from './Request';

export const getCampigns = async user => {
  const request = await instance();
  let data = await request
    .get(`/campaign/${user}`)
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

export const newCampign = async info => {
  const request = await instance(true);
  let data = await request
    .post('/campaign', info, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

export const newImage = async info => {
  const request = await instance(true);
  let data = await request
    .post('/upload-image', info, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

export const newBatch = async info => {
  const request = await instance();
  let data = await request
    .post('/batch', info)
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

export const getDetails = async (user, batch) => {
  const request = await instance();
  let data = await request
    .get(`/batch/${user}/batch/${batch}`)
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

export const getBatches = async (user, campaign) => {
  const request = await instance();
  let data = await request
    .get(`/batch/${user}/${campaign}`)
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};

export const getLastCampaign = async user => {
  const request = await instance();
  let data = await request
    .get(`/campaign/${user}/last`)
    .catch((error) => {
      return {
        error,
      };
    });
  return data;
};
