import api from '@/lib/api';
import { 
  Medication, 
  InventoryItem, 
  Prescription,
  InventoryAlert,
  MedicationInput,
  InventoryInput,
  PrescriptionProcessInput
} from '@/types/pharmacy';

// For local development and testing, we'll use mock data
const USE_MOCK_DATA = true;

// ================= MEDICATION MANAGEMENT =================

export async function getAllMedications(
  category?: string,
  dosageForm?: string
): Promise<Medication[]> {
  if (USE_MOCK_DATA) {
    return getMockMedications();
  }

  let url = '/api/pharmacy/medications';
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (dosageForm) params.append('dosageForm', dosageForm);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await api.get(url);
  return response.data.data.medications;
}

export async function getMedication(id: string): Promise<Medication> {
  if (USE_MOCK_DATA) {
    const medications = await getMockMedications();
    const medication = medications.find(med => med.id === id);
    if (!medication) throw new Error('Medication not found');
    return medication;
  }

  const response = await api.get(`/api/pharmacy/medications/${id}`);
  return response.data.data.medication;
}

export async function createMedication(data: MedicationInput): Promise<Medication> {
  if (USE_MOCK_DATA) {
    console.log('Creating medication:', data);
    return {
      id: 'new-med-' + Date.now(),
      ...data,
      price: data.price || 0,
      activeIngredient: data.activeIngredient || '',
    };
  }

  const response = await api.post('/api/pharmacy/medications', data);
  return response.data.data.medication;
}

export async function updateMedication(id: string, data: Partial<MedicationInput>): Promise<Medication> {
  if (USE_MOCK_DATA) {
    console.log('Updating medication:', id, data);
    return {
      id,
      name: data.name || 'Updated Medication',
      dosageForm: data.dosageForm || 'tablet',
      strength: data.strength || '500mg',
      category: data.category || 'Antibiotics',
      price: data.price || 0,
      activeIngredient: data.activeIngredient || '',
    };
  }

  const response = await api.patch(`/api/pharmacy/medications/${id}`, data);
  return response.data.data.medication;
}

export async function deleteMedication(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    console.log('Deleting medication:', id);
    return;
  }

  await api.delete(`/api/pharmacy/medications/${id}`);
}

export async function searchMedications(query: string): Promise<Medication[]> {
  if (USE_MOCK_DATA) {
    const medications = await getMockMedications();
    return medications.filter(med => 
      med.name.toLowerCase().includes(query.toLowerCase()) ||
      med.category.toLowerCase().includes(query.toLowerCase()) ||
      med.strength.toLowerCase().includes(query.toLowerCase())
    );
  }

  const response = await api.get(`/api/pharmacy/medications/search?query=${encodeURIComponent(query)}`);
  return response.data.data.medications;
}

export async function getMedicationAlternatives(id: string): Promise<Medication[]> {
  if (USE_MOCK_DATA) {
    const medications = await getMockMedications();
    const medication = medications.find(med => med.id === id);
    if (!medication) return [];
    
    // Return medications with the same active ingredient
    return medications.filter(med => 
      med.id !== id && 
      med.activeIngredient === medication.activeIngredient
    );
  }

  const response = await api.get(`/api/pharmacy/medications/${id}/alternatives`);
  return response.data.data.alternatives;
}

// ================= INVENTORY MANAGEMENT =================

export async function getAllInventory(
  medicationId?: string,
  lowStock?: boolean,
  expired?: boolean
): Promise<InventoryItem[]> {
  if (USE_MOCK_DATA) {
    return getMockInventory();
  }

  let url = '/api/pharmacy/inventory';
  const params = new URLSearchParams();
  
  if (medicationId) params.append('medication', medicationId);
  if (lowStock) params.append('lowStock', 'true');
  if (expired) params.append('expired', 'true');
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await api.get(url);
  return response.data.data.inventory;
}

export async function getInventoryItem(id: string): Promise<InventoryItem> {
  if (USE_MOCK_DATA) {
    const inventory = await getMockInventory();
    const item = inventory.find(item => item.id === id);
    if (!item) throw new Error('Inventory item not found');
    return item;
  }

  const response = await api.get(`/api/pharmacy/inventory/${id}`);
  return response.data.data.inventory;
}

export async function createInventory(data: InventoryInput): Promise<InventoryItem> {
  if (USE_MOCK_DATA) {
    console.log('Creating inventory item:', data);
    const medications = await getMockMedications();
    const medication = medications.find(med => med.id === data.medicationId);
    
    return {
      id: 'new-inv-' + Date.now(),
      medication: medication || medications[0],
      batchNumber: data.batchNumber,
      currentQuantity: data.currentQuantity,
      minQuantity: data.minQuantity,
      expiryDate: data.expiryDate,
      manufacturer: data.manufacturer,
      purchaseDate: data.purchaseDate,
      purchasePrice: data.purchasePrice,
      location: data.location,
    };
  }

  const response = await api.post('/api/pharmacy/inventory', data);
  return response.data.data.inventory;
}

