'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';

import styles from './home.module.css';

// Get the API base URL from the environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API_BASE_URL}/auth/check-auth`, {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    const fetchRecentItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/items/recent`);
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
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
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

  // New function to handle user logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
      // Clear user state and redirect
      setIsLoggedIn(false);
      setUser(null);
      setShowProfilePopup(false);
      router.push('/Login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if logout fails on the server, we should clear client-side state
      setIsLoggedIn(false);
      setUser(null);
      setShowProfilePopup(false);
      router.push('/Login');
    }
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

      <main className={styles.mainContainer}>
        {/* Navigation Bar */}
        <nav className={styles.navbar}>
          <div className={styles.navContent}>
            <div className={styles.navLinks}>
              <Link
                href={isLoggedIn ? "/yourItems" : "#"}
                onClick={handleYourItemsClick}
                className={styles.yourItemsLink}
              >
                Your Items
              </Link>
              <button
                onClick={fetchUserProfile}
                className={styles.profileButton}
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
              <div className={styles.profilePopup}>
                <div className={styles.profilePopupHeader}>
                  <button onClick={() => setShowProfilePopup(false)} className={styles.closeButton}>
                    <X size={16} />
                  </button>
                </div>
                {profileLoading ? (
                  <div className={styles.loadingContainer}>
                    <Loader2 className="animate-spin text-teal-600" size={20} />
                  </div>
                ) : profileError ? (
                  <div className={styles.errorText}>{profileError}</div>
                ) : (
                  <div className={styles.profileContent}>
                    <div>
                      <p className={styles.profileLabel}>Name</p>
                      <p className={styles.profileText}>{user?.name}</p>
                    </div>
                    <div>
                      <p className={styles.profileLabel}>Email</p>
                      <p className={styles.profileText}>{user?.email}</p>
                    </div>
                    {/* Add a logout button here */}
                    <button onClick={handleLogout} className={styles.logoutButton}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className={styles.heroSection}
          style={{
            backgroundImage:
              "url('https://t4.ftcdn.net/jpg/05/37/05/15/360_F_537051575_QMgTmcn9DVgwzPdboJHx6fqSge02BRzM.jpg')",
          }}
        >
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} ${styles.animateFadeInUp}`}>
              Find it. Report it. Recover it.
            </h1>
            <p className={`${styles.heroSubtitle} ${styles.animateFadeInUp}`}>
              The smart way to reunite lost items with their owners at Bullwork Mobility.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/Lost" className={`${styles.lostButton} ${styles.heroButton}`}>
                🔍 Lost Something?
              </Link>
              <Link href="/Found" className={`${styles.foundButton} ${styles.heroButton}`}>
                ✋ Found an Item?
              </Link>
              <Link href="/Browse" className={`${styles.browseButton} ${styles.heroButton}`}>
                📦 Browse Items
              </Link>
            </div>
          </div>
        </section>

        {/* Recently Added Items */}
        <section className={styles.recentItemsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recently Added Items</h2>
              <div className={styles.headerLinks}>
                <Link href="/Browse" className={styles.seeMoreLink}>
                  See More
                </Link>
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingItems}>
                <Loader2 className="animate-spin text-teal-600" size={40} />
              </div>
            ) : error ? (
              <div className={styles.errorItems}>
                {error}
              </div>
            ) : recentItems.length === 0 ? (
              <p className={styles.noItemsText}>No items have been posted yet.</p>
            ) : (
              <div className={styles.recentItemsGrid}>
                {recentItems.slice(0, 5).map((item, index) => (
                  <div
                    key={item._id || item.id || index}
                    className={styles.itemCard}
                  >
                    <img
                      src={
                        item.imageURL
                          ? `${API_BASE_URL.replace('/api', '')}${item.imageURL}`
                          : `https://placehold.co/400x300/${
                              item.itemType === 'lost' ? 'FCA5A5' : '99F6E4'
                            }/${item.itemType === 'lost' ? 'ffffff' : '333'}?text=${
                              item.itemName
                            }`
                      }
                      alt={item.itemName}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemOverlay}>
                      <h3 className={styles.itemTitle}>{item.itemName}</h3>
                      <p className={styles.itemDescription}>{item.description}</p>
                      <div className={styles.itemDetails}>
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
                      className={`${styles.itemTypeBadge} ${
                        item.itemType === 'lost' ? styles.lostBadge : styles.foundBadge
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
        <section className={styles.howItWorksSection}>
          <div className={styles.container}>
            <h2 className={styles.howItWorksTitle}>How It Works</h2>
            <div className={styles.howItWorksGrid}>
              <div className={styles.howItWorksCard}>
                <div className={styles.howItWorksIcon}>📝</div>
                <h3 className={styles.howItWorksCardTitle}>
                  Report an Item
                </h3>
                <p className={styles.howItWorksCardText}>
                  If you've lost or found something, simply fill out a quick form
                  with a description and a photo.
                </p>
              </div>
              <div className={styles.howItWorksCard}>
                <div className={styles.howItWorksIcon}>🔎</div>
                <h3 className={styles.howItWorksCardTitle}>
                  Instant Matching
                </h3>
                <p className={styles.howItWorksCardText}>
                  Our intelligent system will automatically match lost and found
                  items in our database.
                </p>
              </div>
              <div className={styles.howItWorksCard}>
                <div className={styles.howItWorksIcon}>🤝</div>
                <h3 className={styles.howItWorksCardTitle}>
                  Get Reunited
                </h3>
                <p className={styles.howItWorksCardText}>
                  We'll notify you when a match is found and tell you how to get
                  your item back.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className={styles.contactSection}>
          <div className={styles.container}>
            <h2 className={styles.contactTitle}>
              Need Help?
            </h2>
            <p className={styles.contactSubtitle}>
              If you have questions or need assistance, our support team is here to
              help.
            </p>
            <a
              href="mailto:findit.locateit.0305@gmail.com"
              className={styles.contactButton}
            >
              Contact Support
            </a>
          </div>
        </section>
      </main>
    </>
  );
}