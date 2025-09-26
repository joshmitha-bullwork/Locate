'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import axios from 'axios'; // Import Axios
import styles from './login.module.css';

// Get the API URL from the environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: ''});
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
      const endpoint = isLogin ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;
      const payload = isLogin
        ? { email: formData.email }
        : formData;

      // Use axios.post instead of fetch
      const response = await axios.post(endpoint, payload, {
        withCredentials: true // Equivalent to credentials: 'include' in fetch
      });

      const data = response.data; // Axios wraps the response in a 'data' property
      setLoading(false);

      if (isLogin) {
        showMessage(data.message, 'success');
        router.push(`/Otp?email=${formData.email}`);
      } else {
        showMessage('Registration successful. Please log in to continue.', 'success');
        setIsLogin(true);
      }
    } catch (error) {
      setLoading(false);
      // Axios error handling is more robust; response data is on error.response
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
      showMessage(errorMessage, 'error');
    }
  };

  const Message = ({ msg }) => msg ? (
    <div className={`${styles.message} ${msg.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
      {msg.text}
    </div>
  ) : null;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            Finder
          </Link>
        </div>
        <Message msg={message} />
        <h2 className={styles.title}>
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </h2>
        <div className={styles.toggleButtons}>
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage(null);
            }}
            className={`${styles.toggleButton} ${isLogin ? styles.active : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage(null);
            }}
            className={`${styles.toggleButton} ${!isLogin ? styles.active : ''}`}
          >
            Signup
          </button>
        </div>
        <form onSubmit={handleAuthSubmit} className={styles.form}>
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className={styles.inputField} required />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className={styles.inputField} required />
            </>
          )}
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={styles.inputField} required />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <p className={styles.toggleText}>
          {isLogin ? "Not a member?" : "Already a member?"}{' '}
          <a onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
          }} className={styles.toggleLink}>
            {isLogin ? "Signup now" : "Login now"}
          </a>
        </p>
      </div>
    </div>
  );
}