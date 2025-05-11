'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllLabTests } from '@/services/labService';
import { LabTest } from '@/types/lab';

export default function LabResultsPage() {
  const [completedTests, setCompletedTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    async function loadCompletedTests() {
      try {
        setIsLoading(true);
        const data = await getAllLabTests(undefined, undefined, 'completed');
        setCompletedTests(data);
      } catch (error) {
        console.error('Error loading completed lab tests:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCompletedTests();
  }, []);

  // Filter results based on search and date
  const filteredResults = completedTests.filter(test => {
    // Search filter
    const patientName = test.patient.name.toLowerCase();
    const testType = test.testType.toLowerCase();
    const doctorName = test.orderedBy.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = patientName.includes(searchLower) || 
                         testType.includes(searchLower) || 
                         doctorName.includes(searchLower) ||
                         test.id.includes(searchLower);
    
    // Date filter
    let matchesDate = true;
    if (dateFilter) {
      const testDate = new Date(test.completedAt || test.orderedAt).toISOString().split('T')[0];
      matchesDate = testDate === dateFilter;
    }
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lab Results</h1>
              <p className="text-gray-600">View and manage completed test results</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/lab/results/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <span className="mr-2">+</span> Enter New Results
              </Link>
            </div>
          </div>
        </header>
        
        {/* Search and Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Results
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by patient, test type, or doctor..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Lab Results List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">Loading lab results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No lab results found matching your criteria.</p>
            </div>
          ) : (
            filteredResults.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {test.testType}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Completed: {test.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  {test.result?.isAbnormal && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Abnormal Results
                    </span>
                  )}
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Information</h4>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="font-medium">{test.patient.name}</p>
                      {test.patient.contactNumber && (
                        <p className="text-sm text-gray-600">{test.patient.contactNumber}</p>
                      )}
                      {test.patient.gender && test.patient.dateOfBirth && (
                        <p className="text-sm text-gray-600">
                          {test.patient.gender}, {new Date(test.patient.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Test Information</h4>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="text-sm">
                        <span className="font-medium">Ordered by:</span> {test.orderedBy.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Test date:</span> {new Date(test.orderedAt).toLocaleDateString()}
                      </p>
                      {test.description && (
                        <p className="text-sm">
                          <span className="font-medium">Description:</span> {test.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/lab/tests/${test.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Test Details
                    </Link>
                    <div className="flex space-x-3">
                      <Link 
                        href={`/lab/results/${test.result?.id || 'not-found'}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View Results
                      </Link>
                      <Link 
                        href={`/lab/results/${test.result?.id || 'not-found'}/pdf`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Generate PDF
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <Link href="/lab" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Lab Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}