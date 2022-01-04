import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Spin, Row, Col} from 'antd';
import {getBatchDetails} from '../../../redux/slices/campaigns';
import {selectUser} from '../../../redux/slices/user';
import styles from '../styles/TaskDetails.module.css';

const TaskDetails = ({close, task}) => {
  const [loading, handleLoading] = useState(true);
  const [details, handleDetails] = useState([]);
  const user =  useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const initialFetch = async () => {
      const response = await dispatch(getBatchDetails(user.id, task.batch_id));
      if (response.status === 'success') {
        handleDetails(response.details);
      }
      handleLoading(false);
    };
    initialFetch();
  }, []);

  const Detail = ({detail}) => (
    <Col span={12}>
      <div className={styles.detail}>
        <Row gutter={10} className={styles.detailRow}>
          <Col span={7}>
            <div className={styles.photo} />
          </Col>
          <Col span={7}>
            <span className={styles.labelMain}>
              Task ID
            </span>
            <span className={styles.valueMain}>
              {detail.id}
            </span>
          </Col>
          <Col span={10}>
            <span className={styles.labelMain}>
              Account ID
            </span>
            <span className={styles.valueMain}>
              {detail.account_id}
            </span>
          </Col>
        </Row>
        {Object.keys(detail.data).map(key => (
          <Row className={styles.detailRow}>
            <Col span={24}>
              <div className={styles.item}>
                <span className={styles.itemLabel}>
                  {key}
                </span>
                <div className={styles.wrapValue}>
                  <span>
                    {detail.data[key]}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        ))}
      </div>
    </Col>
  );

  return (
    <div className={styles.taskDetails}>
      <div className={styles.header}>
        <div className={styles.close} onClick={close}>
          <span className="material-icons-round">
            close
          </span>
        </div>
        <span className={styles.title}>Task results</span>
      </div>
      <span className={styles.description}>
        Check how our WorkForce categorized your documents.
      </span>
      <div className={styles.details}>
        {loading ? (
          <div className={styles.loader}>
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.details}>
            <Row gutter={[20, 20]}>
              {details.map(detail => (
                <Detail key={detail.id} detail={detail} />
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
