import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Link } from "react-router-dom";
import AuthSwitchButton from './components/AuthSwitchButton.jsx';
import { UserProvider } from './components/UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <AuthSwitchButton />
      <App />
    </UserProvider>
  </BrowserRouter>
)
