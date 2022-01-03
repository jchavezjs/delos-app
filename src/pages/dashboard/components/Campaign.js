import cx from 'classnames';
import styles from '../styles/Campaign.module.css';

const Campaign = ({campaign, selectCampaign}) => {
  const complete = campaign.progress === 100;
  return (
    <div className={styles.campaign} onClick={() => selectCampaign(campaign)}>
      <div className={cx(styles.indicator, {[styles.complete]: complete})}>
        {!complete ? (
          <span className={styles.number}>
            {`${campaign.progress || 0}%`}
          </span>
        ) : (
          <span className={cx('material-icons-round', styles.done)}>
            verified
          </span>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.mainInfo}>
          <span className={styles.name}>{campaign.info.title}</span>
          <span className={styles.description}>
            {campaign.info.description}
          </span>
        </div>
        <span className={cx('material-icons-round', styles.arrow)}>
          arrow_forward_ios
        </span>
      </div>
    </div>
  );
};

export default Campaign;