import {createSlice} from '@reduxjs/toolkit';
import {
  getCampigns,
  newCampign,
  newImage,
  newBatch,
  getDetails,
  getBatches,
} from '../../api/Campaign';

export const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: {
    campaigns: [],
  },
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setBatches: (state, action) => {
      const {campaign, batches} = action.payload;
      const index = state.campaigns.findIndex(el => el.id === campaign);
      state.campaigns[index].batches = batches;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setCampaigns, setBatches} = campaignsSlice.actions;

export const myCampaigns = user => async dispatch => {
  try {
    const response = await getCampigns(user);
    if (!response.error && response.status === 200) {
      const {campaigns} = response.data;
      campaigns.reverse();
      dispatch(setCampaigns(campaigns));
      return {
        status: 'success',
        campaigns:  campaigns || [],
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

export const createCampaign = info => async () => {
  try {
    const response = await newCampign(info);
    if (!response.error && response.status === 200) {
      return {
        status: 'success',
        campaing: response.data.campaign,
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


export const uploadImage = info => async () => {
  try {
    const response = await newImage(info);
    if (!response.error && response.status === 200) {
      return {
        status: 'success',
        url: response.data.image,
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

export const createBatch = info => async () => {
  try {
    const response = await newBatch(info);
    if (!response.error && response.status === 200) {
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

export const getBatchDetails = (user, batch) => async () => {
  try {
    const response = await getDetails(user, batch);
    if (!response.error && response.status === 200) {
      return {
        status: 'success',
        details: response.data.results,
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

export const getCampaignBatches = (user, campaign) => async dispatch => {
  try {
    const response = await getBatches(user, campaign);
    if (!response.error && response.status === 200) {
      const {batches} = response.data;
      dispatch(setBatches({campaign, batches}));
      return {
        status: 'success',
        batches,
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


export const selectCampaigns = state => state.campaigns.campaigns;

export default campaignsSlice.reducer;
