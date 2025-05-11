/**
 * Development Environment Utilities
 * 
 * This file contains utilities to simulate database and API functionality
 * in the development environment. In production, these would be replaced
 * with actual API calls to the backend.
 */

import { Medication } from '@/types/pharmacy';

/**
 * Simulates loading data from a CSV file
 * In production, this would be a backend API endpoint
 */
export const loadDrugDatabase = async (): Promise<Medication[]> => {
  // In real implementation, this would be an API call to backend that 
  // processes the large CSV file

  // Generating 250 sample medications
  const medications: Medication[] = [];
  const brands = [
    'Lipitor', 'Crocin', 'Combiflam', 'Dolo', 'Ecosprin', 
    'Glycomet', 'Telma', 'Pan-D', 'Azithral', 'Augmentin',
    'Allegra', 'Paracetamol', 'Calpol', 'Omeprazole', 'MetroGyl'
  ];
  
  const generics = [
    'Atorvastatin', 'Paracetamol', 'Ibuprofen', 'Aspirin', 'Metformin',
    'Telmisartan', 'Pantoprazole', 'Azithromycin', 'Amoxicillin',
    'Fexofenadine', 'Acetaminophen', 'Omeprazole', 'Metronidazole'
  ];
  
  const dosageForms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Gel', 'Drops'];
  const strengths = ['5mg', '10mg', '20mg', '40mg', '500mg', '650mg', '800mg', '1g', '2%', '5%'];
  const categories = ['Antilipidemic', 'Analgesic', 'Antibiotic', 'Antidiabetic', 'Antihypertensive', 'Antihistamine', 'Antiseptic'];
  const manufacturers = ['Sun Pharma', 'Cipla', 'Dr. Reddy\'s', 'Torrent', 'GSK', 'USV Limited', 'Pfizer', 'Micro Labs', 'Alkem'];
  
  for (let i = 1; i <= 250; i++) {
    const brandIndex = Math.floor(Math.random() * brands.length);
    const genericIndex = Math.floor(Math.random() * generics.length);
    const dosageFormIndex = Math.floor(Math.random() * dosageForms.length);
    const strengthIndex = Math.floor(Math.random() * strengths.length);
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const manufacturerIndex = Math.floor(Math.random() * manufacturers.length);
    
    const brandName = brands[brandIndex];
    const genericName = generics[genericIndex];
    const strength = strengths[strengthIndex];
    
    medications.push({
      id: `med-${i}`,
      name: `${brandName} ${strength}`,
      brandName,
      genericName,
      dosageForm: dosageForms[dosageFormIndex],
      strength,
      category: categories[categoryIndex],
      description: `${genericName} ${dosageForms[dosageFormIndex]} ${strength}`,
      price: Math.round(Math.random() * 500 * 100) / 100, // Random price between 0 and 500
      manufacturer: manufacturers[manufacturerIndex],
      activeIngredient: genericName,
      isGeneric: Math.random() > 0.7, // 30% chance of being generic
      isActive: Math.random() > 0.05, // 5% chance of being inactive
    });
  }
  
  return medications;
};

/**
 * Simulates searching the drug database
 * In production, this would be a backend API endpoint or ElasticSearch
 */
export const searchDrugDatabase = (query: string, medications: Medication[]): Medication[] => {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  return medications.filter(med => {
    const searchableText = `${med.brandName} ${med.genericName} ${med.strength} ${med.dosageForm}`.toLowerCase();
    
    // Simple search - at least one term must match
    return searchTerms.some(term => searchableText.includes(term));
  }).slice(0, 10); // Limit results to 10
};

export default {
  loadDrugDatabase,
  searchDrugDatabase
};