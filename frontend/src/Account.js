import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import LoginUser from './components/Users/LoginUser';

const Account = () => {
    return (
        <Router>
            <Routes>
                <Route path='/account/login' element={<LoginUser />} />
            </Routes>
        </Router>
    )
}

export default Account
