import { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import Header from './components/Header';
import { UserContext } from './context/UserContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dataUserRedux = useSelector((state) => state.user.account);

  const { user, loginContext } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      loginContext(localStorage.getItem('email'), localStorage.getItem('token'));
    }
  }, []);

  return (
    <>
      <div className="app-container">
        <Header />
        <Container>
          <AppRoutes />
        </Container>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
