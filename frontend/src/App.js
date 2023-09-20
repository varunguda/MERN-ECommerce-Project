import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import Footer from './components/layouts/Footer/Footer.jsx';
import Navbar from './components/layouts/Navbar/Navbar.jsx';
import Home from "./components/Home/Home.jsx";
import ProductPage from "./components/Product/ProductPage.jsx";
import { ToastContainer } from 'react-toastify';
import Modal from './components/elements/Modals/Modal.jsx';
import { useSelector } from 'react-redux';


const App = () => {

  const { open, content, heading } = useSelector((state) => state.modal);

  useEffect(()=>{
    if(open){
      document.body.style.overflow = "hidden"
    }
    else{
      document.body.style.overflow = "auto"
    }
  }, [open])

  return (

    <div className='main-container'>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Modal open={open} content={content} heading={heading} />

      <Router>
        <Navbar />
        <div className='content-container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/products/:id" element={<ProductPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  )
}

export default App;