export async function updateInventory(id: string, data: Partial<InventoryInput>): Promise<InventoryItem> {
  if (USE_MOCK_DATA) {
    console.log('Updating inventory item:', id, data);
    const inventory = await getMockInventory();
    const item = inventory.find(item => item.id === id);
    if (!item) throw new Error('Inventory item not found');
    
    return {
      ...item,
      ...data,
      medicationId: data.medicationId || item.medication.id,
    };
  }

  const response = await api.patch(`/api/pharmacy/inventory/${id}`, data);
  return response.data.data.inventory;
}

export async function deleteInventory(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    console.log('Deleting inventory item:', id);
    return;
  }

  await api.delete(`/api/pharmacy/inventory/${id}`);
}

export async function adjustInventory(
  id: string, 
  adjustment: number, 
  reason: string
): Promise<InventoryItem> {
  if (USE_MOCK_DATA) {
    console.log('Adjusting inventory:', id, adjustment, reason);
    const inventory = await getMockInventory();
    const item = inventory.find(item => item.id === id);
    if (!item) throw new Error('Inventory item not found');
    
    return {
      ...item,
      currentQuantity: item.currentQuantity + adjustment,
    };
  }

  const response = await api.patch(`/api/pharmacy/inventory/${id}/adjust`, {
    adjustment,
    reason
  });
  
  return response.data.data.inventory;
}

export async function getLowStockAlerts(threshold = 10): Promise<InventoryAlert[]> {
  if (USE_MOCK_DATA) {
    const inventory = await getMockInventory();
    return inventory
      .filter(item => item.currentQuantity < threshold)
      .map(item => ({
        id: `alert-low-${item.id}`,
        type: 'low_stock',
        message: `Low stock for ${item.medication.name} (${item.currentQuantity} remaining)`,
        inventoryItem: item,
        date: new Date().toISOString(),
        resolved: false,
      }));
  }

  const response = await api.get(`/api/pharmacy/inventory/alerts/low-stock?threshold=${threshold}`);
  return response.data.data.lowStock;
}

export async function getExpiringAlerts(months = 3): Promise<InventoryAlert[]> {
  if (USE_MOCK_DATA) {
    const inventory = await getMockInventory();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);
    
    return inventory
      .filter(item => new Date(item.expiryDate) < expiryDate && new Date(item.expiryDate) > new Date())
      .map(item => ({
        id: `alert-exp-${item.id}`,
        type: 'expiring',
        message: `${item.medication.name} (Batch ${item.batchNumber}) expires on ${new Date(item.expiryDate).toLocaleDateString()}`,
        inventoryItem: item,
        date: new Date().toISOString(),
        resolved: false,
      }));
  }

  const response = await api.get(`/api/pharmacy/inventory/alerts/expiring?months=${months}`);
  return response.data.data.expiring;
}

// ================= PRESCRIPTION MANAGEMENT =================

export async function getPendingPrescriptions(): Promise<Prescription[]> {
  if (USE_MOCK_DATA) {
    return getMockPrescriptions().filter(p => p.status === 'pending');
  }

  const response = await api.get('/api/pharmacy/prescriptions/pending');
  return response.data.data.prescriptions;
}

export async function processPrescription(
  id: string, 
  data: PrescriptionProcessInput
): Promise<Prescription> {
  if (USE_MOCK_DATA) {
    console.log('Processing prescription:', id, data);
    const prescriptions = await getMockPrescriptions();
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) throw new Error('Prescription not found');
    
    return {
      ...prescription,
      status: data.status,
      dispensingNotes: data.notes,
      dispensedAt: new Date().toISOString(),
      dispensedBy: 'current-user',
    };
  }

  const response = await api.patch(`/api/pharmacy/prescriptions/${id}/process`, data);
  return response.data.data.prescription;
}

// ================= MOCK DATA =================

async function getMockMedications(): Promise<Medication[]> {
  return [
    {
      id: 'med1',
      name: 'Amoxicillin',
      dosageForm: 'Capsule',
      strength: '500mg',
      category: 'Antibiotics',
      description: 'Broad-spectrum antibiotic used to treat bacterial infections',
      price: 12.99,
      activeIngredient: 'amoxicillin',
      contraindications: ['penicillin allergy'],
      barcode: '8901234567890',
    },
    {
      id: 'med2',
      name: 'Lisinopril',
      dosageForm: 'Tablet',
      strength: '10mg',
      category: 'Antihypertensive',
      description: 'ACE inhibitor used to treat high blood pressure',
      price: 8.50,
      activeIngredient: 'lisinopril',
      contraindications: ['pregnancy', 'angioedema history'],
    },
    {
      id: 'med3',
      name: 'Metformin',
      dosageForm: 'Tablet',
      strength: '500mg',
      category: 'Antidiabetic',
      description: 'Used to treat type 2 diabetes',
      price: 7.25,
      activeIngredient: 'metformin hydrochloride',
    },
    {
      id: 'med4',
      name: 'Atorvastatin',
      dosageForm: 'Tablet',
      strength: '20mg',
      category: 'Antilipemic',
      description: 'Statin medication used to lower cholesterol',
      price: 15.75,
      activeIngredient: 'atorvastatin calcium',
    },
    {
      id: 'med5',
      name: 'Amoxicillin Suspension',
      dosageForm: 'Oral suspension',
      strength: '250mg/5ml',
      category: 'Antibiotics',
      description: 'Liquid antibiotic for children and adults with swallowing difficulty',
      price: 18.50,
      activeIngredient: 'amoxicillin',
      contraindications: ['penicillin allergy'],
    },
  ];
}

