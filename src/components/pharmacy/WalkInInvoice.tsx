'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface Medication {
  _id: string;
  name: string;
  genericName: string;
  form: string;
  strength: string;
  price: number;
  stock: number;
  manufacturer: string;
  hsn?: string;
}

interface InvoiceItem {
  medicationId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

const WalkInInvoice = () => {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch medications on component mount
  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/medications');
        // const data = await response.json();
        // setMedications(data);
        
        // For demo, use mock data
        setTimeout(() => {
          const mockMedications: Medication[] = [
            {
              _id: '1',
              name: 'Paracetamol 500mg',
              genericName: 'Paracetamol',
              form: 'Tablet',
              strength: '500mg',
              price: 5.50,
              stock: 500,
              manufacturer: 'ABC Pharma'
            },
            {
              _id: '2',
              name: 'Amoxicillin 250mg',
              genericName: 'Amoxicillin',
              form: 'Capsule',
              strength: '250mg',
              price: 12.00,
              stock: 200,
              manufacturer: 'XYZ Healthcare'
            },
            {
              _id: '3',
              name: 'Omeprazole 20mg',
              genericName: 'Omeprazole',
              form: 'Capsule',
              strength: '20mg',
              price: 8.75,
              stock: 150,
              manufacturer: 'Medico Labs'
            },
            {
              _id: '4',
              name: 'Azithromycin 500mg',
              genericName: 'Azithromycin',
              form: 'Tablet',
              strength: '500mg',
              price: 18.50,
              stock: 100,
              manufacturer: 'Pharma Plus'
            },
            {
              _id: '5',
              name: 'Metformin 500mg',
              genericName: 'Metformin',
              form: 'Tablet',
              strength: '500mg',
              price: 6.25,
              stock: 300,
              manufacturer: 'Diabetes Care'
            }
          ];
          
          setMedications(mockMedications);
          setFilteredMedications(mockMedications);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast.error('Failed to load medications');
        setIsLoading(false);
      }
    };
    
    fetchMedications();
  }, []);
  
  // Filter medications based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedications(medications);
    } else {
      const filtered = medications.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedications(filtered);
    }
  }, [searchTerm, medications]);
  
  // Calculate totals
  const subtotal = invoiceItems.reduce((total, item) => total + item.amount, 0);
  const gstRate = 18; // Default GST rate (would come from settings in a real app)
  const gstAmount = (subtotal * gstRate) / 100;
  const totalAmount = subtotal + gstAmount;
  const balanceDue = totalAmount - paidAmount;
  
  // Add item to invoice
  const addItemToInvoice = () => {
    if (!selectedMedication) {
      toast.error('Please select a medication');
      return;
    }
    
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    
    if (quantity > selectedMedication.stock) {
      toast.error(`Only ${selectedMedication.stock} units available in stock`);
      return;
    }
    
    const amount = selectedMedication.price * quantity;
    
    const newItem: InvoiceItem = {
      medicationId: selectedMedication._id,
      name: selectedMedication.name,
      quantity,
      unitPrice: selectedMedication.price,
      amount
    };
    
    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedMedication(null);
    setQuantity(1);
    setSearchTerm('');
  };
  
  // Remove item from invoice
  const removeItemFromInvoice = (index: number) => {
    const updatedItems = [...invoiceItems];
    updatedItems.splice(index, 1);
    setInvoiceItems(updatedItems);
  };
  
  // Handle invoice submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName) {
      toast.error('Customer name is required');
      return;
    }
    
    if (invoiceItems.length === 0) {
      toast.error('Please add at least one item to the invoice');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/walkin/pharmacy/invoice', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     customerName,
      //     contactNumber,
      //     email,
      //     address,
      //     items: invoiceItems.map(item => ({
      //       medicationId: item.medicationId,
      //       quantity: item.quantity,
      //       unitPrice: item.unitPrice
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
      setInvoiceItems([]);
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
      <h2 className="text-xl font-semibold mb-6">Walk-in Pharmacy Invoice</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name*
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
        
        {/* Medication Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Medications</h3>
          
          <div className="mb-4">
            <label htmlFor="searchMedication" className="block text-sm font-medium text-gray-700 mb-1">
              Search Medication
            </label>
            <input
              type="text"
              id="searchMedication"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter medication name or generic name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
            />
          </div>
          
          {searchTerm && (
            <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {isLoading ? (
                <div className="p-4 text-center">
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading medications...
                  </span>
                </div>
              ) : filteredMedications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No medications found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredMedications.map((med) => (
                    <li
                      key={med._id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedMedication?._id === med._id ? 'bg-primary-50' : ''}`}
                      onClick={() => setSelectedMedication(med)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-gray-500">{med.genericName} | {med.form} | {med.strength}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{med.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Stock: {med.stock}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {selectedMedication && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{selectedMedication.name}</span>
                <span>₹{selectedMedication.price.toFixed(2)} per unit</span>
              </div>
              <div className="flex items-center mt-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-2">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={selectedMedication.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                />
                <span className="mx-2">Total: ₹{(selectedMedication.price * quantity).toFixed(2)}</span>
                <button
                  type="button"
                  onClick={addItemToInvoice}
                  className="ml-auto bg-primary-600 text-white py-1 px-3 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Add to Invoice
                </button>
              </div>
            </div>
          )}
          
          {/* Invoice Items Table */}
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Invoice Items</h4>
            {invoiceItems.length === 0 ? (
              <div className="text-center p-4 border border-gray-200 rounded-md">
                <p className="text-gray-500">No items added to invoice yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          ₹{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right font-medium">
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => removeItemFromInvoice(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
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
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || invoiceItems.length === 0}
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

export default WalkInInvoice;