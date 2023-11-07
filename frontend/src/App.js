import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
} from "react-router-dom";
import store from "./State/store.js";
import { getListItems, loadUser } from './State/action-creators/UserActionCreators.js';
import AccountRoutes from './AccountRoutes.js';
import ContentRoutes from './ContentRoutes.js';

const App = () => {

    useEffect(()=> {
        store.dispatch(loadUser());
        store.dispatch(getListItems());
    }, []);

    return (
        <div className='main-container'>
            <Router>
                <AccountRoutes />
                <ContentRoutes />
            </Router>
        </div>
    )
}

export default App;