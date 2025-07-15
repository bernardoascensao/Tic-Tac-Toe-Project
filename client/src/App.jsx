import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import React from 'react';

const App = () => {
  return (
    <div className='App min-h-screen flex flex-col'>
      <Router>
        <main className='flex-grow'>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
