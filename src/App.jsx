import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BankLoginPage from './components/BankLoginPage';
import VerifyIdentityPage from './components/VerifyIdentityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BankLoginPage />} />
        <Route path="/verify" element={<VerifyIdentityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

