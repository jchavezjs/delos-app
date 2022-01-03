import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Form, message} from 'antd';
import {signIn} from '../../redux/slices/user';
import LoginUI from './components/LoginUI';

const Login = () => {
  const [sending, handleSending] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const login = async () => {
    handleSending(true);
    try {
      const {email, password} = await form.validateFields();
      if (email.length && password.length) {
        const response = await dispatch(signIn(email, password));
        if (response.status === 'success') {
        } else if (response.type === 'not-found') {
          message.error('Wrong credentials');
        } else {
          message.error('Try again later!');
        }
      } else {
        message.error('Fill every field required');
      }
    } catch (errorInfo) {
      message.error('Try again later!');
    }
    handleSending(false);
  };

  return (
    <LoginUI login={login} sending={sending} form={form} />
  );
}

export default Login;
