import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>
);
