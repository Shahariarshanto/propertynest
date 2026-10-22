import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
