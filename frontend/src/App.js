import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";
import Content from './Content.js';
import LoginUser from './components/Users/LoginUser.jsx';
import SignUpUser from './components/Users/SignUpUser.jsx';
import ForgotPassword from './components/Users/ForgotPassword.jsx';


const App = () => {

    return (

        <div className='main-container'>

            <Router>
                <Routes>
                    <Route path='/account/login' element={<LoginUser />} />
                    <Route path='/account/signup' element={<SignUpUser />} />
                    <Route path='/account/password/forgot' element={<ForgotPassword />} />
                </Routes>

                <Content />
            </Router>

        </div>
    )
}

export default App;