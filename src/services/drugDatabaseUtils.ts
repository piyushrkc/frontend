import { Medication } from '@/types/pharmacy';

// This utility service handles the large drug database imported from Excel
// It provides efficient search and retrieval functions for medications

// Types for indexing and searching
type DrugIndex = {
  byId: Record<string, Medication>;
  byBrandName: Record<string, string[]>; // brand name -> ids
  byGenericName: Record<string, string[]>; // generic name -> ids
  byCombination: Record<string, string[]>; // combined search -> ids
};

// In-memory index for efficient searching
let drugIndex: DrugIndex | null = null;

// Mock list of medications to simulate the Excel import
// In production, this would be loaded from the CSV file in "Data for Integration" folder
export const mockMedications: Medication[] = [
  {
    id: 'med1',
    name: 'Atorvastatin 10mg Tablet',
    brandName: 'Lipitor',
    genericName: 'Atorvastatin',
    dosageForm: 'Tablet',
    strength: '10mg',
    category: 'Antilipidemic',
    price: 75.50,
    manufacturer: 'Pfizer',
    activeIngredient: 'Atorvastatin Calcium',
    isGeneric: false,
    isActive: true
  },
  {
    id: 'med2',
    name: 'Atorvastatin 20mg Tablet',
    brandName: 'Lipitor',
    genericName: 'Atorvastatin',
    dosageForm: 'Tablet',
    strength: '20mg',
    category: 'Antilipidemic',
    price: 105.25,
    manufacturer: 'Pfizer',
    activeIngredient: 'Atorvastatin Calcium',
    isGeneric: false,
    isActive: true
  },
  {
    id: 'med3',
    name: 'Atorvastatin 10mg Tablet',
    brandName: 'Atocor',
    genericName: 'Atorvastatin',
    dosageForm: 'Tablet',
    strength: '10mg',
    category: 'Antilipidemic',
    price: 45.30,
    manufacturer: 'Sun Pharma',
    activeIngredient: 'Atorvastatin Calcium',
    isGeneric: true,
    isActive: true
  },
  {
    id: 'med4',
    name: 'Metformin 500mg Tablet',
    brandName: 'Glucophage',
    genericName: 'Metformin',
    dosageForm: 'Tablet',
    strength: '500mg',
    category: 'Antidiabetic',
    price: 32.80,
    manufacturer: 'Merck',
    activeIngredient: 'Metformin Hydrochloride',
    isGeneric: false,
    isActive: true
  },
  {
    id: 'med5',
    name: 'Metformin 500mg Tablet',
    brandName: 'Glycomet',
    genericName: 'Metformin',
    dosageForm: 'Tablet',
    strength: '500mg',
    category: 'Antidiabetic',
    price: 18.50,
    manufacturer: 'USV',
    activeIngredient: 'Metformin Hydrochloride',
    isGeneric: true,
    isActive: true
  },
  {
    id: 'med6',
    name: 'Aspirin 75mg Tablet',
    brandName: 'Ecosprin',
    genericName: 'Aspirin',
    dosageForm: 'Tablet',
    strength: '75mg',
    category: 'Antiplatelet',
    price: 9.80,
    manufacturer: 'USV',
    activeIngredient: 'Acetylsalicylic Acid',
    isGeneric: true,
    isActive: true
  },
  {
    id: 'med7',
    name: 'Amlodipine 5mg Tablet',
    brandName: 'Norvasc',
    genericName: 'Amlodipine',
    dosageForm: 'Tablet',
    strength: '5mg',
    category: 'Antihypertensive',
    price: 48.75,
    manufacturer: 'Pfizer',
    activeIngredient: 'Amlodipine Besylate',
    isGeneric: false,
    isActive: true
  },
  {
    id: 'med8',
    name: 'Amlodipine 5mg Tablet',
    brandName: 'Amlogard',
    genericName: 'Amlodipine',
    dosageForm: 'Tablet',
    strength: '5mg',
    category: 'Antihypertensive',
    price: 28.40,
    manufacturer: 'Cipla',
    activeIngredient: 'Amlodipine Besylate',
    isGeneric: true,
    isActive: true
  },
  {
    id: 'med9',
    name: 'Paracetamol 500mg Tablet',
    brandName: 'Calpol',
    genericName: 'Paracetamol',
    dosageForm: 'Tablet',
    strength: '500mg',
    category: 'Analgesic',
    price: 12.80,
    manufacturer: 'GSK',
    activeIngredient: 'Paracetamol',
    isGeneric: false,
    isActive: true
  },
  {
    id: 'med10',
    name: 'Paracetamol 650mg Tablet',
    brandName: 'Dolo',
    genericName: 'Paracetamol',
    dosageForm: 'Tablet',
    strength: '650mg',
    category: 'Analgesic',
    price: 15.20,
    manufacturer: 'Micro Labs',
    activeIngredient: 'Paracetamol',
    isGeneric: false,
    isActive: true
  },
  // ... In a real implementation, this would have all 250K drug entries
];

