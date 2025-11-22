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
import VoiceAssistant from "./components/common/VoiceAssistant";
import Sidebar from "./components/common/Sidebar";
import FloatingVoiceButton from "./components/common/FloatingVoiceButton";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

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

  const handleToggleVoiceAssistant = () => {
    setShowVoiceAssistant((prev) => !prev);
  };

  const renderPage = () => {
    const pageProps = {
      onNavigate: handleNavigate,
      onLogout: handleLogout,
    };

    switch (currentPage) {
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "verify":
        return (
          <VerifyIdentityPage
            onNavigate={handleNavigate}
            onVerified={handleVerified}
          />
        );
      case "home":
        return <HomePage {...pageProps} />;
      case "help":
        return <HelpPage {...pageProps} />;
      case "transfer":
        return <TransferMoneyPage {...pageProps} />;
      case "cards":
        return <ManageCardsPage {...pageProps} />;
      case "statements":
        return <StatementsPage {...pageProps} />;
      case "settings":
        return <AccountSettingsPage {...pageProps} />;
      default:
        return <LoginPage onNavigate={handleNavigate} />;
    }
  };

  const showSidebar = isAuthenticated && protectedPages.has(currentPage);

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      {showSidebar && (
        <Sidebar
          active={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      <div className="flex-1 overflow-y-auto">{renderPage()}</div>
      {isAuthenticated && (
        <FloatingVoiceButton onClick={handleToggleVoiceAssistant} />
      )}
      <VoiceAssistant
        show={showVoiceAssistant}
        onClose={() => setShowVoiceAssistant(false)}
      />
    </div>
  );
}

