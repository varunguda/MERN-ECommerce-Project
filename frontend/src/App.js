import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import Footer from './components/layouts/Footer/Footer.jsx';
import Navbar from './components/layouts/Navbar/Navbar.jsx';
import Home from "./components/Home/Home.jsx";
import ProductsPage from "./components/Product/ProductsPage.jsx"; 
import ProductPage from "./components/Product/ProductPage.jsx";
import { ToastContainer } from 'react-toastify';
import Modal from './components/elements/Modals/Modal.jsx';
import { useSelector } from 'react-redux';
import NavigationComponent from './components/NavigationComponent.jsx';


const App = () => {

  const { open, content, heading, noOutClick } = useSelector((state) => state.modal);

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

      <Modal open={open} content={content} heading={heading} noOutClick={noOutClick} />


      <Router>
      <NavigationComponent />
        <Navbar />
        <div className='content-container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/products/" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  )
}

export default App;
