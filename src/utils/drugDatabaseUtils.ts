// Client-side implementation of the drug database
// In a real implementation, this would be a server-side API call
import { Medication } from '@/types/pharmacy';

// This is a small subset of the large 250K database for client-side usage
// In production, this should be a serverless API endpoint

// Define the structure that would come from the large CSV database
interface DrugCSVRow {
  id: string;
  name: string;
  price: string;
  is_discontinued: string;
  manufacturer_name: string;
  type: string;
  pack_size_label: string;
  short_composition1: string;
  short_composition2: string;
}

// Define a more efficient indexed structure for lookup
interface DrugDatabase {
  byId: Map<string, Medication>;
  byBrandName: Map<string, string[]>; // brand name -> ids
  byGenericName: Map<string, string[]>; // generic name -> ids
  allMedications: Medication[];
}

// In-memory database
let drugDatabase: DrugDatabase | null = null;

/**
 * Parse the composition string to extract active ingredient and strength
 */
function parseComposition(composition: string): { activeIngredient: string; strength: string } {
  // Example: "Amoxycillin (500mg)"
  const match = composition.match(/(.+?)\s*\((.+?)\)/);
  
  if (match && match.length >= 3) {
    return {
      activeIngredient: match[1].trim(),
      strength: match[2].trim()
    };
  }
  
  return {
    activeIngredient: composition.trim(),
    strength: ""
  };
}

/**
 * Convert a CSV row to a Medication object
 */
function convertCsvRowToMedication(row: DrugCSVRow): Medication {
  // Parse the first composition which typically contains the main active ingredient
  const mainComposition = parseComposition(row.short_composition1);
  
  // Parse the second composition if available
  let secondaryActiveIngredient = "";
  let combinedActiveIngredient = mainComposition.activeIngredient;
  
  if (row.short_composition2 && row.short_composition2.trim() !== '') {
    const secondaryComposition = parseComposition(row.short_composition2);
    secondaryActiveIngredient = secondaryComposition.activeIngredient;
    combinedActiveIngredient += ` + ${secondaryActiveIngredient}`;
  }

  // Extract the dosage form from the pack size label
  const dosageForm = extractDosageForm(row.pack_size_label);

  return {
    id: row.id,
    name: row.name,
    brandName: row.name,
    genericName: combinedActiveIngredient,
    dosageForm: dosageForm,
    strength: mainComposition.strength,
    category: row.type.charAt(0).toUpperCase() + row.type.slice(1), // Capitalize first letter
    price: parseFloat(row.price),
    manufacturer: row.manufacturer_name,
    activeIngredient: combinedActiveIngredient,
    isGeneric: false, // Since these are all branded drugs in the dataset
    isActive: row.is_discontinued.toLowerCase() !== 'true'
  };
}

/**
 * Extract dosage form from pack size label
 */
function extractDosageForm(packSizeLabel: string): string {
  const commonForms = [
    'tablet', 'tablets', 'capsule', 'capsules', 'syrup', 
    'injection', 'cream', 'ointment', 'gel', 'drops',
    'suspension', 'powder', 'lotion', 'solution', 'spray'
  ];
  
  const lowercaseLabel = packSizeLabel.toLowerCase();
  
  for (const form of commonForms) {
    if (lowercaseLabel.includes(form)) {
      return form.charAt(0).toUpperCase() + form.slice(1);
    }
  }
  
  return 'Other';
}

/**
 * Initialize the drug database with sample data
 * In a real app, this would be a server-side API call
 */
