'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface LabTest {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  reportTime: string; // e.g., "24 hours"
  hsn?: string;
}

interface InvoiceItem {
  testId: string;
  name: string;
  price: number;
}

const WalkInLabInvoice = () => {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTests, setFilteredTests] = useState<LabTest[]>([]);
  const [selectedTests, setSelectedTests] = useState<InvoiceItem[]>([]);
  
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch lab tests on component mount
  useEffect(() => {
    const fetchLabTests = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/lab/tests');
        // const data = await response.json();
        // setLabTests(data);
        
        // For demo, use mock data
        setTimeout(() => {
          const mockLabTests: LabTest[] = [
            {
              _id: '1',
              name: 'Complete Blood Count (CBC)',
              category: 'Hematology',
              price: 500,
              description: 'Analysis of red and white blood cells and platelets',
              reportTime: '24 hours'
            },
            {
              _id: '2',
              name: 'Lipid Profile',
              category: 'Biochemistry',
              price: 800,
              description: 'Measures different fats in the blood including total cholesterol, HDL, LDL, and triglycerides',
              reportTime: '24 hours'
            },
            {
              _id: '3',
              name: 'Liver Function Test (LFT)',
              category: 'Biochemistry',
              price: 1200,
              description: 'Evaluates the functioning of the liver through various biomarkers',
              reportTime: '24 hours'
            },
            {
              _id: '4',
              name: 'Thyroid Function Test',
              category: 'Endocrinology',
              price: 1500,
              description: 'Measures thyroid hormones like T3, T4 and TSH',
              reportTime: '48 hours'
            },
            {
              _id: '5',
              name: 'Urine Analysis',
              category: 'Clinical Pathology',
              price: 300,
              description: 'Physical, chemical, and microscopic examination of urine',
              reportTime: '24 hours'
            },
            {
              _id: '6',
              name: 'Blood Glucose (Fasting)',
              category: 'Biochemistry',
              price: 250,
              description: 'Measures blood glucose levels after fasting',
              reportTime: 'Same day'
            },
            {
              _id: '7',
              name: 'Hemoglobin A1c (HbA1c)',
              category: 'Biochemistry',
              price: 850,
              description: 'Measures average blood glucose levels over past 2-3 months',
              reportTime: '24 hours'
            },
            {
              _id: '8',
              name: 'X-Ray Chest',
              category: 'Radiology',
              price: 500,
              description: 'Radiographic imaging of the chest',
              reportTime: 'Same day'
            }
          ];
          
          setLabTests(mockLabTests);
          setFilteredTests(mockLabTests);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching lab tests:', error);
        toast.error('Failed to load lab tests');
        setIsLoading(false);
      }
    };
    
    fetchLabTests();
  }, []);
  
  // Filter lab tests based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTests(labTests);
    } else {
      const filtered = labTests.filter(test => 
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTests(filtered);
    }
  }, [searchTerm, labTests]);
  
  // Calculate totals
  const subtotal = selectedTests.reduce((total, test) => total + test.price, 0);
  const gstRate = 18; // Default GST rate (would come from settings in a real app)
  const gstAmount = (subtotal * gstRate) / 100;
  const totalAmount = subtotal + gstAmount;
  const balanceDue = totalAmount - paidAmount;
  
  // Add test to invoice
  const addTestToInvoice = (test: LabTest) => {
    // Check if already added
    if (selectedTests.some(item => item.testId === test._id)) {
      toast.error('This test is already added to the invoice');
      return;
    }
    
    setSelectedTests([
      ...selectedTests,
      {
        testId: test._id,
        name: test.name,
        price: test.price
      }
    ]);
  };
  
  // Remove test from invoice
  const removeTestFromInvoice = (index: number) => {
    const updatedTests = [...selectedTests];
    updatedTests.splice(index, 1);
    setSelectedTests(updatedTests);
  };
  
  // Handle invoice submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName) {
      toast.error('Customer name is required');
      return;
    }
    
    if (selectedTests.length === 0) {
      toast.error('Please add at least one test to the invoice');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/walkin/laboratory/invoice', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     customerName,
      //     contactNumber,
      //     email,
      //     address,
      //     tests: selectedTests.map(test => ({
      //       id: test.testId,
      //       name: test.name,
      //       price: test.price
      //     })),
      //     paymentMethod,
      //     paidAmount,
      //     notes
      //   })
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to create invoice');
      // }
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Invoice created successfully');
      
      // Reset form
      setCustomerName('');
      setContactNumber('');
      setEmail('');
      setAddress('');
      setSelectedTests([]);
      setPaymentMethod('Cash');
      setPaidAmount(0);
      setNotes('');
      
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Walk-in Laboratory Invoice</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name*
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              />
            </div>
          </div>
        </div>
        
        {/* Lab Test Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Lab Tests</h3>
          
          <div className="mb-4">
            <label htmlFor="searchTest" className="block text-sm font-medium text-gray-700 mb-1">
              Search Tests
            </label>
            <input
              type="text"
              id="searchTest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter test name or category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-md font-medium mb-2">Available Tests</h4>
              <div className="h-60 overflow-y-auto border border-gray-200 rounded-md">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading tests...
                    </span>
                  </div>
                ) : filteredTests.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No tests found
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredTests.map((test) => (
                      <li
                        key={test._id}
                        className={`p-3 hover:bg-gray-50 ${
                          selectedTests.some(item => item.testId === test._id) ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-gray-500">{test.category} | Report in {test.reportTime}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{test.price.toFixed(2)}</p>
                            <button
                              type="button"
                              onClick={() => addTestToInvoice(test)}
                              disabled={selectedTests.some(item => item.testId === test._id)}
                              className={`text-sm ${
                                selectedTests.some(item => item.testId === test._id)
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-primary-600 hover:text-primary-800'
                              }`}
                            >
                              {selectedTests.some(item => item.testId === test._id) ? 'Added' : 'Add to Invoice'}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-2">Selected Tests</h4>
              <div className="h-60 overflow-y-auto border border-gray-200 rounded-md">
                {selectedTests.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No tests selected
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {selectedTests.map((test, index) => (
                      <li key={index} className="p-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{test.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{test.price.toFixed(2)}</p>
                            <button
                              type="button"
                              onClick={() => removeTestFromInvoice(index)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Payment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Paid Amount
              </label>
              <input
                type="number"
                id="paidAmount"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Special Instructions)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              placeholder="Any special instructions for sample collection or testing"
            ></textarea>
          </div>
        </div>
        
        {/* Invoice Summary */}
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">Invoice Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({gstRate}%):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Paid Amount:</span>
              <span>₹{paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Balance Due:</span>
              <span className={balanceDue > 0 ? 'text-red-600' : 'text-green-600'}>
                ₹{balanceDue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Sample Collection Notes */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded-md">
          <h4 className="font-medium mb-2">Sample Collection Information</h4>
          <p className="text-sm">
            • Sample collection will be done at the laboratory.
            <br />
            • Fasting may be required for certain tests.
            <br />
            • Reports will be available digitally and in print according to the mentioned time.
            <br />
            • For home collection, additional charges may apply.
          </p>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || selectedTests.length === 0}
            className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Generate Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WalkInLabInvoice;