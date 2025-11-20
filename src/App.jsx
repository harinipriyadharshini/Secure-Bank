import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import VerifyIdentityPage from "./components/VerifyIdentityPage";
import HomePage from "./components/HomePage";
import HelpPage from "./components/HelpPage";
import TransferMoneyPage from "./components/TransferMoneyPage";
import ManageCardsPage from "./components/ManageCardsPage";
import StatementsPage from "./components/StatementsPage";
import AccountSettingsPage from "./components/AccountSettingsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const protectedPages = new Set([
    "home",
    "help",
    "transfer",
    "cards",
    "statements",
    "settings",
  ]);

  const handleNavigate = (page) => {
    if (!isAuthenticated && protectedPages.has(page)) {
      setCurrentPage("login");
      return;
    }

    setCurrentPage(page);
  };

  const handleVerified = () => {
    setIsAuthenticated(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("login");
  };

  return (
    <>
      {currentPage === "login" && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === "register" && (
        <RegisterPage onNavigate={handleNavigate} />
      )}
      {currentPage === "verify" && (
        <VerifyIdentityPage
          onNavigate={handleNavigate}
          onVerified={handleVerified}
        />
      )}
      {currentPage === "home" && (
        <HomePage onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentPage === "help" && (
        <HelpPage onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentPage === "transfer" && (
        <TransferMoneyPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "cards" && (
        <ManageCardsPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "statements" && (
        <StatementsPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "settings" && (
        <AccountSettingsPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

