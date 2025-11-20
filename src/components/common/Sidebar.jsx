import React from "react";
import {
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Send,
  Settings,
} from "lucide-react";

const navConfig = [
  { key: "home", label: "Home", icon: Home },
  { key: "transfer", label: "Transfer Money", icon: Send },
  { key: "cards", label: "Cards", icon: CreditCard },
  { key: "statements", label: "Statements", icon: FileText },
  { key: "help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar({
  active = "home",
  onNavigate = () => {},
  onLogout = () => {},
  profileName = "Heramb Pawar",
  accountNumber = "****7890",
}) {
  const buttonClasses = (key) =>
    `w-full py-3 px-4 rounded-xl font-semibold transition flex items-center gap-3 ${
      key === active
        ? "bg-teal-500 text-white shadow-lg"
        : "bg-teal-50 hover:bg-teal-100 text-gray-700"
    }`;

  return (
    <aside className="w-72 bg-white border-r border-teal-100 p-6 flex flex-col shadow-lg">
      <div className="text-center mb-8">
        <div className="w-28 h-28 bg-teal-100 rounded-full mx-auto mb-4 overflow-hidden shadow-md border-4 border-teal-500">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Heramb"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{profileName}</h2>
        <p className="text-sm text-teal-600 mt-1">Account: {accountNumber}</p>
      </div>

      <nav className="flex-1 space-y-3">
        {navConfig.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={buttonClasses(key)}
            onClick={() => (key === active ? null : onNavigate(key))}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="space-y-3 mt-6">
        <button
          className={buttonClasses("settings")}
          onClick={() => onNavigate("settings")}
        >
          <Settings className="w-5 h-5" />
          Account Settings
        </button>

        <button
          className="w-full py-3 px-4 rounded-xl font-semibold bg-red-50 hover:bg-red-100 transition flex items-center gap-3 text-red-600"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

