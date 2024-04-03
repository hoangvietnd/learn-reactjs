import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { loginApi } from '../services/UserService';

function Login(props) {
  let navigate = useNavigate();

  const { loginContext } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setisShowPassword] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Email/Password is required!');
      return;
    }
    setLoadingAPI(true);
    let res = await loginApi(email.trim(), password);
    if (res && res.token) {
      loginContext(email, res.token);
      navigate('/');
      toast.success('Log in success!');
    } else {
      // Error
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoadingAPI(false);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handlePressEnter = (event) => {
    if (event && event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Log in</div>
      <div className="text">Email or Username (eve.holt@reqres.in)</div>
      <input
        type="text"
        placeholder="Email or Username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <div className="input-password">
        <input
          type={isShowPassword === true ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => handlePressEnter(event)}
        />
        <i
          className={isShowPassword === true ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}
          onClick={() => setisShowPassword(!isShowPassword)}
        />
      </div>
      <button
        className={email && password ? 'btn-login active' : 'btn-login'}
        disabled={email && password ? false : true}
        onClick={() => handleLogin()}
      >
        {loadingAPI && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}&nbsp;Login
      </button>
      <div className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <span onClick={() => handleGoBack()}>&nbsp;Go back</span>
      </div>
    </div>
  );
}

export default Login;
