'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllInventory, adjustInventory } from '@/services/pharmacyService';
import { InventoryItem } from '@/types/pharmacy';

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || '';
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>(initialFilter);
  const [selectedMedicationType, setSelectedMedicationType] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');

  // Medication types for filter (derived from data)
  const medicationTypes = [...new Set(inventory.map(item => item.medication.category))].sort();

  useEffect(() => {
    async function loadInventory() {
      try {
        setIsLoading(true);
        
        // Determine API parameters based on filter type
        const lowStock = filterType === 'low-stock';
        const expired = filterType === 'expiring';
        
        const data = await getAllInventory(undefined, lowStock, expired);
        setInventory(data);
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInventory();
  }, [filterType]);

  // Filter inventory based on search and medication type
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.manufacturer && item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = selectedMedicationType ? item.medication.category === selectedMedicationType : true;
    
    return matchesSearch && matchesType;
  });

  // Open the adjustment modal for an item
  const openAdjustModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentQuantity(0);
    setAdjustmentReason('');
    setShowAdjustModal(true);
  };

  // Handle inventory adjustment
  const handleAdjustInventory = async () => {
    if (!selectedItem || adjustmentQuantity === 0 || !adjustmentReason) return;
    
    try {
      await adjustInventory(selectedItem.id, adjustmentQuantity, adjustmentReason);
      
      // Update the local state
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? {...item, currentQuantity: item.currentQuantity + adjustmentQuantity}
          : item
      ));
      
      setShowAdjustModal(false);
      setSelectedItem(null);
      setAdjustmentQuantity(0);
      setAdjustmentReason('');
    } catch (error) {
      console.error('Error adjusting inventory:', error);
      // Would add error notification in a real app
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
              <p className="text-gray-600">Track and manage medication inventory</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/pharmacy/inventory/add" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <span className="mr-2">+</span> Add Inventory
              </Link>
            </div>
          </div>
        </header>
        
        {/* Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Inventory
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by medication, batch, etc..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter View
              </label>
              <select
                id="filter"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Inventory</option>
                <option value="low-stock">Low Stock Items</option>
                <option value="expiring">Expiring Soon</option>
              </select>
            </div>
            <div>
              <label htmlFor="medicationType" className="block text-sm font-medium text-gray-700 mb-1">
                Medication Type
              </label>
              <select
                id="medicationType"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMedicationType}
                onChange={(e) => setSelectedMedicationType(e.target.value)}
              >
                <option value="">All Types</option>
                {medicationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Inventory Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          {isLoading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No inventory items found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => {
                    // Calculate status
                    const isLowStock = item.currentQuantity < item.minQuantity;
                    const today = new Date();
                    const expiryDate = new Date(item.expiryDate);
                    const threeMonthsFromNow = new Date();
                    threeMonthsFromNow.setMonth(today.getMonth() + 3);
                    
                    const isExpired = expiryDate < today;
                    const isExpiringSoon = !isExpired && expiryDate < threeMonthsFromNow;
                    
                    let statusColor = 'bg-green-100 text-green-800';
                    let statusText = 'Normal';
                    
                    if (isExpired) {
                      statusColor = 'bg-red-100 text-red-800';
                      statusText = 'Expired';
                    } else if (isExpiringSoon) {
                      statusColor = 'bg-amber-100 text-amber-800';
                      statusText = 'Expiring Soon';
                    } else if (isLowStock) {
                      statusColor = 'bg-orange-100 text-orange-800';
                      statusText = 'Low Stock';
                    }
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.medication.name}</div>
                          <div className="text-sm text-gray-500">
                            {item.medication.dosageForm}, {item.medication.strength}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Batch: {item.batchNumber}</div>
                          <div className="text-sm text-gray-500">
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.currentQuantity} units</div>
                          <div className="text-sm text-gray-500">Min: {item.minQuantity} units</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.location || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openAdjustModal(item)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Adjust
                          </button>
                          <Link 
                            href={`/pharmacy/inventory/${item.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View
                          </Link>
                          <Link 
                            href={`/pharmacy/inventory/${item.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Edit
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
          <Link href="/pharmacy" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Pharmacy Dashboard
          </Link>
        </div>
      </div>

      {/* Adjust Inventory Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Adjust Inventory: {selectedItem.medication.name}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Current quantity: <span className="font-medium">{selectedItem.currentQuantity} units</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Batch: <span className="font-medium">{selectedItem.batchNumber}</span>
              </p>
              
              <label htmlFor="adjustmentQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Adjustment Amount
              </label>
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 rounded-l-md border border-gray-300"
                  onClick={() => setAdjustmentQuantity(prev => prev - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  id="adjustmentQuantity"
                  className="w-full px-4 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-0 text-center"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                  aria-label="Adjustment quantity"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 rounded-r-md border border-gray-300"
                  onClick={() => setAdjustmentQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                New quantity will be: <span className="font-medium">{selectedItem.currentQuantity + adjustmentQuantity} units</span>
              </p>
              
              <label htmlFor="adjustmentReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Adjustment
              </label>
              <select
                id="adjustmentReason"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="Dispensed for prescription">Dispensed for prescription</option>
                <option value="New stock received">New stock received</option>
                <option value="Stock count correction">Stock count correction</option>
                <option value="Damaged/Expired">Damaged/Expired</option>
                <option value="Returned by patient">Returned by patient</option>
                <option value="Other">Other</option>
              </select>
              {adjustmentReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify reason..."
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                />
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedItem(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                onClick={handleAdjustInventory}
                disabled={adjustmentQuantity === 0 || !adjustmentReason || (selectedItem.currentQuantity + adjustmentQuantity < 0)}
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}