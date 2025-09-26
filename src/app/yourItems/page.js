'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

import styles from './items.module.css';

// Use the environment variable for the base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_LOAD = 3;

export default function MyItemsPage() {
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const router = useRouter();

  const fetchUserItems = async (skip, take, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/items/my-items`,
        {
          withCredentials: true,
          params: {
            skip: skip,
            take: take
          }
        }
      );

      const { items, totalItemsCount: newTotalCount } = response.data;
      
      // FIX: Use a functional state update to safely deduplicate the list
      setUserItems(prevItems => {
        const allItems = [...prevItems, ...items];
        
        // Use findIndex to get a new array with only unique items
        const uniqueItems = allItems.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.id === value.id
          ))
        );
        
        return uniqueItems;
      });

      setTotalItemsCount(newTotalCount);

      if ((skip + items.length) >= newTotalCount) {
        setHasMore(false);
      }

    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push('/Home');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUserItems(0, ITEMS_PER_LOAD, true);
  }, [router]);

  const handleLoadMore = () => {
    const currentLoadedCount = userItems.length;
    fetchUserItems(currentLoadedCount, ITEMS_PER_LOAD);
  };

  if (loading && userItems.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.loadingContainer} ${styles.errorText}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Your Items - Bullwork Finder</title>
        <meta
          name="description"
          content="View the lost and found items you have posted."
        />
      </Head>

      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Your Posted Items</h1>
            <Link
              href="/Home"
              className={styles.backButton}
            >
              Back to Home
            </Link>
          </div>

          <div className={styles.itemsGrid}>
            {userItems.length === 0 && !loadingMore ? (
              <p className={styles.noItemsText}>
                You have not posted any items yet.
              </p>
            ) : (
              userItems.map((item, index) => (
                <div
                  // The key is now guaranteed to be unique
                  key={item.id}
                  className={styles.itemCard}
                >
                  <div className={styles.imageWrapper}>
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
                    <div
                      className={`${styles.itemBadge} ${
                        item.itemType === 'lost' ? styles.lostBadge : styles.foundBadge
                      }`}
                    >
                      {item.itemType === 'lost' ? 'Lost Item' : 'Found Item'}
                    </div>
                  </div>
                  <div className={styles.itemContent}>
                    <h3 className={styles.itemTitle}>{item.itemName}</h3>
                    <p className={styles.itemDescription}>{item.description}</p>

                    <div className={styles.itemDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Location:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Posted by:</span>
                        <span>{item.postedBy?.name}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Posted on:</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {loadingMore && (
            <div className={styles.loadingMoreContainer}>
              <Loader2 className="animate-spin" size={30} />
            </div>
          )}

          {hasMore && !loadingMore && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={handleLoadMore}
                className={styles.loadMoreButton}
                disabled={loadingMore}
              >
                Load More
              </button>
            </div>
          )}

          {!hasMore && (
              <p className={styles.noMoreItems}>You've reached the end of your posted items! 🎉</p>
          )}

        </div>
      </main>
    </>
  );
}