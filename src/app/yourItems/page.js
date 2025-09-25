// src/app/yourItems/page.js
'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function MyItemsPage() {
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/items/my-items',
          { withCredentials: true }
        );

        if (response.status !== 200) {
          throw new Error('Failed to fetch your items.');
        }

        setUserItems(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          router.push('/Home'); // not authenticated → redirect
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
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

      <main className="bg-gray-50 text-gray-900 min-h-screen p-6 sm:p-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Your Posted Items</h1>
            <Link
              href="/Home"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105"
            >
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {userItems.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 italic">
                You have not posted any items yet.
              </p>
            ) : (
              userItems.map((item, index) => (
                <div
                  key={item._id ?? `item-${index}`} // ✅ ensures unique key always
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-t-4 border-gray-200"
                >
                  <div className="relative">
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
                      className="w-full h-48 object-cover"
                    />
                    <div
                      className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md ${
                        item.itemType === 'lost' ? 'bg-red-500' : 'bg-teal-500'
                      }`}
                    >
                      {item.itemType === 'lost' ? 'Lost Item' : 'Found Item'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{item.itemName}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Location:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Posted by:</span>
                        <span>{item.postedBy?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Posted on:</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
