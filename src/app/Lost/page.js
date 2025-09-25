// This is the updated and complete code for ReportLostPage.js
'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ReportLostPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    contact: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const router = useRouter();

  // Cleanup function for the image preview URL
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
      // Create a local URL for the image preview
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleMapLocation = () => {
    setShowMapModal(true);
  };

  const confirmMapLocation = () => {
    setShowMapModal(false);
    alert('Location set successfully!');
    setFormData(prev => ({ ...prev, location: 'Current Location (via map)' }));
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
      const response = await axios.post('http://localhost:5000/api/items/lost', data, {
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
      
      <main className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 border-t-8 border-red-500">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Report a Lost Item</h1>
          <p className="text-center text-gray-600 mb-8">
            Please fill out the form below with the details of the item you have lost.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g., Car Keys, Company Laptop"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Silver watch with a leather band. Last seen on my desk."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Last Seen Location</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Click pin icon to use map"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  readOnly={true}
                  required
                />
                <button 
                  type="button" 
                  onClick={handleMapLocation}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  title="Set location via map"
                >
                  <span role="img" aria-label="map pin" className="text-xl">📍</span>
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">Image/Video of the Item</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleFileChange}
                accept="image/*,video/*"
                // 👇️ Add the 'capture' attribute here
                capture="user" // 'user' for front camera, 'environment' for back camera
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can browse for a file or use your device's camera.
              </p>
              {imagePreview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center h-48">
                    <img src={imagePreview} alt="Item preview" className="object-cover w-full h-full" />
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Info (Email/Phone)</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g., john.doe@bullwork.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition disabled:bg-red-300"
            >
              {loading ? 'Submitting...' : 'Submit Lost Item'}
            </button>
            
            <Link href="/" className="block text-center text-sm font-medium text-gray-500 hover:underline mt-4">
              Cancel and go back to home
            </Link>
          </form>
        </div>
        {showMapModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Set Location on Map</h2>
              <p className="text-center text-sm text-gray-600 my-4">
                Simulating your exact location in Bengaluru, India.
              </p>
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => setShowMapModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmMapLocation}
                  className="px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}