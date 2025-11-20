import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Phone, Shield, User, Lock } from "lucide-react";

export default function RegisterPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem(
        "securebank:pendingUser",
        JSON.stringify({ name: formData.fullName, email: formData.email })
      );
      setIsSubmitting(false);
      onNavigate("verify");
    }, 1200);
  };

  const inputClasses = (hasError) =>
    `w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-teal-500 ${
      hasError ? "border-red-400" : "border-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-teal-100 p-10 relative">
        <button
          onClick={() => onNavigate("login")}
          className="absolute top-6 left-6 flex items-center gap-2 text-teal-600 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-teal-50 px-6 py-3 rounded-2xl border border-teal-200">
            <Shield className="w-6 h-6 text-emerald-600" />
            <p className="text-sm font-semibold text-teal-700">
              Create a secure Bank of India account
            </p>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mt-6">New User Registration</h1>
          <p className="text-gray-500 mt-2">Complete the form below to set up your digital banking profile.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Heramb Pawar"
                className={`${inputClasses(errors.fullName)} pl-10`}
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="heramb@example.com"
                className={`${inputClasses(errors.email)} pl-10`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                className={`${inputClasses(errors.phone)} pl-10`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="******"
                className={`${inputClasses(errors.password)} pl-10`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="******"
                className={`${inputClasses(errors.confirmPassword)} pl-10`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating profile..." : "Register & Verify"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already registered?{" "}
          <button
            className="text-teal-600 font-semibold hover:text-teal-700"
            onClick={() => onNavigate("login")}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
