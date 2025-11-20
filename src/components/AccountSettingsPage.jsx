import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  KeyRound,
  Lock,
  Shield,
  Smartphone,
} from "lucide-react";
import Sidebar from "./common/Sidebar";

export default function AccountSettingsPage({ onNavigate, onLogout }) {
  const [profile, setProfile] = useState({
    fullName: "Heramb Pawar",
    email: "heramb.pawar@securebank.com",
    phone: "9876543210",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    monthlyDigest: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: true,
    loginAlerts: true,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSecurity = (key) => {
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <Sidebar active="settings" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          <header className="flex items-center justify-between bg-white rounded-2xl p-6 border-2 border-teal-100 shadow-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("home")}
                className="w-12 h-12 rounded-2xl bg-teal-50 hover:bg-teal-100 flex items-center justify-center text-teal-600 transition"
              >
                <ArrowLeft />
              </button>
              <div>
                <p className="text-sm font-semibold text-teal-600 flex items-center gap-2">
                  Secure Profile Settings <Lock className="w-4 h-4" />
                </p>
                <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow">
              Save Changes
            </button>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Information</h2>
              {[
                { label: "Full Name", name: "fullName", type: "text" },
                { label: "Email Address", name: "email", type: "email" },
                { label: "Phone Number", name: "phone", type: "tel" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-semibold text-gray-600">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 mt-1"
                  />
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Change Password</h2>
              <div className="grid grid-cols-1 gap-4">
                {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                  <div key={label}>
                    <label className="text-sm font-semibold text-gray-600">{label}</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 mt-1"
                      placeholder="********"
                    />
                  </div>
                ))}
              </div>
              <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl">
                Update Password
              </button>
            </section>

            <section className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-bold text-gray-800">Notification Preferences</h2>
              </div>
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-sm text-gray-500">Real-time updates and alerts</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(key)}
                    className={`w-14 h-8 rounded-full transition ${
                      value ? "bg-teal-500" : "bg-gray-300"
                    } relative`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition ${
                        value ? "translate-x-6" : ""
                      }`}
                    ></span>
                  </button>
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Security</h2>
              </div>
              {[
                { key: "twoFactor", label: "2-Factor Authentication", icon: KeyRound },
                { key: "biometric", label: "Biometric Login", icon: Smartphone },
                { key: "loginAlerts", label: "Login Alerts", icon: Bell },
              ].map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center justify-between border border-teal-100 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-semibold text-gray-800">{label}</p>
                      <p className="text-sm text-gray-500">Recommended</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSecurity(key)}
                    className={`w-14 h-8 rounded-full transition ${
                      security[key] ? "bg-emerald-500" : "bg-gray-300"
                    } relative`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition ${
                        security[key] ? "translate-x-6" : ""
                      }`}
                    ></span>
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                Account protected with the latest BOI SecureShield
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

