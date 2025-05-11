'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LabTest } from '@/types/lab';

export default function LabDashboardPage() {
  const router = useRouter();
  
  const [pendingTests, setPendingTests] = useState<LabTest[]>([]);
  const [completedTests, setCompletedTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Simulate API call to get lab tests
    const fetchTests = async () => {
      setLoading(true);
      
      // Mock data
      setTimeout(() => {
        const mockPendingTests: LabTest[] = [
          {
            id: 'test001',
            patient: {
              id: 'PAT001',
              name: 'John Smith',
              gender: 'Male',
              dateOfBirth: '1980-06-15'
            },
            orderedBy: {
              id: 'DOC001',
              name: 'Dr. Robert Miller',
              specialization: 'General Medicine'
            },
            testType: 'Complete Blood Count',
            testCategory: 'CBC',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          },
          {
            id: 'test002',
            patient: {
              id: 'PAT002',
              name: 'Sarah Johnson',
              gender: 'Female',
              dateOfBirth: '1992-03-22'
            },
            orderedBy: {
              id: 'DOC002',
              name: 'Dr. Jennifer Lee',
              specialization: 'Endocrinology'
            },
            testType: 'Lipid Profile',
            testCategory: 'LIPID',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
          },
          {
            id: 'test003',
            patient: {
              id: 'PAT003',
              name: 'Michael Williams',
              gender: 'Male',
              dateOfBirth: '1975-11-08'
            },
            orderedBy: {
              id: 'DOC003',
              name: 'Dr. Michael Brown',
              specialization: 'Internal Medicine'
            },
            testType: 'Liver Function Test',
            testCategory: 'LFT',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
          },
          {
            id: 'test004',
            patient: {
              id: 'PAT004',
              name: 'Emily Brown',
              gender: 'Female',
              dateOfBirth: '1988-09-30'
            },
            orderedBy: {
              id: 'DOC001',
              name: 'Dr. Robert Miller',
              specialization: 'General Medicine'
            },
            testType: 'Thyroid Function Panel',
            testCategory: 'THYROID',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
          }
        ];
        
        const mockCompletedTests: LabTest[] = [
          {
            id: 'test005',
            patient: {
              id: 'PAT001',
              name: 'John Smith',
              gender: 'Male',
              dateOfBirth: '1980-06-15'
            },
            orderedBy: {
              id: 'DOC001',
              name: 'Dr. Robert Miller',
              specialization: 'General Medicine'
            },
            testType: 'Complete Blood Count',
            testCategory: 'CBC',
            orderedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: 'completed',
            collectedAt: new Date(Date.now() - 172800000 + 3600000).toISOString(),
            completedAt: new Date(Date.now() - 172800000 + 7200000).toISOString(),
            processedBy: 'LAB001'
          },
          {
            id: 'test006',
            patient: {
              id: 'PAT002',
              name: 'Sarah Johnson',
              gender: 'Female',
              dateOfBirth: '1992-03-22'
            },
            orderedBy: {
              id: 'DOC002',
              name: 'Dr. Jennifer Lee',
              specialization: 'Endocrinology'
            },
            testType: 'Diabetes Screening',
            testCategory: 'DIABETES',
            orderedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            status: 'completed',
            collectedAt: new Date(Date.now() - 259200000 + 3600000).toISOString(),
            completedAt: new Date(Date.now() - 259200000 + 7200000).toISOString(),
            processedBy: 'LAB002'
          }
        ];
        
        setPendingTests(mockPendingTests);
        setCompletedTests(mockCompletedTests);
        setLoading(false);
      }, 800);
    };
    
    fetchTests();
  }, []);
  
  const handleProcessTest = (testId: string) => {
    router.push(`/lab-dashboard/enter-results?testId=${testId}`);
  };
  
  const handleViewTest = (testId: string) => {
    router.push(`/lab-dashboard/view-results?testId=${testId}`);
  };
  
  // Filter tests based on search query
  const filteredPendingTests = pendingTests.filter(test => 
    test.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCompletedTests = completedTests.filter(test => 
    test.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate time elapsed
  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };
  
  // Get status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'collected':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laboratory Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Process lab tests and manage results
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search Tests
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by patient name, ID, or test type"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'pending'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } mr-3`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending Tests ({filteredPendingTests.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed ({filteredCompletedTests.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {activeTab === 'pending' ? 'Pending Tests' : 'Recently Completed Tests'}
            </h3>
          </div>

          {loading ? (
            <div className="px-4 py-5 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordered By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'pending' ? 'Collected' : 'Completed'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTab === 'pending' ? (
                    filteredPendingTests.length > 0 ? (
                      filteredPendingTests.map((test) => (
                        <tr key={test.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{test.patient.name}</div>
                                <div className="text-sm text-gray-500">
                                  ID: {test.patient.id} | {test.patient.gender} | 
                                  {test.patient.dateOfBirth && (
                                    ` ${new Date().getFullYear() - new Date(test.patient.dateOfBirth).getFullYear()} yrs`
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{test.testType}</div>
                            <div className="text-xs text-gray-500">{test.testCategory}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{test.orderedBy.name}</div>
                            <div className="text-xs text-gray-500">{test.orderedBy.specialization}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {test.collectedAt && (
                              <div>
                                <div className="text-sm text-gray-900">{formatDate(test.collectedAt)}</div>
                                <div className="text-xs text-gray-500">{getTimeElapsed(test.collectedAt)}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(test.status)}`}>
                              {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleProcessTest(test.id)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Process Results
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No pending tests found.
                        </td>
                      </tr>
                    )
                  ) : (
                    filteredCompletedTests.length > 0 ? (
                      filteredCompletedTests.map((test) => (
                        <tr key={test.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{test.patient.name}</div>
                                <div className="text-sm text-gray-500">
                                  ID: {test.patient.id} | {test.patient.gender} | 
                                  {test.patient.dateOfBirth && (
                                    ` ${new Date().getFullYear() - new Date(test.patient.dateOfBirth).getFullYear()} yrs`
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{test.testType}</div>
                            <div className="text-xs text-gray-500">{test.testCategory}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{test.orderedBy.name}</div>
                            <div className="text-xs text-gray-500">{test.orderedBy.specialization}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {test.completedAt && (
                              <div>
                                <div className="text-sm text-gray-900">{formatDate(test.completedAt)}</div>
                                <div className="text-xs text-gray-500">{getTimeElapsed(test.completedAt)}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(test.status)}`}>
                              {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewTest(test.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Results
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No completed tests found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}