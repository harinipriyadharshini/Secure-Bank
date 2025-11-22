import React, { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Star,
} from "lucide-react";

const cards = [
  {
    id: "credit",
    type: "Credit Card",
    network: "VISA Platinum",
    number: "5423 11•• ••56 4521",
    limit: "₹2,00,000",
    available: "₹1,20,500",
    expiry: "08/29",
    cvv: "563",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    id: "debit",
    type: "Debit Card",
    network: "RuPay Select",
    number: "4210 88•• ••36 9876",
    limit: "₹50,000",
    available: "₹42,180",
    expiry: "12/27",
    cvv: "129",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function ManageCardsPage({ onNavigate, onLogout }) {
  const [showCvv, setShowCvv] = useState({});

  const toggleCvv = (cardId) => {
    setShowCvv((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
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
                Card Management Center <Lock className="w-4 h-4" />
              </p>
              <h1 className="text-2xl font-bold text-gray-800">
                Manage Cards
              </h1>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow hover:shadow-md">
            Apply for New Card
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 space-y-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow-lg space-y-6"
              >
                <div
                  className={`rounded-2xl p-6 text-white bg-gradient-to-r ${card.gradient} shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm uppercase tracking-widest opacity-80">
                      {card.type}
                    </p>
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <p className="text-2xl font-mono tracking-[0.2em] mb-6">
                    {card.number}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="uppercase opacity-80">Expiry</p>
                      <p className="text-lg font-semibold">{card.expiry}</p>
                    </div>
                    <div>
                      <p className="uppercase opacity-80">CVV</p>
                      <button
                        onClick={() => toggleCvv(card.id)}
                        className="flex items-center gap-2 font-semibold"
                      >
                        {showCvv[card.id] ? card.cvv : "***"}
                        {showCvv[card.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                    <p className="text-sm text-gray-600">Card Limit</p>
                    <p className="text-xl font-bold text-gray-800">
                      {card.limit}
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <p className="text-sm text-gray-600">Available Limit</p>
                    <p className="text-xl font-bold text-gray-800">
                      {card.available}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <p className="text-sm text-gray-600">Rewards Earned</p>
                    <p className="text-xl font-bold text-gray-800">
                      3,245 pts
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="flex-1 min-w-[160px] bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl shadow">
                    Set Spending Limit
                  </button>
                  <button className="flex-1 min-w-[160px] bg-white border-2 border-teal-200 text-teal-600 font-semibold py-3 rounded-xl">
                    View Statements
                  </button>
                  <button className="flex-1 min-w-[160px] bg-red-50 border-2 border-red-200 text-red-600 font-semibold py-3 rounded-xl">
                    Block Card
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-teal-100 shadow">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-500 font-semibold">
                    Security
                  </p>
                  <h3 className="text-lg font-bold text-gray-800">
                    Smart Controls
                  </h3>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mt-2" />
                  Enable/disable online, POS, and international usage
                  instantly.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mt-2" />
                  Real-time spend alerts on the mobile app & email.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mt-2" />
                  Dynamic CVV for safer online transactions (beta).
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-orange-100 shadow flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-orange-500 font-semibold">
                    Offers
                  </p>
                  <h3 className="text-lg font-bold text-gray-800">
                    Super Saver
                  </h3>
                </div>
              </div>
              <p className="text-gray-600">
                Unlock up to 5% cashback on dining & travel with the new BOI
                Signature Credit Card.
              </p>
              <button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 rounded-xl shadow">
                Explore Offers
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

