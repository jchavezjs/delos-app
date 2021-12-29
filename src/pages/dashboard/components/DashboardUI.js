import {useNavigate} from 'react-router-dom';
import {Row, Col, Dropdown, Menu, Input, Button} from 'antd';
import Campaign from './Campaign';
import Editor from './Editor';
import {ReactComponent as Logo} from '../../../assets/logos/logo-purple.svg';
import styles from '../styles/DashboardUI.module.css';

const DashboardUI = ({campaigns}) => {
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item onClick={() => navigate('/login')} danger>
        Log out
      </Menu.Item>
    </Menu>
  );

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
                prefix={
                  <span className="material-icons-round">
                    search
                  </span>
                }
              />
              <Button size="large" className={styles.newCampaign} type="primary">
                Create Campaign
                <span className="material-icons-round">
                  add
                </span>
              </Button>
            </div>
            <div className={styles.campaignsList}>
              {campaigns.map(campaign => (
                <Campaign key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </Col>
        <Col span={12} className={styles.editor}>
          <Editor />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardUI;
