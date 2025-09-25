'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function BrowseItemsPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items/');
        if (!response.ok) {
          throw new Error('Failed to fetch items.');
        }
        const data = await response.json();
        setAllItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllItems();
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || item.itemType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [allItems, searchTerm, filterType]);

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
        <title>Browse Items - Bullwork Finder</title>
        <meta name="description" content="Browse all lost and found items posted by employees." />
      </Head>
      <main className="bg-gray-50 text-gray-900 min-h-screen p-6 sm:p-10">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Browse All Items</h1>
            <Link href="/Home" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105">
              Back to Home
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6 mb-10 p-4 bg-white rounded-xl shadow-md">
            <div className="w-full md:flex-1">
              <input
                type="text"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div className="w-full md:w-auto flex justify-center space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${filterType === 'all' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('lost')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${filterType === 'lost' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Lost
              </button>
              <button
                onClick={() => setFilterType('found')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${filterType === 'found' ? 'bg-teal-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Found
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 italic">No items match your search or filter criteria.</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-t-4 border-gray-200">
                  <div className="relative">
                   <image
  src={item.imageURL ? `http://localhost:5000${item.imageURL}` : `https://placehold.co/400x300/${item.itemType === 'lost' ? 'FCA5A5' : '99F6E4'}/${item.itemType === 'lost' ? 'ffffff' : '333'}?text=${item.itemName}`} 
  alt={item.itemName} 
  className="w-full h-48 object-cover" 
/>

                    <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md ${item.itemType === 'lost' ? 'bg-red-500' : 'bg-teal-500'}`}>
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
                        <span>{item.postedBy.name}</span>
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