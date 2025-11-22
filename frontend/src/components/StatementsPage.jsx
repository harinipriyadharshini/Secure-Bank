import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  Filter,
  Lock,
  Printer,
  Search,
  Table,
} from "lucide-react";

const transactions = [
  {
    id: "TXN1289",
    date: "20 Nov 2025",
    description: "Salary Credit",
    type: "Credit",
    amount: "+₹50,000",
  },
  {
    id: "TXN1290",
    date: "18 Nov 2025",
    description: "Amazon Purchase",
    type: "Debit",
    amount: "-₹4,250",
  },
  {
    id: "TXN1291",
    date: "16 Nov 2025",
    description: "Electricity Bill",
    type: "Debit",
    amount: "-₹1,320",
  },
  {
    id: "TXN1292",
    date: "14 Nov 2025",
    description: "Stock Dividend",
    type: "Credit",
    amount: "+₹3,400",
  },
  {
    id: "TXN1293",
    date: "10 Nov 2025",
    description: "Fuel Station",
    type: "Debit",
    amount: "-₹2,150",
  },
];

export default function StatementsPage({ onNavigate, onLogout }) {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "all",
    search: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
                Statement Center <Lock className="w-4 h-4" />
              </p>
              <h1 className="text-2xl font-bold text-gray-800">Statements</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-white border-2 border-teal-200 text-teal-600 font-semibold flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold flex items-center gap-2 shadow">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </header>

        <section className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-2 text-teal-600 font-semibold">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                From
              </label>
              <input
                type="date"
                name="from"
                value={filters.from}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">To</label>
              <input
                type="date"
                name="to"
                value={filters.to}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Transaction Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
              >
                <option value="all">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Narration, amount..."
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
          <button className="self-start px-4 py-2 rounded-xl bg-teal-50 text-teal-700 font-semibold">
            Apply Filters
          </button>
        </section>

        <section className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Table className="w-4 h-4" />
              Statement Summary
            </div>
            <p className="text-sm text-gray-500">
              Showing {transactions.length} records
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="py-3">Txn ID</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Type</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-teal-50/50">
                    <td className="py-3 font-semibold text-gray-800">
                      {txn.id}
                    </td>
                    <td className="py-3 text-gray-600">{txn.date}</td>
                    <td className="py-3 text-gray-700">{txn.description}</td>
                    <td className="py-3 font-semibold text-gray-600">
                      {txn.type}
                    </td>
                    <td
                      className={`py-3 text-right font-bold ${
                        txn.amount.includes("+")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {txn.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

