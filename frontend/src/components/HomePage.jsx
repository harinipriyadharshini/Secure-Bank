import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Lock, ArrowLeft, Mic } from "lucide-react";

export default function HomePage({ onNavigate, onLogout }) {
  const chartData = [
    { month: "April", Income: 22, Expenditure: 7 },
    { month: "May", Income: 30, Expenditure: 13 },
    { month: "June", Income: 20, Expenditure: 25 },
    { month: "July", Income: 38, Expenditure: 10 },
  ];

  const transactions = [
    {
      id: 1,
      name: "Grocery Shopping",
      amount: "-₹2,500",
      date: "Nov 15, 2025",
      type: "debit",
    },
    {
      id: 2,
      name: "Salary Credited",
      amount: "+₹50,000",
      date: "Nov 1, 2025",
      type: "credit",
    },
    {
      id: 3,
      name: "Electricity Bill",
      amount: "-₹1,200",
      date: "Oct 28, 2025",
      type: "debit",
    },
    {
      id: 4,
      name: "Restaurant",
      amount: "-₹850",
      date: "Oct 25, 2025",
      type: "debit",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("transfer")}
                className="w-12 h-12 rounded-2xl bg-teal-50 hover:bg-teal-100 flex items-center justify-center text-teal-600 transition"
              >
                <ArrowLeft />
              </button>
              <div>
                <p className="text-sm text-teal-600 font-semibold">
                  Welcome back, Heramb Pawar
                </p>
                <h1 className="text-3xl font-bold text-gray-800">
                  Smart Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>

              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_of_India_Logo.svg/2560px-Bank_of_India_Logo.svg.png"
                alt="Bank of India"
                className="h-12"
              />
            </div>
          </div>
          <p className="text-gray-600">
            Track balances, analyze spending, and launch quick actions across
            your Bank of India accounts.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Transfer Money", action: "transfer" },
              { label: "Manage Cards", action: "cards" },
              { label: "View Statements", action: "statements" },
              { label: "Help & Support", action: "help" },
            ].map((item) => (
              <button
                key={item.action}
                onClick={() => onNavigate(item.action)}
                className="bg-white border-2 border-teal-100 rounded-2xl py-4 px-2 text-sm font-semibold text-gray-700 shadow hover:shadow-md transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Total Balance */}
          <div className="bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-lg mb-3 font-medium opacity-90">
              Total Balance
            </h3>
            <p className="text-5xl font-bold mb-2">₹75,420</p>
            <p className="text-sm opacity-80">+5.2% from last month</p>
          </div>

          {/* Smaller cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-teal-100">
              <p className="text-sm mb-2 text-gray-600 font-semibold">
                Savings Account
              </p>
              <p className="text-3xl font-bold text-gray-800">₹50,000</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-5 text-white shadow-lg">
                <p className="text-xs mb-2 opacity-90">Income</p>
                <p className="text-2xl font-bold">₹55,000</p>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
                <p className="text-xs mb-2 opacity-90">Expenditure</p>
                <p className="text-2xl font-bold">₹29,580</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Income vs Expenditure
          </h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded"></div>
              <span className="text-gray-700 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-200 rounded"></div>
              <span className="text-gray-700 font-medium">Expenditure</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Bar dataKey="Income" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              <Bar
                dataKey="Expenditure"
                fill="#99f6e4"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Transactions
          </h3>

          <div className="space-y-3">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-800">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.date}</p>
                </div>
                <p
                  className={`text-xl font-bold ${
                    t.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.amount}
                </p>
              </div>
            ))}

            <button
              onClick={() => onNavigate("statements")}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition shadow-md"
            >
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}