'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import styles from './browse.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Corrected value to 3 to match the desired behavior
const ITEMS_PER_LOAD = 3; 

export default function BrowseItemsPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const fetchItems = async (skip, take, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/items`, {
        params: {
          skip: skip,
          take: take,
        },
      });

      const { items, totalItemsCount: newTotalCount } = response.data;
      
      setAllItems(prevItems => [...prevItems, ...items]);
      setTotalItemsCount(newTotalCount);

      if ((skip + items.length) >= newTotalCount) {
        setHasMore(false);
      }

    } catch (err) {
      console.error('Failed to fetch items:', err);
      setError(err.response?.data?.error || 'Failed to load items. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchItems(0, ITEMS_PER_LOAD, true);
  }, []);

  const handleLoadMore = () => {
    const currentLoadedCount = allItems.length;
    fetchItems(currentLoadedCount, ITEMS_PER_LOAD);
  };
  
  const handleFilterChange = (type) => {
      setFilterType(type);
      setSearchTerm('');
  };

  const filteredItems = useMemo(() => {
    const allUniqueItems = [...new Map(allItems.map(item => [item.id, item])).values()];
    
    return allUniqueItems.filter(item => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || item.itemType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [allItems, searchTerm, filterType]);

  if (loading && allItems.length === 0) {
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
        <title>Browse Items - Bullwork Finder</title>
        <meta name="description" content="Browse all lost and found items posted by employees." />
      </Head>
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Browse All Items</h1>
            <Link href="/Home" className={styles.backButton}>
              Back to Home
            </Link>
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.searchInput}>
              <input
                type="text"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.filterButtons}>
              <button
                onClick={() => handleFilterChange('all')}
                className={`${styles.filterButton} ${filterType === 'all' ? styles.activeAll : ''}`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('lost')}
                className={`${styles.filterButton} ${filterType === 'lost' ? styles.activeLost : ''}`}
              >
                Lost
              </button>
              <button
                onClick={() => handleFilterChange('found')}
                className={`${styles.filterButton} ${filterType === 'found' ? styles.activeFound : ''}`}
              >
                Found
              </button>
            </div>
          </div>
          <div className={styles.itemsGrid}>
            {filteredItems.length === 0 && !loadingMore ? (
              <p className={styles.noItemsText}>No items match your search or filter criteria.</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.imageWrapper}>
                   <img
                    src={item.imageURL ? `${API_BASE_URL.replace('/api', '')}${item.imageURL}` : `https://placehold.co/400x300/${item.itemType === 'lost' ? 'FCA5A5' : '99F6E4'}/${item.itemType === 'lost' ? 'ffffff' : '333'}?text=${item.itemName}`} 
                    alt={item.itemName} 
                    className={styles.itemImage}
                  />
                    <div className={`${styles.itemBadge} ${item.itemType === 'lost' ? styles.lostBadge : styles.foundBadge}`}>
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
                        <span>{item.postedBy.name}</span>
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

          {hasMore && !searchTerm && !loadingMore && (
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

          {!hasMore && !searchTerm && (
              <p className={styles.noMoreItems}>You've reached the end of the list! 🎉</p>
          )}

        </div>
      </main>
    </>
  );
}