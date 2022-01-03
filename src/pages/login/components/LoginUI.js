import {Row, Col, Form, Input, Button} from 'antd';
import cx from 'classnames';
import {ReactComponent as Logo} from '../../../assets/logos/logo-white.svg';
import {ReactComponent as Instagram} from '../../../assets/social/instagram.svg';
import {ReactComponent as Twitter} from '../../../assets/social/twitter.svg';
import {ReactComponent as SquarePink} from '../assets/squarePink.svg';
import {ReactComponent as SquarePink2} from '../assets/squarePink2.svg';
import {ReactComponent as SquareYellow} from '../assets/squareYellow.svg';
import {ReactComponent as SquareYellow2} from '../assets/squareYellow2.svg';
import {ReactComponent as SquarePurple} from '../assets/squarePurple.svg';
import {ReactComponent as SquarePurple2} from '../assets/squarePurple2.svg';
import {ReactComponent as SquareBlue} from '../assets/squareBlue.svg';
import {ReactComponent as SquareLightPurple} from '../assets/squareLightPurple.svg';
import {ReactComponent as SquareOrange} from '../assets/squareOrange.svg';
import styles from '../styles/LoginUI.module.css';

const LoginUI = ({login, sending, form}) => (
  <div className={styles.login}>
    <Row>
      <Col lg={14}>
        <div className={styles.formWrap}>
          <div className={styles.form}>
            <Logo className={styles.logo} />
            <span className={styles.description}>
              An Effect Network UI, specifically thought for image labeling tasks 💥
            </span>
            <Form
              name="basic"
              onFinish={login}
              onFinishFailed={login}
              colon={false}
              requiredMark={false}
              form={form}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label={<span className={styles.label}>Email</span>}
                name="email"
                required={false}
              >
                <Input size="large" className={styles.input} />
              </Form.Item>

              <Form.Item
                label={<span className={styles.label}>Password</span>}
                name="password"
                required={false}
              >
                <Input.Password size="large" className={styles.input} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  htmlType="submit"
                  loading={sending}
                  className={styles.submit}>
                  Log In
                </Button>
              </Form.Item>
            </Form>
            <div className={styles.social}>
              <a
                href="https://instagram.com/delos_on"
                target="_blank"
                rel="noopener noreferrer">
                <Instagram />
              </a>
              <a
                href="https://twitter.com/delos_on"
                target="_blank"
                rel="noopener noreferrer">
                <Twitter />
              </a>
            </div>
          </div>
        </div>
      </Col>
      <Col lg={10}>
        <div className={styles.sideWrap}>
          <Row>
            <Col span={10}>
              <div className={cx(styles.side, styles.leftSide)}>
                <div className={styles.squarePink}>
                  <SquarePink className={styles.square} />
                </div>
                <div className={styles.squareYellow}>
                  <SquareYellow className={styles.square} />
                </div>
              </div>
            </Col>
            <Col span={14}>
              <div className={cx(styles.side, styles.rightSide)}>
                <div className={styles.squarePurple}>
                  <SquarePurple className={styles.square} />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={cx(styles.side, styles.bottomSide)}>
                <div className={styles.squareBlue}>
                  <SquareBlue className={styles.square} />
                </div>
                <div className={styles.squareOrange}>
                  <SquareOrange className={styles.square} />
                </div>
                <div className={styles.squarePink2}>
                  <SquarePink2 className={styles.square} />
                </div>
                <div className={styles.squarePurple2}>
                  <SquarePurple2 className={styles.square} />
                </div>
                <div className={styles.squareLightPurple}>
                  <SquareLightPurple className={styles.square} />
                </div>
                <div className={styles.squareYellow2}>
                  <SquareYellow2 className={styles.square} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
);

export default LoginUI;
