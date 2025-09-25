'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, MoveLeft } from 'lucide-react';

// A simple component for OTP input, now defined inside OtpPage for simplicity
const OtpInput = ({ onChange, onComplete }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = Array(6).fill(0).map(i => React.createRef());

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);

    // Focus on the next input field if a digit is entered
    if (element.value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // If backspace is pressed and the current input is empty, focus on the previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  useEffect(() => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      onComplete(fullOtp);
    }
  }, [otp, onComplete]);

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((data, index) => (
        <input
          key={index}
          className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
          type="text"
          maxLength="1"
          value={data}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onFocus={e => e.target.select()}
          ref={inputRefs[index]}
        />
      ))}
    </div>
  );
};

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [otpValue, setOtpValue] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/Login');
    }
  }, [email, router]);

  const handleOtpChange = (newOtp) => {
    setOtpValue(newOtp);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpValue }),
        credentials: 'include'
      });
      
      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'OTP verification failed.' });
        return;
      }

      setMessage({ type: 'success', text: data.message || 'Verification successful! Redirecting...' });
      
      setTimeout(() => router.push('/Home'), 1000); 

    } catch (error) {
      setLoading(false);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <Link href="/Login" className="flex items-center gap-2 text-indigo-600 hover:underline mb-4 cursor-pointer">
          <MoveLeft size={16} /> Back
        </Link>
        <h2 className="text-2xl font-bold text-center text-gray-800">Verify OTP</h2>
        <p className="text-center text-sm text-gray-600">
          An OTP has been sent to **{email}**.
        </p>
        {message && (
          <div className={`flex items-center gap-2 p-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-md`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}
        <div className="flex flex-col items-center space-y-4">
          <OtpInput onComplete={handleOtpChange} />
          <button onClick={handleVerifyOtp} disabled={loading || otpValue.length !== 6} className="w-full py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
            {loading ? 'Verifying...' : 'Verify & Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
