import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import store from './State/store';
import { ModalProvider } from './Context/ModalContext';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
        <ModalProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </ModalProvider>
    </QueryClientProvider>
);
