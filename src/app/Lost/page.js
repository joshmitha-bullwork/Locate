'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import styles from './lost.module.css';

// Get the API base URL from the environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReportLostPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    contact: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('itemType', 'lost');
    data.append('itemName', formData.itemName);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('contact', formData.contact);
    if (imageFile) {
        data.append('image', imageFile);
    }

    try {
      // Use the environment variable to construct the full URL
      const response = await axios.post(`${API_BASE_URL}/items/lost`, data, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Your lost item has been reported successfully! We hope you find it soon.');
        router.push('/Home');
      } else {
        throw new Error('Failed to submit item.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Report Lost Item - Bullwork Finder</title>
        <meta name="description" content="Report a lost item at Bullwork Mobility." />
      </Head>

      <main className={styles.mainContainer}>
        {/* New header section added here */}
        <div className={styles.header}>
            <h1 className={styles.title}>Report Lost Item</h1>
            <Link href="/Home" className={styles.backButton}>
                Back to Home
            </Link>
        </div>

        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>Report a Lost Item</h1>
          <p className={styles.formSubtitle}>
            Please fill out the form below with the details of the item you have lost.
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
                placeholder="e.g., Car Keys, Company Laptop"
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
                placeholder="e.g., Silver watch with a leather band. Last seen on my desk."
                rows="4"
                className={styles.textareaField}
                required
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>Last Seen Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Cafeteria, Meeting Room C"
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
                capture="user"
                className={styles.fileInput}
              />
              <p className={styles.fileHint}>
                You can browse for a file or use your device's camera.
              </p>
              {imagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <label className={styles.label}>Image Preview</label>
                  <div className={styles.imagePreviewWrapper}>
                    <img src={imagePreview} alt="Item preview" className={styles.imagePreview} />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contact" className={styles.label}>Contact Info (Email/Phone)</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g., john.doe@bullwork.com"
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
                'Submit Lost Item'
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