import {useNavigate} from 'react-router-dom';
import LoginUI from './components/LoginUI';

const Login = () => {
  const navigate = useNavigate();

  const login = () => {
    navigate('/');
  };

  return (
    <LoginUI login={login} />
  );
}

export default Login;
