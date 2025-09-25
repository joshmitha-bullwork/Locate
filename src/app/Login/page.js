'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const payload = isLogin
        ? { email: formData.email }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        showMessage(data.message || 'An error occurred.', 'error');
        return;
      }

      if (isLogin) {
        showMessage(data.message, 'success');
        router.push(`/Otp?email=${formData.email}`);
      } else {
        showMessage('Registration successful. Please log in to continue.', 'success');
        setIsLogin(true);
      }
    } catch (error) {
      setLoading(false);
      showMessage('Network error. Please try again.', 'error');
    }
  };

  const Message = ({ msg }) => msg ? (
    <div className={`p-4 rounded-lg text-sm transition-all duration-300 transform ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-md mb-4`}>
      {msg.text}
    </div>
  ) : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-3xl font-bold text-gray-800">
            Bullwork Finder
          </Link>
        </div>
        <Message msg={message} />
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </h2>
        <div className="flex bg-gray-200 p-1 rounded-full text-sm">
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage(null);
            }}
            className={`flex-1 py-2 rounded-full font-medium transition-colors duration-300 ${isLogin ? 'bg-teal-500 text-white shadow-md' : 'text-gray-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage(null);
            }}
            className={`flex-1 py-2 rounded-full font-medium transition-colors duration-300 ${!isLogin ? 'bg-teal-500 text-white shadow-md' : 'text-gray-600'}`}
          >
            Signup
          </button>
        </div>
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-teal-500 transition-colors" required />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-teal-500 transition-colors" required />
            </>
          )}
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-teal-500 transition-colors" required />
          <button type="submit" className="w-full py-2 px-4 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Not a member?" : "Already a member?"}{' '}
          <a onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
          }} className="text-teal-600 font-medium hover:underline cursor-pointer">
            {isLogin ? "Signup now" : "Login now"}
          </a>
        </p>
      </div>
    </div>
  );
}
