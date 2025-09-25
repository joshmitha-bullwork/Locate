 'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Add this import

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
    
    // In a real app, you would upload the image to a service like AWS S3
    const imageURL = imageFile ? 'http://example.com/uploaded/image.jpg' : null;

    try {
      const payload = {
        itemType: 'found', // Explicitly set the itemType
        itemName: formData.itemName,
        description: formData.description,
        location: formData.location,
        contact: formData.contact,
        imageURL: imageURL,
      };

      const response = await axios.post('http://localhost:5000/api/items/found', payload, {
        withCredentials: true,
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

  return (
    <>
      <Head>
        <title>Report Found Item - Bullwork Finder</title>
        <meta name="description" content="Report a found item at Bullwork Mobility." />
      </Head>
      
      <main className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 border-t-8 border-teal-500">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Report a Found Item</h1>
          <p className="text-center text-gray-600 mb-8">
            Please fill out the form below with the details of the item you found.
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
                placeholder="e.g., Red Coffee Mug, Car Keys"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
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
                placeholder="e.g., Found a red mug with a black lid near the water cooler on the second floor."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Employee Parking Lot, Lobby"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">Image/Video of the Item</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can browse for a file or use your device's camera.
              </p>
            </div>
            
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Info (Email/Phone)</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g., jane.smith@bullwork.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-full shadow-md hover:bg-teal-600 transition disabled:bg-teal-300"
            >
              {loading ? 'Submitting...' : 'Submit Found Item'}
            </button>
            
            <Link href="/" className="block text-center text-sm font-medium text-gray-500 hover:underline mt-4">
              Cancel and go back to home
            </Link>
          </form>
        </div>
      </main>
    </>
  );
}