export async function initializeDrugDatabase(): Promise<DrugDatabase> {
  if (drugDatabase) {
    return drugDatabase;
  }
  
  try {
    // Create the database structure
    const db: DrugDatabase = {
      byId: new Map<string, Medication>(),
      byBrandName: new Map<string, string[]>(),
      byGenericName: new Map<string, string[]>(),
      allMedications: []
    };

    // This would be replaced with actual data from the CSV in a server environment
    // Sample data from the 250K drug database - in production this would be loaded from the API
    const sampleData: Partial<DrugCSVRow>[] = [
      {
        id: "1",
        name: "Lipitor 10mg",
        price: "149.50",
        manufacturer_name: "Pfizer",
        type: "Tablet",
        pack_size_label: "10 Tablets",
        short_composition1: "Atorvastatin (10mg)",
        is_discontinued: "false"
      },
      {
        id: "2",
        name: "Lipitor 20mg",
        price: "249.75",
        manufacturer_name: "Pfizer",
        type: "Tablet",
        pack_size_label: "10 Tablets",
        short_composition1: "Atorvastatin (20mg)",
        is_discontinued: "false"
      },
      {
        id: "3",
        name: "Ecosprin 75",
        price: "19.50",
        manufacturer_name: "USV Limited",
        type: "Tablet",
        pack_size_label: "14 Tablets",
        short_composition1: "Aspirin (75mg)",
        is_discontinued: "false"
      },
      {
        id: "4",
        name: "Glycomet 500mg",
        price: "32.30",
        manufacturer_name: "USV Limited",
        type: "Tablet",
        pack_size_label: "20 Tablets",
        short_composition1: "Metformin (500mg)",
        is_discontinued: "false"
      },
      {
        id: "5",
        name: "Crocin Advance",
        price: "28.00",
        manufacturer_name: "GSK",
        type: "Tablet",
        pack_size_label: "15 Tablets",
        short_composition1: "Paracetamol (500mg)",
        is_discontinued: "false"
      },
      {
        id: "6",
        name: "Augmentin 625 Duo",
        price: "220.00",
        manufacturer_name: "GSK",
        type: "Tablet",
        pack_size_label: "10 Tablets",
        short_composition1: "Amoxicillin (500mg)",
        short_composition2: "Clavulanic Acid (125mg)",
        is_discontinued: "false"
      },
      {
        id: "7",
        name: "Pan-D",
        price: "120.50",
        manufacturer_name: "Alkem Laboratories",
        type: "Tablet",
        pack_size_label: "10 Tablets",
        short_composition1: "Pantoprazole (40mg)",
        short_composition2: "Domperidone (30mg)",
        is_discontinued: "false"
      },
      {
        id: "8",
        name: "Telma-H",
        price: "149.00",
        manufacturer_name: "Glenmark",
        type: "Tablet",
        pack_size_label: "10 Tablets",
        short_composition1: "Telmisartan (40mg)",
        short_composition2: "Hydrochlorothiazide (12.5mg)",
        is_discontinued: "false"
      },
      {
        id: "9",
        name: "Azithral 500",
        price: "250.00",
        manufacturer_name: "Alembic",
        type: "Tablet",
        pack_size_label: "5 Tablets",
        short_composition1: "Azithromycin (500mg)",
        is_discontinued: "false"
      },
      {
        id: "10",
        name: "Dolo 650",
        price: "30.00",
        manufacturer_name: "Micro Labs",
        type: "Tablet",
        pack_size_label: "15 Tablets",
        short_composition1: "Paracetamol (650mg)",
        is_discontinued: "false"
      }
    ];
    
    // Process each record
    for (const record of sampleData) {
      if (!record.id || !record.name) continue;
      
      const medication = convertCsvRowToMedication(record as DrugCSVRow);
      
      // Skip discontinued medications
      if (!medication.isActive) {
        continue;
      }
      
      // Add to ID map
      db.byId.set(medication.id, medication);
      
      // Add to brand name map (case insensitive lookup)
      const brandLower = medication.brandName.toLowerCase();
      if (!db.byBrandName.has(brandLower)) {
        db.byBrandName.set(brandLower, []);
      }
      db.byBrandName.get(brandLower)?.push(medication.id);
      
      // Add to generic name map (case insensitive lookup)
      const genericLower = medication.genericName.toLowerCase();
      if (!db.byGenericName.has(genericLower)) {
        db.byGenericName.set(genericLower, []);
      }
      db.byGenericName.get(genericLower)?.push(medication.id);
      
      // Add to all medications array
      db.allMedications.push(medication);
    }
    
    // Set the global database
    drugDatabase = db;
    
    // Add more sample records - in production this would be a larger set of data from the API
    // Simulate having at least 100 items for pagination testing by duplicating with different IDs
    for (let i = 11; i <= 100; i++) {
      const baseItem = sampleData[i % 10];
      if (!baseItem || !baseItem.id || !baseItem.name) continue;
      
      const newItem = {...baseItem};
      newItem.id = i.toString();
      newItem.name = `${baseItem.name} (Copy ${i})`;
      
      const medication = convertCsvRowToMedication(newItem as DrugCSVRow);
      
      db.byId.set(medication.id, medication);
      
      const brandLower = medication.brandName.toLowerCase();
      if (!db.byBrandName.has(brandLower)) {
        db.byBrandName.set(brandLower, []);
      }
      db.byBrandName.get(brandLower)?.push(medication.id);
      
      const genericLower = medication.genericName.toLowerCase();
      if (!db.byGenericName.has(genericLower)) {
        db.byGenericName.set(genericLower, []);
      }
      db.byGenericName.get(genericLower)?.push(medication.id);
      
      db.allMedications.push(medication);
    }
    
    return db;
  } catch (error) {
    console.error('Error initializing drug database:', error);
    
    // If there's an error, create an empty database
    drugDatabase = {
      byId: new Map<string, Medication>(),
      byBrandName: new Map<string, string[]>(),
      byGenericName: new Map<string, string[]>(),
      allMedications: []
    };
    
    return drugDatabase;
  }
}

