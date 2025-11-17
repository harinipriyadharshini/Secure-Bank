// BankLoginPage.jsx - Copy this ENTIRE file to src/components/BankLoginPage.jsx

import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Shield, Mic, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BankLoginPage() {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (accountNumber && password) {
      console.log('Login attempt:', { accountNumber, password });
      navigate('/verify');
    } else {
      alert('Please enter both account number and password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    alert('Forgot password feature coming soon!');
  };

  const handleNewUser = () => {
    console.log('New user registration clicked');
    alert('Registration page coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-8">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        <div className="flex-1 text-center lg:text-left space-y-10">
          
          <div className="bg-white rounded-3xl p-8 shadow-xl inline-block border-4 border-emerald-500">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center transform rotate-6">
                  <CreditCard className="w-8 h-8 text-white transform -rotate-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800">SecureBank</h1>
                <p className="text-emerald-600 font-semibold text-sm">Your Trusted Partner</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Banking Made<br />
              <span className="text-emerald-600">Simple & Secure</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Secure</h3>
              <p className="text-sm text-gray-600">Bank-grade encryption</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
                <Mic className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Voice Assistant</h3>
              <p className="text-sm text-gray-600">Hands-free banking</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-cyan-100 hover:border-cyan-300 transition-all">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Easy to Use</h3>
              <p className="text-sm text-gray-600">Simple interface</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-emerald-500">
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h3>
              <p className="text-gray-600">Please login to your account</p>
            </div>

            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Account Number
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your account number"
                    className="w-full px-4 py-3.5 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 pl-12 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleForgotPassword}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-bold transition-colors hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                LOGIN
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm font-semibold text-gray-500">New to SecureBank?</span>
                </div>
              </div>

              <button
                onClick={handleNewUser}
                className="w-full bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}