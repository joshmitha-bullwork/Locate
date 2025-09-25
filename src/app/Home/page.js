'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for auth status
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on page load
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5000/api/auth/check-auth', {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    const fetchRecentItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items/recent');
        setRecentItems(response.data);
      } catch (err) {
        console.error('Failed to fetch recent items:', err);
        setError('Failed to load recent items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    fetchRecentItems();
  }, []);

  const handleYourItemsClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('You must be logged in to view your items.');
      router.push('/Login'); 
    }
  };

  const fetchUserProfile = async () => {
    if (!isLoggedIn) {
      alert('You must be logged in to view your profile.');
      router.push('/Login');
      return;
    }

    if (!showProfilePopup) {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setProfileError('Failed to load user data. Please log in again.');
        setUser(null);
      } finally {
        setProfileLoading(false);
      }
    }
    setShowProfilePopup(!showProfilePopup);
  };

  return (
    <>
      <Head>
        <title>Bullwork Finder</title>
        <meta
          name="description"
          content="The official internal Lost & Found app for Bullwork Mobility."
        />
      </Head>

      <main className="bg-gray-50 text-gray-900 min-h-screen">
        {/* Navigation Bar */}
        <nav className="fixed w-full z-20 top-0 left-0">
          <div className="container mx-auto flex justify-end items-center px-6 py-4 relative">
            <div className="flex items-center space-x-4">
              <Link
                href={isLoggedIn ? "/yourItems" : "#"}
                onClick={handleYourItemsClick}
                className="text-white hover:text-gray-300 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                Your Items
              </Link>
              <button
                onClick={fetchUserProfile}
                className="text-white hover:text-gray-300 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Pop-up */}
            {showProfilePopup && (
              <div className="absolute top-full right-4 mt-2 p-6 bg-white rounded-lg shadow-xl w-64 z-30">
                <div className="flex justify-end mb-2">
                  <button onClick={() => setShowProfilePopup(false)} className="text-gray-500 hover:text-gray-800">
                    <X size={20} />
                  </button>
                </div>
                {profileLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="animate-spin text-teal-600" size={24} />
                  </div>
                ) : profileError ? (
                  <div className="text-center text-red-500 py-4">{profileError}</div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">Name</p>
                      <p className="text-gray-800 text-lg">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">Email</p>
                      <p className="text-gray-800 text-lg">{user?.email}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="relative h-[70vh] flex items-center justify-center text-center p-4 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://t4.ftcdn.net/jpg/05/37/05/15/360_F_537051575_QMgTmcn9DVgwzPdboJHx6fqSge02BRzM.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-10 text-white">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-up">
              Find it. Report it. Recover it.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-gray-200 animate-fade-in-up delay-200">
              The smart way to reunite lost items with their owners at Bullwork Mobility.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/Lost"
                className="w-full sm:w-auto px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                🔍 Lost Something?
              </Link>
              <Link
                href="/Found"
                className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                ✋ Found an Item?
              </Link>
              <Link
                href="/Browse"
                className="w-full sm:w-auto px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                📦 Browse Items
              </Link>
            </div>
          </div>
        </section>

        {/* Recently Added Items */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Recently Added Items</h2>
              <div className="flex items-center">
                <Link href="/Browse" className="text-teal-600 hover:underline font-semibold">
                  See More
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="animate-spin text-teal-600" size={40} />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-[200px] text-red-500">
                {error}
              </div>
            ) : recentItems.length === 0 ? (
              <p className="text-center text-gray-500 italic">No items have been posted yet.</p>
            ) : (
              <div className="flex flex-wrap md:flex-nowrap gap-4 py-4 w-full justify-between overflow-x-auto">
                {recentItems.slice(0, 5).map((item, index) => (
                  <div
                    key={item._id || item.id || index}
                    className="group relative flex-none w-full md:w-1/5 h-64 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden border-t-4 border-gray-200"
                  >
                    <img
                      src={
                        item.imageURL
                          ? `http://localhost:5000${item.imageURL}`
                          : `https://placehold.co/400x300/${
                              item.itemType === 'lost' ? 'FCA5A5' : '99F6E4'
                            }/${item.itemType === 'lost' ? 'ffffff' : '333'}?text=${
                              item.itemName
                            }`
                      }
                      alt={item.itemName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-gradient-to-t from-black via-black/80 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl font-bold mb-1">{item.itemName}</h3>
                      <p className="text-sm line-clamp-2 mb-2">{item.description}</p>
                      <div className="text-xs text-gray-200">
                        <p>
                          <strong>Location:</strong> {item.location}
                        </p>
                        <p>
                          <strong>Posted by:</strong> {item.postedBy?.name}
                        </p>
                        <p>
                          <strong>Posted on:</strong>{' '}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md ${
                        item.itemType === 'lost' ? 'bg-red-500' : 'bg-teal-500'
                      }`}
                    >
                      {item.itemType === 'lost' ? 'Lost Item' : 'Found Item'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="text-6xl text-red-500 mb-4">📝</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Report an Item
                </h3>
                <p className="text-gray-600">
                  If you've lost or found something, simply fill out a quick form
                  with a description and a photo.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-6xl text-teal-500 mb-4">🔎</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Instant Matching
                </h3>
                <p className="text-gray-600">
                  Our intelligent system will automatically match lost and found
                  items in our database.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-6xl text-green-500 mb-4">🤝</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Get Reunited
                </h3>
                <p className="text-gray-600">
                  We'll notify you when a match is found and tell you how to get
                  your item back.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="py-20 bg-gray-50 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Need Help?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              If you have questions or need assistance, our support team is here to
              help.
            </p>
            <a
              href="mailto:support@bullworkmobility.com"
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105"
            >
              Contact Support
            </a>
          </div>
        </section>

        {/* Animations */}
        <style jsx global>{`
          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
          }
          .animate-fade-in-up.delay-200 {
            animation-delay: 0.2s;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </main>
    </>
  );
}