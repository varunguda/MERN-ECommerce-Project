import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import store from './State/store';
import { ModalProvider } from './Context/ModalContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <StrictMode>
        <ModalProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </ModalProvider>
    // </StrictMode>
);