async function getMockInventory(): Promise<InventoryItem[]> {
  const medications = await getMockMedications();
  
  return [
    {
      id: 'inv1',
      medication: medications[0], // Amoxicillin
      batchNumber: 'B12345',
      currentQuantity: 120,
      minQuantity: 20,
      expiryDate: '2025-12-31',
      manufacturer: 'ABC Pharmaceuticals',
      purchaseDate: '2023-06-15',
      purchasePrice: 10.50,
      location: 'Shelf A1',
    },
    {
      id: 'inv2',
      medication: medications[1], // Lisinopril
      batchNumber: 'B67890',
      currentQuantity: 85,
      minQuantity: 30,
      expiryDate: '2025-10-15',
      manufacturer: 'XYZ Pharma',
      purchaseDate: '2023-08-10',
      purchasePrice: 7.25,
      location: 'Shelf B2',
    },
    {
      id: 'inv3',
      medication: medications[2], // Metformin
      currentQuantity: 5, // Low stock
      minQuantity: 20,
      batchNumber: 'B54321',
      expiryDate: '2025-11-20',
      manufacturer: 'Health Pharmaceuticals',
      purchaseDate: '2023-07-05',
      purchasePrice: 6.00,
      location: 'Shelf C3',
    },
    {
      id: 'inv4',
      medication: medications[3], // Atorvastatin
      batchNumber: 'B98765',
      currentQuantity: 75,
      minQuantity: 15,
      expiryDate: '2024-07-01', // Soon expiring
      manufacturer: 'Medico Labs',
      purchaseDate: '2023-09-20',
      purchasePrice: 13.40,
      location: 'Shelf A4',
    },
    {
      id: 'inv5',
      medication: medications[4], // Amoxicillin Suspension
      batchNumber: 'B13579',
      currentQuantity: 30,
      minQuantity: 10,
      expiryDate: '2025-08-25',
      manufacturer: 'ABC Pharmaceuticals',
      purchaseDate: '2023-10-10',
      purchasePrice: 16.00,
      location: 'Refrigerator 1',
    },
  ];
}

async function getMockPrescriptions(): Promise<Prescription[]> {
  const medications = await getMockMedications();
  
  return [
    {
      id: 'presc1',
      patient: {
        id: 'pat1',
        name: 'John Smith',
        contactNumber: '+91 9876543210',
      },
      doctor: {
        id: 'doc1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Internal Medicine',
      },
      medications: [
        {
          medication: medications[0], // Amoxicillin
          quantity: 21,
          dosage: '1 capsule',
          frequency: 'three times daily',
          duration: '7 days',
          notes: 'Take with food',
        },
      ],
      date: '2023-11-10',
      status: 'pending',
    },
    {
      id: 'presc2',
      patient: {
        id: 'pat2',
        name: 'Emma Wilson',
        contactNumber: '+91 9876543211',
      },
      doctor: {
        id: 'doc2',
        name: 'Dr. Michael Brown',
        specialization: 'Cardiology',
      },
      medications: [
        {
          medication: medications[1], // Lisinopril
          quantity: 30,
          dosage: '1 tablet',
          frequency: 'once daily',
          duration: '30 days',
          notes: 'Take in the morning',
        },
        {
          medication: medications[3], // Atorvastatin
          quantity: 30,
          dosage: '1 tablet',
          frequency: 'once daily at bedtime',
          duration: '30 days',
        },
      ],
      date: '2023-11-09',
      status: 'pending',
    },
    {
      id: 'presc3',
      patient: {
        id: 'pat3',
        name: 'Robert Johnson',
        contactNumber: '+91 9876543212',
      },
      doctor: {
        id: 'doc3',
        name: 'Dr. Jessica Lee',
        specialization: 'Endocrinology',
      },
      medications: [
        {
          medication: medications[2], // Metformin
          quantity: 60,
          dosage: '1 tablet',
          frequency: 'twice daily with meals',
          duration: '30 days',
        },
      ],
      date: '2023-11-08',
      status: 'filled',
      dispensingNotes: 'Patient counseled on potential side effects',
      dispensedBy: 'pharm1',
      dispensedAt: '2023-11-08T15:30:00',
    },
  ];
}