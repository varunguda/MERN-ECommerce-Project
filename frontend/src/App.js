import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom"

import Footer from './components/layouts/Footer/Footer.jsx';
import Navbar from './components/layouts/Navbar/Navbar.jsx';
import Home from "./components/layouts/Home/Home.jsx";

const App = () => {
  return (
    <div className='main-container'>
      <Router>
        <Navbar />
        <div className='content-container'>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  )
}

export default App;
