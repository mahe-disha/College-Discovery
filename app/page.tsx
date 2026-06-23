'use client';

import React, { useState, useEffect } from 'react';

// Mock Dataset incorporating valid and corrupted data to test defensive programming
const MOCK_COLLEGES = [
  { id: 1, name: "Indian Institute of Technology (IIT) Delhi", location: "Delhi", fees: "₹2,20,000/year", rating: 4.9 },
  { id: 2, name: "Delhi Technological University (DTU)", location: "Delhi", fees: "₹1,90,000/year", rating: 4.6 },
  { id: 3, name: "Mumbai University", location: "Mumbai", fees: "₹85,000/year", rating: 4.2 },
  { id: 4, name: "St. Xavier's College", location: "Mumbai", fees: "₹65,000/year", rating: 4.4 },
  // Edge Case: Broken/Corrupted Entry to demonstrate application boundaries and resilience
  { id: 5, name: "Global Institute of Management", location: "Bangalore", fees: null, rating: undefined }
];

export default function CollegeDiscoveryPlatform() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Simulating network latency to display the custom loading skeleton state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Filtering Logic with strict defensive boundaries against missing values (Null/Undefined)
  const filteredColleges = MOCK_COLLEGES.filter((college) => {
    const collegeName = college?.name ? college.name.toLowerCase() : '';
    const collegeLocation = college?.location ? college.location : 'Unknown';
    
    const matchesSearch = collegeName.includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || collegeLocation === selectedLocation;
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-gradient min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-indigo-600">EduFind</h1>
            <p className="text-xs text-slate-500">Discover & Compare Premier Colleges</p>
          </div>
          
          {/* Controls: Search and Filter */}
          <div className="flex w-full sm:w-auto items-center gap-3">
            <input
              type="text"
              placeholder="Search by college name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">All Locations</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          /* Loading State: Skeleton Layout Simulation */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : filteredColleges.length === 0 ? (
          /* Graceful Failure State: Zero Results Boundary Found */
          <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl max-w-md mx-auto">
            <p className="text-lg font-medium text-slate-600">No institutions found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or query parameters.</p>
          </div>
        ) : (
          /* Hydrated UI Grid Grid mapping matching items safely */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredColleges.map((college) => (
              <div 
                key={college.id} 
                className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-44"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base font-semibold text-slate-800 line-clamp-1">{college.name}</h3>
                    {/* Safeguarding visual logic via Nullish Coalescing for undefined inputs */}
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      ★ {college.rating ?? 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">📍 {college.location || 'Unknown'}</p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Annual Tuition</p>
                    {/* Handling data holes cleanly without breaking client hydration cycles */}
                    <p className="text-sm font-bold text-slate-700">{college.fees ?? 'Contact Administration'}</p>
                  </div>
                  <button className="px-4 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}