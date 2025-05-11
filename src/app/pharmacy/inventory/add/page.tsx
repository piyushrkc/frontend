'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MedicationAutocomplete from '@/components/pharmacy/MedicationAutocomplete';
import { Medication } from '@/types/pharmacy';
import { createInventory } from '@/services/pharmacyService';

export default function AddInventoryPage() {
  const router = useRouter();
  
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [location, setLocation] = useState('');
  const [supplier, setSupplier] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle medication selection from autocomplete
  const handleMedicationSelect = (medication: Medication) => {
    setSelectedMedication(medication);
    // Auto-populate the selling price from the medication price
    setSellingPrice(medication.price.toString());
  };

  // Validate form fields
  const validateForm = () => {
    if (!selectedMedication) {
      setError('Please select a medication');
      return false;
    }
    
    if (!batchNumber.trim()) {
      setError('Batch number is required');
      return false;
    }
    
    if (!expiryDate) {
      setError('Expiry date is required');
      return false;
    }
    
    if (!quantity || parseInt(quantity) <= 0) {
      setError('Quantity must be greater than zero');
      return false;
    }
    
    if (!minQuantity || parseInt(minQuantity) <= 0) {
      setError('Minimum quantity must be greater than zero');
      return false;
    }
    
    if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
      setError('Purchase price must be greater than zero');
      return false;
    }
    
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      setError('Selling price must be greater than zero');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (!selectedMedication) {
        throw new Error('No medication selected');
      }
      
      // Create inventory item using the service
      const inventoryData = {
        medicationId: selectedMedication.id,
        batchNumber,
        expiryDate,
        currentQuantity: parseInt(quantity),
        minQuantity: parseInt(minQuantity),
        purchasePrice: parseFloat(purchasePrice),
        purchaseDate: new Date().toISOString().split('T')[0],
        location,
        manufacturer: supplier || selectedMedication.manufacturer || '',
      };
      
      await createInventory(inventoryData);
      
      // Show success message and redirect
      alert('Inventory added successfully!');
      router.push('/pharmacy/inventory');
    } catch (error) {
      console.error('Error adding inventory:', error);
      setError('Failed to add inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add Inventory</h1>
              <p className="text-gray-600">Add new medication to inventory</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/pharmacy/inventory" 
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Back to Inventory
              </Link>
            </div>
          </div>
        </header>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medication Selection */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication *
                </label>
                <MedicationAutocomplete 
                  onSelect={handleMedicationSelect}
                  placeholder="Search for medication by name, brand or generic..."
                />
                {selectedMedication && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <p className="text-sm font-medium text-gray-900">{selectedMedication.brandName} {selectedMedication.strength}</p>
                    <p className="text-xs text-gray-500">
                      Generic Name: {selectedMedication.genericName} | Category: {selectedMedication.category}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Batch Number */}
              <div>
                <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Number *
                </label>
                <input
                  type="text"
                  id="batchNumber"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Units) *
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Min Quantity */}
              <div>
                <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock Level *
                </label>
                <input
                  type="number"
                  id="minQuantity"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Alerts will be triggered when stock falls below this level
                </p>
              </div>
              
              {/* Purchase Price */}
              <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price (₹) *
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Selling Price */}
              <div>
                <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  id="sellingPrice"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Shelf A-12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Supplier */}
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  id="supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g., ABC Pharmaceuticals"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <Link 
                href="/pharmacy/inventory"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Inventory...
                  </>
                ) : (
                  'Add to Inventory'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}