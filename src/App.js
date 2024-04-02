import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import Header from './component/Header';
import TableUsers from './component/TableUsers';
import Home from './component/Home';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="app-container">
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<TableUsers />} />
          </Routes>
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
