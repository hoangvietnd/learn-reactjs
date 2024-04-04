import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import Header from './components/Header';
import { handleRefreshRedux } from './redux/actions/userAction';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(handleRefreshRedux());
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
