import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SalonProvider } from './context/SalonContext';
import '../css/style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SalonProvider>
      <App />
    </SalonProvider>
  </React.StrictMode>
);