/**
 * Search for medications by brand name or generic name
 */
export async function searchMedications(
  query: string, 
  limit: number = 10
): Promise<Medication[]> {
  // Simulate API latency (remove in production)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Initialize database if needed
  const db = await initializeDrugDatabase();
  
  // Empty query returns recent or popular medications
  if (!query || query.trim() === '') {
    // Add logging for demonstration
    console.log(`Returning ${Math.min(limit, db.allMedications.length)} of ${db.allMedications.length} medications (empty query)`);
    return db.allMedications.slice(0, limit);
  }
  
  const lowerQuery = query.toLowerCase();
  const results: Medication[] = [];
  const seenIds = new Set<string>();
  let matchCount = 0;
  
  // Search by brand name first (prioritize exact matches)
  for (const [brandName, ids] of db.byBrandName.entries()) {
    if (brandName.includes(lowerQuery)) {
      matchCount++;
      for (const id of ids) {
        if (!seenIds.has(id)) {
          const medication = db.byId.get(id);
          if (medication) {
            results.push(medication);
            seenIds.add(id);
            
            if (results.length >= limit) {
              // Add logging for demonstration
              console.log(`Found ${results.length} medications matching "${query}" in ${matchCount} brand names`);
              return results;
            }
          }
        }
      }
    }
  }
  
  // Then search by generic name
  for (const [genericName, ids] of db.byGenericName.entries()) {
    if (genericName.includes(lowerQuery)) {
      matchCount++;
      for (const id of ids) {
        if (!seenIds.has(id)) {
          const medication = db.byId.get(id);
          if (medication) {
            results.push(medication);
            seenIds.add(id);
            
            if (results.length >= limit) {
              // Add logging for demonstration
              console.log(`Found ${results.length} medications matching "${query}" in ${matchCount} brand/generic names`);
              return results;
            }
          }
        }
      }
    }
  }
  
  // Extended search for partial matches in medication names
  if (results.length < limit) {
    for (const medication of db.allMedications) {
      if (!seenIds.has(medication.id)) {
        const fullName = `${medication.brandName} ${medication.genericName} ${medication.strength}`.toLowerCase();
        if (fullName.includes(lowerQuery)) {
          results.push(medication);
          seenIds.add(medication.id);
          
          if (results.length >= limit) {
            break;
          }
        }
      }
    }
  }
  
  // Add logging for demonstration
  console.log(`Returning ${results.length} medications matching "${query}" from database of ${db.allMedications.length} medications`);
  
  return results;
}

/**
 * Get a medication by ID
 */
export async function getMedicationById(id: string): Promise<Medication | null> {
  const db = await initializeDrugDatabase();
  return db.byId.get(id) || null;
}

/**
 * Get medications by generic name
 */
export async function getMedicationsByGenericName(
  genericName: string,
  limit: number = 10
): Promise<Medication[]> {
  const db = await initializeDrugDatabase();
  const lowerGeneric = genericName.toLowerCase();
  
  const results: Medication[] = [];
  for (const [name, ids] of db.byGenericName.entries()) {
    if (name === lowerGeneric || name.includes(lowerGeneric)) {
      for (const id of ids) {
        const medication = db.byId.get(id);
        if (medication) {
          results.push(medication);
          
          if (results.length >= limit) {
            return results;
          }
        }
      }
    }
  }
  
  return results;
}

/**
 * Create a new custom medication
 */
export async function createCustomMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
  const db = await initializeDrugDatabase();
  
  // Generate a new ID
  const newId = `custom-${Date.now()}`;
  
  // Create the new medication
  const newMedication: Medication = {
    ...medication,
    id: newId
  };
  
  // Add to database
  db.byId.set(newId, newMedication);
  
  // Add to brand name map
  const brandLower = newMedication.brandName.toLowerCase();
  if (!db.byBrandName.has(brandLower)) {
    db.byBrandName.set(brandLower, []);
  }
  db.byBrandName.get(brandLower)?.push(newId);
  
  // Add to generic name map
  const genericLower = newMedication.genericName.toLowerCase();
  if (!db.byGenericName.has(genericLower)) {
    db.byGenericName.set(genericLower, []);
  }
  db.byGenericName.get(genericLower)?.push(newId);
  
  // Add to all medications array
  db.allMedications.push(newMedication);
  
  return newMedication;
}

/**
 * Update a medication's price
 */
export async function updateMedicationPrice(id: string, newPrice: number): Promise<Medication | null> {
  const db = await initializeDrugDatabase();
  
  const medication = db.byId.get(id);
  if (!medication) {
    return null;
  }
  
  // Update the price
  medication.price = newPrice;
  
  return medication;
}