import React from 'react';
import { HomePage } from './pages/HomePage';
import { NavBar } from './component/NavBar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


function App() {
  return (
    <div>
      <NavBar />
      <div className='mt-16'>
      <HomePage />
      </div>
      
    </div>
  );
}

export default App;
