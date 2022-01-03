import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectUser} from './redux/slices/user';
import Dashboard from './pages/dashboard/Main';
import Login from './pages/login/Main';

const App = () => {
  const user = useSelector(selectUser);
  return (
    <Router>
      <Routes>
        <Route path="/*" element={user ? <Dashboard /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
