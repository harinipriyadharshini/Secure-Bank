import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowRight, RotateCcw, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VerifyIdentityPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      console.log('OTP submitted:', otpCode);
      alert('OTP Verified Successfully! (This is just a frontend demo)');
      // Navigate to dashboard or home
      // navigate('/dashboard');
    } else {
      alert('Please enter complete 6-digit code');
    }
  };

  const handleResend = () => {
    console.log('Resend OTP clicked');
    alert('New OTP has been sent!');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
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
                <h1 className="text-2xl font-extrabold text-gray-800">Bank of India</h1>
                <p className="text-emerald-600 font-semibold text-sm">Relationship Digital Banking</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Secure Your<br />
              <span className="text-emerald-600">Identity Verification</span>
            </h2>
            <p className="text-gray-600 text-lg">
              We've sent a 6-digit code to your registered mobile number
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Secure Authentication</h3>
              <p className="text-sm text-gray-600">Two-factor protection</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
                <RotateCcw className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Quick & Easy</h3>
              <p className="text-sm text-gray-600">Verify in seconds</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-emerald-500">
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Identity</h3>
              <p className="text-gray-600">
                A secure code has been sent to your registered mobile number ending with ****XX
              </p>
            </div>

            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 text-center">
                  Enter Code
                </label>
                
                <div className="flex gap-2 justify-center mb-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Code expires in 10 minutes
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleResend}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-bold transition-colors hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resend Code?
                </button>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                SUBMIT
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm font-semibold text-gray-500">Having trouble?</span>
                </div>
              </div>

              <button
                onClick={() => alert('Contact support feature coming soon!')}
                className="w-full bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                CONTACT SUPPORT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}