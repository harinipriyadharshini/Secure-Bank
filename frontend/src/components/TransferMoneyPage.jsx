import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  PhoneCall,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

const recentBeneficiaries = [
  { id: 1, name: "Ananya Sharma", bank: "BOI - 3256", lastAmount: "₹15,000" },
  { id: 2, name: "Rahul Verma", bank: "SBI - 8742", lastAmount: "₹8,200" },
  { id: 3, name: "PayTM Wallet", bank: "UPI - paytm@upi", lastAmount: "₹2,999" },
];

const accountOptions = [
  { id: "savings", label: "Savings Account - ****7890" },
  { id: "current", label: "Current Account - ****1456" },
  { id: "nri", label: "NRE Account - ****2020" },
];

export default function TransferMoneyPage({ onNavigate, onLogout }) {
  const [formData, setFormData] = useState({
    payeeName: "",
    accountNumber: "",
    ifsc: "",
    amount: "",
    note: "",
    accountType: accountOptions[0].id,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.payeeName.trim())
      newErrors.payeeName = "Beneficiary name is required.";
    if (!/^\d{9,18}$/.test(formData.accountNumber))
      newErrors.accountNumber = "Enter a valid account number (9-18 digits).";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc.trim().toUpperCase()))
      newErrors.ifsc = "Enter a valid IFSC code.";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Enter a valid amount.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 1200);
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setFormData((prev) => ({
      ...prev,
      payeeName: beneficiary.name,
      accountNumber: beneficiary.bank.replace(/\D/g, "").slice(-10),
      note: `Last transfer ${beneficiary.lastAmount}`,
    }));
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
                Secure Transfer <Lock className="w-4 h-4" />
              </p>
              <h1 className="text-2xl font-bold text-gray-800">
                Transfer Money
              </h1>
            </div>
          </div>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_of_India_Logo.svg/2560px-Bank_of_India_Logo.svg.png"
            alt="Bank of India"
            className="h-12"
          />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 bg-white rounded-2xl border-2 border-teal-100 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Quick NEFT/IMPS/UPI</p>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Transfer Details
                </h2>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                Instant
              </span>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  name="payeeName"
                  value={formData.payeeName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-teal-500 ${
                    errors.payeeName ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="Enter the beneficiary name"
                />
                {errors.payeeName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.payeeName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-teal-500 ${
                      errors.accountNumber
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                    placeholder="e.g. 503001112233"
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 uppercase bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-teal-500 ${
                      errors.ifsc ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="BKID0001234"
                  />
                  {errors.ifsc && (
                    <p className="text-red-500 text-xs mt-1">{errors.ifsc}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-teal-500 ${
                      errors.amount ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Enter amount"
                    min="1"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.amount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From Account
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  >
                    {accountOptions.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Purpose of transfer, e.g. Rent for November"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  className="flex items-center gap-2 text-teal-600 font-semibold hover:underline"
                >
                  <UserPlus className="w-4 h-4" />
                  Add new beneficiary
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 text-emerald-600 font-semibold hover:underline"
                >
                  <PhoneCall className="w-4 h-4" />
                  Need help?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Transfer Securely"}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </section>

          <section className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-teal-100 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-600">
                    Bank of India Secure
                  </p>
                  <h3 className="text-xl font-bold text-gray-800">
                    Quick Beneficiaries
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentBeneficiaries.map((beneficiary) => (
                  <button
                    key={beneficiary.id}
                    className="w-full text-left bg-teal-50 hover:bg-teal-100 p-4 rounded-xl transition border border-teal-100"
                    onClick={() => handleBeneficiarySelect(beneficiary)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {beneficiary.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {beneficiary.bank}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-teal-600">
                        {beneficiary.lastAmount}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-orange-100 p-6 shadow-lg">
              <p className="text-sm font-semibold text-orange-500 mb-2">
                Tip
              </p>
              <p className="text-gray-700">
                Transactions above ₹2,00,000 require additional verification.
                Ensure beneficiary details are correct before confirming.
              </p>
            </div>
          </section>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-2 border-emerald-200 shadow-2xl text-center">
            <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Transfer Scheduled
            </h3>
            <p className="text-gray-600 mb-6">
              Your transfer of {formData.amount ? `₹${formData.amount}` : "₹0"}{" "}
              to {formData.payeeName || "beneficiary"} is being processed
              securely.
            </p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