// Common prescription templates for quick selection
export const prescriptionTemplates = [
  {
    id: 'template1',
    name: 'Common Cold',
    medications: [
      {
        medication: mockMedications[9], // Paracetamol 650mg (Dolo)
        dosage: '1 tablet',
        frequency: 'TID (three times a day)',
        duration: '5 days'
      },
      {
        medication: mockMedications[2], // Atorvastatin (standing in for an antihistamine)
        dosage: '1 tablet',
        frequency: 'BID (twice a day)',
        duration: '5 days'
      }
    ]
  },
  {
    id: 'template2',
    name: 'Hypertension',
    medications: [
      {
        medication: mockMedications[7], // Amlodipine 5mg (Amlogard)
        dosage: '1 tablet',
        frequency: 'OD (once daily)',
        duration: '30 days'
      },
      {
        medication: mockMedications[5], // Aspirin 75mg (Ecosprin)
        dosage: '1 tablet',
        frequency: 'OD (once daily)',
        duration: '30 days'
      }
    ]
  },
  {
    id: 'template3',
    name: 'Type 2 Diabetes',
    medications: [
      {
        medication: mockMedications[4], // Metformin 500mg (Glycomet)
        dosage: '1 tablet',
        frequency: 'BID (twice a day)',
        duration: '30 days'
      }
    ]
  },
  {
    id: 'template4',
    name: 'Dyslipidemia',
    medications: [
      {
        medication: mockMedications[0], // Atorvastatin 10mg (Lipitor)
        dosage: '1 tablet',
        frequency: 'OD (once daily) at night',
        duration: '30 days'
      }
    ]
  },
  {
    id: 'template5',
    name: 'UTI',
    medications: [
      {
        medication: mockMedications[2], // Standing in for an antibiotic
        dosage: '1 tablet',
        frequency: 'BID (twice a day)',
        duration: '7 days'
      }
    ]
  },
  {
    id: 'template6',
    name: 'Pain Management',
    medications: [
      {
        medication: mockMedications[9], // Paracetamol
        dosage: '1 tablet',
        frequency: 'TID (three times a day)',
        duration: '3 days'
      }
    ]
  }
];

// Initialize the index
export const initializeDrugIndex = () => {
  if (drugIndex) return; // Already initialized
  
  const index: DrugIndex = {
    byId: {},
    byBrandName: {},
    byGenericName: {},
    byCombination: {}
  };
  
  mockMedications.forEach(med => {
    // Index by ID
    index.byId[med.id] = med;
    
    // Index by brand name (lowercase for case-insensitive search)
    const brandLower = med.brandName.toLowerCase();
    if (!index.byBrandName[brandLower]) {
      index.byBrandName[brandLower] = [];
    }
    index.byBrandName[brandLower].push(med.id);
    
    // Index by generic name (lowercase for case-insensitive search)
    const genericLower = med.genericName.toLowerCase();
    if (!index.byGenericName[genericLower]) {
      index.byGenericName[genericLower] = [];
    }
    index.byGenericName[genericLower].push(med.id);
    
    // Index by combination of name, brand, generic
    const combinedTerms = `${med.name} ${med.brandName} ${med.genericName} ${med.dosageForm} ${med.strength}`.toLowerCase();
    for (const term of combinedTerms.split(/\s+/)) {
      if (term.length >= 2) { // Skip very short terms
        if (!index.byCombination[term]) {
          index.byCombination[term] = [];
        }
        if (!index.byCombination[term].includes(med.id)) {
          index.byCombination[term].push(med.id);
        }
      }
    }
  });
  
  drugIndex = index;
};

// Search for drugs by term (brand name or generic name)
export const searchDrugs = (searchTerm: string): Medication[] => {
  if (!drugIndex) {
    initializeDrugIndex();
  }
  
  if (!searchTerm || !drugIndex) return [];
  
  const term = searchTerm.toLowerCase();
  const matchedIds = new Set<string>();
  
  // Check brand name exact matches
  if (drugIndex.byBrandName[term]) {
    drugIndex.byBrandName[term].forEach(id => matchedIds.add(id));
  }
  
  // Check generic name exact matches
  if (drugIndex.byGenericName[term]) {
    drugIndex.byGenericName[term].forEach(id => matchedIds.add(id));
  }
  
  // Check partial matches in combined index
  for (const indexTerm in drugIndex.byCombination) {
    if (indexTerm.includes(term) || term.includes(indexTerm)) {
      drugIndex.byCombination[indexTerm].forEach(id => matchedIds.add(id));
    }
  }
  
  // Convert Set to array of medications
  return Array.from(matchedIds).map(id => drugIndex!.byId[id]);
};

// Get drug by ID
export const getDrugById = (id: string): Medication | null => {
  if (!drugIndex) {
    initializeDrugIndex();
  }
  
  return drugIndex?.byId[id] || null;
};

// Get all drugs
export const getAllDrugs = (): Medication[] => {
  if (!drugIndex) {
    initializeDrugIndex();
  }
  
  return Object.values(drugIndex?.byId || {});
};

// Initialize index on module load
initializeDrugIndex();

export default {
  searchDrugs,
  getDrugById,
  getAllDrugs,
  prescriptionTemplates
};