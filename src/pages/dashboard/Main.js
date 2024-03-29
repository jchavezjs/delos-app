import {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {message} from 'antd';
import produce from 'immer';
import {logout, selectUser, getUserDetails, selectUserDetails} from '../../redux/slices/user';
import {myCampaigns, selectCampaigns, getCampaignBatches, getLast} from '../../redux/slices/campaigns';
import DashboardUI from './components/DashboardUI';

const Dashboard = () => {
  const [loading, handleLoading] = useState(true);
  const [results, handleResults] = useState([]);
  const [campaign, handleCampaign] = useState(null);
  const [mode, handleMode] = useState('empty');
  const [searchVal, handleSearchVal] = useState('');
  const user =  useSelector(selectUser);
  const userDetails =  useSelector(selectUserDetails);
  const campaigns = useSelector(selectCampaigns);
  const dispatch = useDispatch();

  const closeSession = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const initialFetch = useCallback(async () => {
    const response = await dispatch(myCampaigns(user.id));
    if (response.status === 'success') {
      handleResults(response.campaigns);
      if (mode === 'edit') {
        const index = response.campaigns.findIndex(el => el.id === campaign.id);
        if (index > -1) {
          handleCampaign(response.campaigns[index]);
        }
      }
    } else {
      message.error('Try again later');
    }
    handleLoading(false);
  }, [dispatch, user.id]);

  useEffect(() => {
    const verifySession = async () => {
      const exp = user.exp;
      const actual = Math.floor(Date.now() / 1000);
      if (parseInt(actual, 10) > parseInt(exp, 10)) {
        closeSession();
      } else {
        await initialFetch();
        await dispatch(getUserDetails(user.id));
      }
    };
    verifySession();
  }, [closeSession, dispatch, initialFetch, user.exp, user.id]);

  useEffect(() => {
    const countup = setInterval(initialFetch, 120000);

    return () => {
      clearInterval(countup);
    };
  }, [initialFetch]);

  useEffect(() => {
    handleResults(campaigns);
    handleSearchVal('');
  }, [campaigns]);

  const selectCampaign = selected => {
    handleMode('edit');
    handleCampaign(selected);
  };

  const createCampaign = () => {
    handleMode('new');
    handleCampaign(null);
  };

  const renewInfo = async batches => {
    if (batches) {
      const response = await dispatch(getCampaignBatches(user.id, campaign.id));
      if (response.status === 'success') {
        const newCampaign = produce(campaign, draftState => {
          draftState.batches = response.batches;
        });
        handleCampaign(newCampaign);
      }
    } else {
      const response = await dispatch(getLast(user.id));
      if (response.status === 'success') {
        handleCampaign(response.campaign);
        handleMode('edit');
      }
    }
  };

  function slugify(str) {
    const map = {
      a: 'á|à|ã|â|À|Á|Ã|Â',
      e: 'é|è|ê|É|È|Ê',
      i: 'í|ì|î|Í|Ì|Î',
      o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
      u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      c: 'ç|Ç',
      n: 'ñ|Ñ',
    };
  
    // eslint-disable-next-line no-param-reassign
    str = str.toLowerCase();
  
    for (let pattern in map) {
      str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    }
  
    return str;
  }

  const searchCampaign = e => {
    const search = e.target.value;
    if (search !== '') {
      const newResults = [];
      campaigns.map(item => {
        const evaluar = slugify(item.info.title).indexOf(slugify(search));
        if (evaluar >= 0) {
          newResults.push(item);
        }
      });
      handleResults(newResults);
    } else {
      handleResults(campaigns);
    }
    handleSearchVal(search);
  };

  return (
    <DashboardUI
      campaigns={results}
      closeSession={closeSession}
      loading={loading}
      selectCampaign={selectCampaign}
      createCampaign={createCampaign}
      campaign={campaign}
      mode={mode}
      renewInfo={renewInfo}
      searchVal={searchVal}
      searchCampaign={searchCampaign}ç
      userDetails={userDetails}
    />
  );
}

export default Dashboard;