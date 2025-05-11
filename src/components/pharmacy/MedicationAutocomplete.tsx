import React, { useState, useEffect, useRef } from 'react';
import { Medication } from '@/types/pharmacy';
// Import from the correct file and destructure the default export properly
import { prescriptionTemplates } from '@/services/drugDatabaseUtils';
import { searchMedications } from '@/utils/drugDatabaseUtils';

type MedicationAutocompleteProps = {
  onSelect: (medication: Medication) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
  onTemplateSelect?: (template: any) => void;
};

export default function MedicationAutocomplete({
  onSelect,
  placeholder = 'Search medication by name, brand or generic...',
  className = '',
  initialValue = '',
  onTemplateSelect
}: MedicationAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Medication[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Frequently used medications
  const frequentMedications: Medication[] = [
    {
      id: 'freq-1',
      name: 'Paracetamol 500mg',
      brandName: 'Calpol',
      genericName: 'Paracetamol',
      dosageForm: 'Tablet',
      strength: '500mg',
      category: 'Analgesic',
      price: 15.20,
      manufacturer: 'GSK',
      activeIngredient: 'Paracetamol'
    },
    {
      id: 'freq-2',
      name: 'Amoxicillin 500mg',
      brandName: 'Mox',
      genericName: 'Amoxicillin',
      dosageForm: 'Capsule',
      strength: '500mg',
      category: 'Antibiotic',
      price: 45.60,
      manufacturer: 'Cipla',
      activeIngredient: 'Amoxicillin'
    },
    {
      id: 'freq-3',
      name: 'Azithromycin 500mg',
      brandName: 'Azithral',
      genericName: 'Azithromycin',
      dosageForm: 'Tablet',
      strength: '500mg',
      category: 'Antibiotic',
      price: 85.40,
      manufacturer: 'Alembic',
      activeIngredient: 'Azithromycin'
    },
    {
      id: 'freq-4',
      name: 'Omeprazole 20mg',
      brandName: 'Omez',
      genericName: 'Omeprazole',
      dosageForm: 'Capsule',
      strength: '20mg',
      category: 'Proton Pump Inhibitor',
      price: 35.70,
      manufacturer: 'Dr. Reddy\'s',
      activeIngredient: 'Omeprazole'
    },
    {
      id: 'freq-5',
      name: 'Cetirizine 10mg',
      brandName: 'Alerid',
      genericName: 'Cetirizine',
      dosageForm: 'Tablet',
      strength: '10mg',
      category: 'Antihistamine',
      price: 18.90,
      manufacturer: 'Cipla',
      activeIngredient: 'Cetirizine'
    }
  ];

  // Search medications based on query
  const searchMedications = (searchQuery: string) => {
    setLoading(true);
    
    // Cancel previous debounce timer if exists
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the search to prevent excessive API calls
    debounceTimerRef.current = setTimeout(() => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      try {
        // Increased limit from 10 to 25 for more comprehensive results
        searchMedications(searchQuery, 25)
          .then(filteredResults => {
            setResults(filteredResults);
            setLoading(false);
          })
          .catch(err => {
            console.error('Error searching medications:', err);
            setResults([]);
            setLoading(false);
          });
      } catch (error) {
        console.error('Error searching medications:', error);
        setResults([]);
        setLoading(false);
      }
    }, 300);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);
    searchMedications(value);
  };

  // Handle selection
  const handleSelect = (medication: Medication) => {
    setQuery(`${medication.brandName} (${medication.genericName}) ${medication.strength}`);
    setShowDropdown(false);
    onSelect(medication);
  };

  // Handle template selection
  const handleTemplateSelect = (template: any) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
      setShowDropdown(false);
    } else {
      alert(`Selected template: ${template.name} with ${template.medications.length} medications`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Initial search if initialValue is provided
  useEffect(() => {
    if (initialValue) {
      searchMedications(initialValue);
    }
  }, [initialValue]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      
      {showDropdown && (results.length > 0 || !query.trim()) && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto border border-gray-200"
        >
          {/* Templates section - shown when input is empty */}
          {!query.trim() && (
            <div className="py-1 px-2">
              <div className="grid grid-cols-2">
                <div className="col-span-1 border-r border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-1">
                    Prescription Templates
                  </div>
                  {prescriptionTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <span className="text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-xs text-gray-500">
                          {template.medications.map(m => m.medication.brandName).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="col-span-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-1">
                    Frequently Used Medications
                  </div>
                  {frequentMedications.map((medication) => (
                    <div 
                      key={medication.id}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                      onClick={() => handleSelect(medication)}
                    >
                      <span className="text-green-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{medication.brandName} {medication.strength}</div>
                        <div className="text-xs text-gray-500">
                          {medication.genericName} | {medication.dosageForm}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 my-1"></div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-1">
                Or Type to Search More Medications
              </div>
            </div>
          )}
          
          {/* Results section */}
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((medication, index) => (
                <li
                  key={medication.id}
                  className={`px-4 py-2 cursor-pointer ${
                    index === highlightedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(medication)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{medication.brandName} {medication.strength}</span>
                    <span className="text-sm text-gray-500">
                      {medication.genericName} | {medication.dosageForm} | ₹{medication.price.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <div className="py-3 px-4 text-sm text-gray-500 text-center">
              No medications found. Try a different search term.
            </div>
          ) : null}
          
          {/* Add New Medication option */}
          <div className="border-t border-gray-100">
            <div 
              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer flex items-center"
              onClick={() => {
                // In a real implementation, this would open a form to add a new medication
                alert('This would open a form to add a new medication');
              }}
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Medication
            </div>
          </div>
        </div>
      )}
    </div>
  );
}