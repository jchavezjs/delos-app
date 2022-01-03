import {Row, Col, Dropdown, Menu, Input, Button, Spin} from 'antd';
import cx from 'classnames';
import {ReactComponent as Logo} from '../../../assets/logos/logo-purple.svg';
import Campaign from './Campaign';
import Editor from './Editor';
import Empty from '../assets/emtpy.png';
import styles from '../styles/DashboardUI.module.css';

const DashboardUI = props => {
  const {
    campaigns,
    closeSession,
    loading,
    selectCampaign,
    createCampaign,
    campaign,
    mode,
    renewInfo,
    searchVal,
    searchCampaign,
  } = props;

  const menu = (
    <Menu>
      <Menu.Item onClick={closeSession} danger>
        Log out
      </Menu.Item>
    </Menu>
  );

  const getContent = () => {
    if (loading) {
      return (
        <div className={styles.loader}>
          <Spin size="large" />
        </div>
      );
    } else if (!campaigns.length) {
      return (
        <div className={styles.loader}>
          <span className={styles.emptyTitle}>
            Empty campaigns
          </span>
          <span className={styles.emptyDescription}>
            Create a new campaign
          </span>
        </div>
      );
    }
    return (
      <div className={styles.campaignsList}>
        {campaigns.map(campaign => (
          <Campaign
            key={campaign.id}
            campaign={campaign}
            selectCampaign={selectCampaign}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      <Row>
        <Col span={24}>
          <div className={styles.header}>
            <Logo className={styles.logo} />
            <Dropdown overlay={menu} placement="bottomRight">
              <div className={styles.accountWrap}>
                <span className={styles.account}>
                  Profile
                </span>
                <span className="material-icons-round">
                  account_circle
                </span>
              </div>
            </Dropdown>
          </div>
        </Col>
      </Row>
      <Row className={styles.rowBody}>
        <Col span={12}>
          <div className={styles.campaigns}>
            <h1 className={styles.title}>Campaigns</h1>
            <span className={styles.description}>
              Use our amazing workforce to obtain data from<br /> a document or image.
            </span>
            <div className={styles.searchWrap}>
              <Input
                placeholder="Search campaign"
                size="large"
                className={styles.input}
                value={searchVal}
                onChange={searchCampaign}
                prefix={
                  <span className="material-icons-round">
                    search
                  </span>
                }
              />
              <Button
                onClick={createCampaign}
                size="large"
                className={styles.newCampaign}
                type="primary"
              >
                Create Campaign
                <span className="material-icons-round">
                  add
                </span>
              </Button>
            </div>
            {getContent()}
          </div>
        </Col>
        <Col span={12} className={styles.editor}>
          {mode !== 'empty' ? (
            <Editor campaign={campaign} mode={mode} renewInfo={renewInfo} />
          ) : (
            <div className={cx(styles.loader, styles.emptyLoader)}>
              <img className={styles.emtpyImg} src={Empty} alt="" />
              <span className={styles.emptyTitle}>
                No campaign selected
              </span>
              <span className={styles.emptyDescription}>
                Click on any of the campaigns or create a new one.
              </span>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DashboardUI;
