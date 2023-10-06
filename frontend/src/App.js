import React from 'react';
import {
    BrowserRouter as Router,
} from "react-router-dom";
import Content from './Content.js';
import Account from './Account.js';

const App = () => {

    return (
        <div className='main-container'>
            <Router>
                <Account />
                <Content />
            </Router>
        </div>
    )
}

export default App;