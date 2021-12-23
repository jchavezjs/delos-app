import cx from 'classnames';
import styles from '../styles/Campaign.module.css';

const Campaign = ({campaign}) => {
  const complete = campaign.progress === 100;
  return (
    <div className={styles.campaign}>
      <div className={cx(styles.indicator, {[styles.complete]: complete})}>
        {!complete ? (
          <span className={styles.number}>
            {`${campaign.progress}%`}
          </span>
        ) : (
          <span className={cx('material-icons-round', styles.done)}>
            verified
          </span>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.mainInfo}>
          <span className={styles.name}>Get ID data for KYC</span>
          <span className={styles.description}>
            Get main information of El Salvador’s Identity documents.
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