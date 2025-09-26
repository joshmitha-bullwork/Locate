'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import styles from './found.module.css';

// Get the API base URL from the environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReportFoundPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    contact: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('itemType', 'found');
      formDataToSend.append('itemName', formData.itemName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('contact', formData.contact);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await axios.post(`${API_BASE_URL}/items/found`, formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Your found item has been reported successfully! Thank you!');
        router.push('/Home');
      } else {
        throw new Error('Failed to submit found item.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Report Found Item - Bullwork Finder</title>
        <meta name="description" content="Report a found item at Bullwork Mobility." />
      </Head>
      
      <main className={styles.mainContainer}>
        {/* The Back button is now outside the formCard div */}
        <button onClick={handleBack} className={styles.backButton}>
          Back to Home
        </button>
        
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>Report a Found Item</h1>
          <p className={styles.formSubtitle}>
            Please fill out the form below with the details of the item you found.
          </p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="itemName" className={styles.label}>Item Name</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g., Red Coffee Mug, Car Keys"
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Found a red mug with a black lid near the water cooler on the second floor."
                rows="4"
                className={styles.textareaField}
                required
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>Location Found</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Employee Parking Lot, Lobby"
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="imageFile" className={styles.label}>Image/Video of the Item</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className={styles.fileInput}
              />
              <p className={styles.fileHint}>
                You can browse for a file or use your device's camera.
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="contact" className={styles.label}>Contact Info (Email/Phone)</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g., jane.smith@bullwork.com"
                className={styles.inputField}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Submit Found Item'
              )}
            </button>
            
            <Link href="/" className={styles.cancelLink}>
              Cancel and go back to home
            </Link>
          </form>
        </div>
      </main>
    </>
  );
}