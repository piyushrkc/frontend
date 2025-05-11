'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllLabTests, updateLabTestStatus } from '@/services/labService';
import { LabTest } from '@/types/lab';

export default function LabTestsPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('status') || '';
  
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [newStatus, setNewStatus] = useState<'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled'>('collected');

  useEffect(() => {
    async function loadLabTests() {
      try {
        setIsLoading(true);
        const data = await getAllLabTests(undefined, undefined, statusFilter || undefined);
        setLabTests(data);
      } catch (error) {
        console.error('Error loading lab tests:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLabTests();
  }, [statusFilter]);

  // Filter lab tests based on search
  const filteredTests = labTests.filter(test => {
    const patientName = test.patient.name.toLowerCase();
    const testType = test.testType.toLowerCase();
    const doctorName = test.orderedBy.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return patientName.includes(searchLower) || 
           testType.includes(searchLower) || 
           doctorName.includes(searchLower) ||
           test.id.includes(searchLower);
  });

  // Open the status update modal for a test
  const openUpdateModal = (test: LabTest) => {
    setSelectedTest(test);
    
    // Determine next logical status based on current status
    let nextStatus: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled';
    switch (test.status) {
      case 'ordered':
        nextStatus = 'collected';
        break;
      case 'collected':
        nextStatus = 'processing';
        break;
      case 'processing':
        nextStatus = 'completed';
        break;
      default:
        nextStatus = 'collected';
    }
    
    setNewStatus(nextStatus);
    setShowUpdateModal(true);
  };

  // Handle lab test status update
  const handleUpdateStatus = async () => {
    if (!selectedTest) return;
    
    try {
      const updatedTest = await updateLabTestStatus(selectedTest.id, newStatus);
      
      // Update the local state
      setLabTests(prev => prev.map(test => 
        test.id === selectedTest.id ? updatedTest : test
      ));
      
      setShowUpdateModal(false);
      setSelectedTest(null);
    } catch (error) {
      console.error('Error updating lab test status:', error);
      // Would add error notification in a real app
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lab Tests</h1>
              <p className="text-gray-600">View and manage laboratory tests</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/lab/tests/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <span className="mr-2">+</span> Order New Test
              </Link>
            </div>
          </div>
        </header>
        
        {/* Search and Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Lab Tests
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="status"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Tests</option>
                <option value="ordered">Ordered</option>
                <option value="collected">Collected</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Lab Tests Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          {isLoading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading lab tests...</p>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No lab tests found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTests.map((test) => {
                    // Status styles
                    const statusStyles = {
                      ordered: 'bg-blue-100 text-blue-800',
                      collected: 'bg-amber-100 text-amber-800',
                      processing: 'bg-yellow-100 text-yellow-800',
                      completed: 'bg-green-100 text-green-800',
                      cancelled: 'bg-gray-100 text-gray-800'
                    };
                    
                    return (
                      <tr key={test.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {test.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{test.patient.name}</div>
                          {test.patient.gender && test.patient.dateOfBirth && (
                            <div className="text-sm text-gray-500">
                              {test.patient.gender}, {new Date(test.patient.dateOfBirth).getFullYear()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.testType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{test.orderedBy.name}</div>
                          {test.orderedBy.specialization && (
                            <div className="text-sm text-gray-500">{test.orderedBy.specialization}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(test.orderedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[test.status]}`}>
                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {test.status !== 'completed' && test.status !== 'cancelled' && (
                            <button
                              onClick={() => openUpdateModal(test)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Update Status
                            </button>
                          )}
                          {test.status === 'completed' && (
                            <Link 
                              href={`/lab/results/${test.result?.id || ''}`}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              View Results
                            </Link>
                          )}
                          <Link 
                            href={`/lab/tests/${test.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <Link href="/lab" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Lab Dashboard
          </Link>
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && selectedTest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Test Status
            </h3>
            <div className="mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Test ID:</span> {selectedTest.id}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Patient:</span> {selectedTest.patient.name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Test Type:</span> {selectedTest.testType}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Current Status:</span> {selectedTest.status}
                </p>
              </div>
              
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Update Status To:
              </label>
              <select
                id="newStatus"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                {/* Only show logical next steps based on current status */}
                {selectedTest.status === 'ordered' && (
                  <>
                    <option value="collected">Collected</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
                {selectedTest.status === 'collected' && (
                  <>
                    <option value="processing">Processing</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
                {selectedTest.status === 'processing' && (
                  <>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>
              
              {newStatus === 'completed' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-3">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        When marking as completed, you will need to enter the test results. You will be redirected to the results entry form after this step.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedTest(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}