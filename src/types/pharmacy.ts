// Medication Types
export type Medication = {
  id: string;
  name: string;
  brandName: string;  // Brand/commercial name
  genericName: string; // Generic name/active ingredient
  dosageForm: string; // tablet, capsule, syrup, etc.
  strength: string;
  category: string;
  description?: string;
  price: number;
  manufacturer?: string;
  activeIngredient: string;
  contraindications?: string[];
  barcode?: string;
  alternatives?: string[]; // IDs of alternative medications
  isGeneric?: boolean;     // Whether this is a generic medication
  isActive?: boolean;      // Whether this medication is active in inventory
};

// Inventory Types
export type InventoryItem = {
  id: string;
  medication: Medication;
  batchNumber: string;
  currentQuantity: number;
  minQuantity: number;
  expiryDate: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: number;
  location?: string;
};

export type Transaction = {
  id: string;
  adjustment: number;
  reason: string;
  performedBy: string;
  date: string;
};

// Prescription Types
export type PrescriptionMedication = {
  medication: Medication;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
};

export type Prescription = {
  id: string;
  patient: {
    id: string;
    name: string;
    contactNumber?: string;
  };
  doctor: {
    id: string;
    name: string;
    specialization?: string;
  };
  medications: PrescriptionMedication[];
  date: string;
  status: 'pending' | 'filled' | 'cancelled';
  dispensingNotes?: string;
  dispensedBy?: string;
  dispensedAt?: string;
};

// Alert Types
export type InventoryAlert = {
  id: string;
  type: 'low_stock' | 'expiring';
  message: string;
  inventoryItem: InventoryItem;
  date: string;
  resolved: boolean;
};

// Input Types
export type MedicationInput = Omit<Medication, 'id'>;
export type InventoryInput = Omit<InventoryItem, 'id' | 'medication'> & { medicationId: string };
export type PrescriptionProcessInput = {
  status: 'filled' | 'cancelled';
  notes?: string;
};