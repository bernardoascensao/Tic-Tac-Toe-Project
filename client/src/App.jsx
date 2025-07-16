import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import React from 'react';
import 'stream-chat-react/dist/css/v2/index.css';

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
