import LandingPage from './pages/LandingPage';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './slice/authSlice';
import { AppDispatch } from './store/store';



function App() {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch]);

  return (
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home/*' element={<HomePage />} />
        </Routes>
      </Router>
  );
}

export default App;
