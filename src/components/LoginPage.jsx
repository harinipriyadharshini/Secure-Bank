import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!/^\d{6,20}$/.test(formData.accountNumber)) {
      setError('Please enter a valid account number');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('securebank:lastLogin', new Date().toISOString());
      setIsLoading(false);
      onNavigate('verify');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-8 items-center">
        <div className="flex-1 space-y-8">
          <div className="bg-white border-4 border-teal-500 rounded-3xl p-8 inline-block shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-teal-500 rounded-2xl p-4 relative">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-8 h-1 bg-teal-500 rounded"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">SecureBank</h1>
                <p className="text-teal-600 font-medium">Your Trusted Partner</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-gray-800 mb-2">Banking Made</h2>
            <h2 className="text-5xl font-bold text-teal-600">Simple & Secure</h2>
            <p className="text-gray-500 mt-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Bank of India | Relationship beyond banking
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Secure</h3>
              <p className="text-sm text-gray-600">Bank-grade encryption</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Voice Assistant</h3>
              <p className="text-sm text-gray-600">Hands-free banking</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Easy to Use</h3>
              <p className="text-sm text-gray-600">Simple interface</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-teal-500">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-8">Please login to your account</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your account number"
                    className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    required
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    required
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center font-semibold">{error}</p>
              )}

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => onNavigate('verify')}
                  className="text-teal-600 font-semibold hover:text-teal-700 transition"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'LOGIN'}
                <ArrowRight size={20} className={isLoading ? 'animate-pulse' : ''} />
              </button>

              <div className="text-center">

                <span className="text-gray-600">New User? </span>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-teal-600 font-semibold hover:text-teal-700 transition"
                >
                  Create Account
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Lock className="w-4 h-4 text-emerald-500" />
                256-bit encryption enabled
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
