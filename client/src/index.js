import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LoginRegister from './pages/loginRegister';
import Chat from "./pages/chat";
import User from "./pages/user";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthProvider from "./contexts/authContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/home" element={<Chat />} />
          <Route path="/user" element={<User />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
