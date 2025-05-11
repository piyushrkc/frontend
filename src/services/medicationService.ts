import api from '@/lib/api';

// Types for medication service
export type Medication = {
  id: string;
  genericName: string;
  brandNames: string[];
  category: string;
  dosageForms: DosageForm[];
  isScheduleH: boolean;
  isScheduleH1: boolean;
  isControlled: boolean;
  interactions: string[];
  contraindications: string[];
  sideEffects: string[];
};

export type DosageForm = {
  form: string; // tablet, capsule, syrup, etc.
  strength: string; // 500mg, 5mg/ml, etc.
  recommendedDosages: {
    adult: string;
    pediatric: string;
    geriatric: string;
  };
};

export type PrescriptionTemplate = {
  id: string;
  name: string;
  diagnosis: string;
  medications: {
    medicationId: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  notes: string;
  createdBy: string;
  createdAt: string;
  specialty?: string;
  isFavorite: boolean;
};

// For local development and testing
const USE_MOCK_DATA = true;

// Mock medication database
const mockMedications: Medication[] = [
  {
    id: 'med1',
    genericName: 'paracetamol',
    brandNames: ['Calpol', 'Dolo', 'Panadol', 'Tylenol'],
    category: 'Analgesic & Antipyretic',
    dosageForms: [
      {
        form: 'tablet',
        strength: '500mg',
        recommendedDosages: {
          adult: '500-1000mg every 4-6 hours as needed, max 4g/day',
          pediatric: '10-15mg/kg/dose every 4-6 hours as needed',
          geriatric: '500mg every 4-6 hours as needed, max 3g/day'
        }
      },
      {
        form: 'syrup',
        strength: '125mg/5ml',
        recommendedDosages: {
          adult: '10-20ml every 4-6 hours as needed',
          pediatric: '0.5ml/kg/dose every 4-6 hours as needed',
          geriatric: '10ml every 4-6 hours as needed'
        }
      }
    ],
    isScheduleH: false,
    isScheduleH1: false,
    isControlled: false,
    interactions: ['Warfarin (increased anticoagulant effect with prolonged use)'],
    contraindications: ['Severe hepatic impairment', 'Hypersensitivity to paracetamol'],
    sideEffects: ['Nausea', 'Rash', 'Hepatotoxicity (with overdose)']
  },
  {
    id: 'med2',
    genericName: 'amoxicillin',
    brandNames: ['Mox', 'Novamox', 'Amoxil'],
    category: 'Antibiotic',
    dosageForms: [
      {
        form: 'capsule',
        strength: '250mg',
        recommendedDosages: {
          adult: '250-500mg every 8 hours',
          pediatric: '20-40mg/kg/day divided every 8 hours',
          geriatric: '250-500mg every 8 hours, adjust for renal function'
        }
      },
      {
        form: 'capsule',
        strength: '500mg',
        recommendedDosages: {
          adult: '500mg every 8 hours',
          pediatric: '20-40mg/kg/day divided every 8 hours',
          geriatric: '500mg every 8 hours, adjust for renal function'
        }
      },
      {
        form: 'syrup',
        strength: '125mg/5ml',
        recommendedDosages: {
          adult: '10-20ml every 8 hours',
          pediatric: '0.75-1.5ml/kg/day divided every 8 hours',
          geriatric: '10-20ml every 8 hours, adjust for renal function'
        }
      }
    ],
    isScheduleH: true,
    isScheduleH1: false,
    isControlled: false,
    interactions: ['Allopurinol (increased risk of rash)', 'Oral contraceptives (decreased efficacy)'],
    contraindications: ['Penicillin allergy', 'History of penicillin-associated cholestatic jaundice'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Antibiotic-associated colitis']
  },
  {
    id: 'med3',
    genericName: 'cetirizine',
    brandNames: ['Zyrtec', 'Alerid', 'Cetzine'],
    category: 'Antihistamine',
    dosageForms: [
      {
        form: 'tablet',
        strength: '10mg',
        recommendedDosages: {
          adult: '10mg once daily',
          pediatric: '5-10mg once daily depending on age',
          geriatric: '5mg once daily'
        }
      },
      {
        form: 'syrup',
        strength: '5mg/5ml',
        recommendedDosages: {
          adult: '10ml once daily',
          pediatric: '5-10ml once daily depending on age',
          geriatric: '5ml once daily'
        }
      }
    ],
    isScheduleH: false,
    isScheduleH1: false,
    isControlled: false,
    interactions: ['CNS depressants (additive sedation)'],
    contraindications: ['Hypersensitivity to cetirizine or hydroxyzine', 'Severe renal impairment'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue']
  },
  {
    id: 'med4',
    genericName: 'omeprazole',
    brandNames: ['Omez', 'Prilosec', 'Ocid'],
    category: 'Proton Pump Inhibitor',
    dosageForms: [
      {
        form: 'capsule',
        strength: '20mg',
        recommendedDosages: {
          adult: '20mg once daily before breakfast',
          pediatric: '0.5-1.0mg/kg once daily',
          geriatric: '20mg once daily before breakfast'
        }
      },
      {
        form: 'capsule',
        strength: '40mg',
        recommendedDosages: {
          adult: '40mg once daily before breakfast',
          pediatric: 'Not recommended',
          geriatric: '20mg once daily before breakfast'
        }
      }
    ],
    isScheduleH: true,
    isScheduleH1: false,
    isControlled: false,
    interactions: ['Clopidogrel (reduced antiplatelet effect)', 'Diazepam (increased levels)'],
    contraindications: ['Hypersensitivity to proton pump inhibitors'],
    sideEffects: ['Headache', 'Abdominal pain', 'Diarrhea', 'Nausea']
  },
  {
    id: 'med5',
    genericName: 'azithromycin',
    brandNames: ['Azee', 'Zithromax', 'Azithral'],
    category: 'Antibiotic',
    dosageForms: [
      {
        form: 'tablet',
        strength: '250mg',
        recommendedDosages: {
          adult: '500mg on day 1, then 250mg once daily for 4 days',
          pediatric: '10mg/kg on day 1, then 5mg/kg once daily for 4 days',
          geriatric: '500mg on day 1, then 250mg once daily for 4 days'
        }
      },
      {
        form: 'tablet',
        strength: '500mg',
        recommendedDosages: {
          adult: '500mg once daily for 3 days',
          pediatric: '10mg/kg once daily for 3 days',
          geriatric: '500mg once daily for 3 days'
        }
      }
    ],
    isScheduleH: true,
    isScheduleH1: false,
    isControlled: false,
    interactions: ['QT prolonging medications', 'Antacids containing aluminum or magnesium'],
    contraindications: ['Hypersensitivity to azithromycin or macrolide antibiotics', 'History of cholestatic jaundice/hepatic dysfunction with azithromycin'],
    sideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain', 'QT prolongation (rare)']
  },
  {
    id: 'med6',
    genericName: 'metformin',
    brandNames: ['Glycomet', 'Glumet', 'Glucophage'],
    category: 'Anti-diabetic',
    dosageForms: [
      {
        form: 'tablet',
        strength: '500mg',
        recommendedDosages: {
          adult: '500mg twice daily with meals, may increase to 1000mg twice daily',
          pediatric: 'Not recommended for children under 10 years',
          geriatric: 'Start at 250-500mg daily, adjust based on renal function'
        }
      },
      {
        form: 'tablet',
        strength: '850mg',
        recommendedDosages: {
          adult: '850mg once or twice daily with meals',
          pediatric: 'Not recommended for children under 10 years',
          geriatric: 'Not recommended as initial therapy'
        }
      }
    ],
    isScheduleH: true,
    isScheduleH1: false,
    isControlled: false,
    interactions: ['Iodinated contrast media', 'Alcohol', 'Cimetidine'],
    contraindications: ['Renal dysfunction', 'Metabolic acidosis', 'Severe infection'],
    sideEffects: ['Diarrhea', 'Nausea', 'Abdominal discomfort', 'Lactic acidosis (rare)']
  },
  {
    id: 'med7',
    genericName: 'amlodipine',
    brandNames: ['Amlong', 'Amlod', 'Norvasc'],
    category: 'Calcium Channel Blocker',
    dosageForms: [
      {
        form: 'tablet',
        strength: '5mg',
        recommendedDosages: {
          adult: '5mg once daily, may increase to 10mg',
          pediatric: '2.5-5mg once daily',
          geriatric: 'Start with 2.5mg once daily'
        }
      },
      {
        form: 'tablet',
        strength: '10mg',
        recommendedDosages: {
          adult: '10mg once daily',
          pediatric: 'Not recommended',
          geriatric: 'Start with 2.5-5mg once daily'
        }
      }
    ],
    isScheduleH: true,
    isScheduleH1: false,
    isControlled: false,
    interactions: ['Simvastatin (increased levels)', 'CYP3A4 inhibitors'],
    contraindications: ['Severe hypotension', 'Aortic stenosis', 'Cardiogenic shock'],
    sideEffects: ['Peripheral edema', 'Dizziness', 'Flushing', 'Headache']
  }
];

// Mock prescription templates
const mockTemplates: PrescriptionTemplate[] = [
  {
    id: 'template1',
    name: 'Adult Viral Fever',
    diagnosis: 'Viral fever',
    medications: [
      {
        medicationId: 'med1',
        dosage: '500mg',
        frequency: 'TID',
        duration: '5 days',
        instructions: 'After food'
      },
      {
        medicationId: 'med3',
        dosage: '10mg',
        frequency: 'OD',
        duration: '3 days',
        instructions: 'At night'
      }
    ],
    notes: 'Plenty of fluids, Rest advised for 3 days',
    createdBy: 'Dr. John Doe',
    createdAt: '2025-05-01',
    specialty: 'General Medicine',
    isFavorite: true
  },
  {
    id: 'template2',
    name: 'Adult Respiratory Infection',
    diagnosis: 'Acute bronchitis',
    medications: [
      {
        medicationId: 'med2',
        dosage: '500mg',
        frequency: 'TID',
        duration: '5 days',
        instructions: 'After food'
      },
      {
        medicationId: 'med1',
        dosage: '500mg',
        frequency: 'TID',
        duration: '3 days',
        instructions: 'If fever/pain'
      },
      {
        medicationId: 'med3',
        dosage: '10mg',
        frequency: 'OD',
        duration: '5 days',
        instructions: 'At night'
      }
    ],
    notes: 'Steam inhalation thrice daily, Avoid cold food/drinks',
    createdBy: 'Dr. John Doe',
    createdAt: '2025-05-10',
    specialty: 'General Medicine',
    isFavorite: false
  },
  {
    id: 'template3',
    name: 'Gastritis',
    diagnosis: 'Acute gastritis',
    medications: [
      {
        medicationId: 'med4',
        dosage: '20mg',
        frequency: 'BID',
        duration: '7 days',
        instructions: 'Before breakfast and dinner'
      },
      {
        medicationId: 'med1',
        dosage: '500mg',
        frequency: 'TID',
        duration: '3 days',
        instructions: 'If pain present'
      }
    ],
    notes: 'Avoid spicy foods, alcohol and smoking. Small frequent meals advised.',
    createdBy: 'Dr. John Doe',
    createdAt: '2025-06-01',
    specialty: 'Gastroenterology',
    isFavorite: true
  }
];

// Function to search medications
export async function searchMedications(
  query: string,
  options: { 
    includeGeneric?: boolean; 
    includeBrand?: boolean;
    category?: string;
  } = { includeGeneric: true, includeBrand: true }
): Promise<Medication[]> {
  if (USE_MOCK_DATA) {
    const lowerQuery = query.toLowerCase();
    return mockMedications.filter(med => {
      // Search by generic name
      if (options.includeGeneric && med.genericName.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Search by brand names
      if (options.includeBrand && med.brandNames.some(brand => brand.toLowerCase().includes(lowerQuery))) {
        return true;
      }
      
      // Filter by category if provided
      if (options.category && med.category !== options.category) {
        return false;
      }
      
      return false;
    });
  } else {
    // Real API implementation would go here
    const response = await api.get('/medications/search', { 
      params: { 
        query,
        includeGeneric: options.includeGeneric,
        includeBrand: options.includeBrand,
        category: options.category
      } 
    });
    return response.data;
  }
}

// Function to get medication details
export async function getMedicationDetails(medicationId: string): Promise<Medication | null> {
  if (USE_MOCK_DATA) {
    const medication = mockMedications.find(med => med.id === medicationId);
    return medication || null;
  } else {
    try {
      const response = await api.get(`/medications/${medicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medication details:', error);
      return null;
    }
  }
}

// Function to get common medications
export async function getCommonMedications(): Promise<Medication[]> {
  if (USE_MOCK_DATA) {
    // Return a subset of medications that are commonly used
    return mockMedications.slice(0, 5);
  } else {
    const response = await api.get('/medications/common');
    return response.data;
  }
}

// Function to get prescription templates
export async function getPrescriptionTemplates(
  options: { specialty?: string; favoriteOnly?: boolean } = {}
): Promise<PrescriptionTemplate[]> {
  if (USE_MOCK_DATA) {
    let templates = [...mockTemplates];
    
    // Filter by specialty if provided
    if (options.specialty) {
      templates = templates.filter(template => template.specialty === options.specialty);
    }
    
    // Filter by favorite status if requested
    if (options.favoriteOnly) {
      templates = templates.filter(template => template.isFavorite);
    }
    
    return templates;
  } else {
    const response = await api.get('/prescriptions/templates', { params: options });
    return response.data;
  }
}

// Function to save a prescription template
export async function savePrescriptionTemplate(template: Omit<PrescriptionTemplate, 'id' | 'createdAt'>): Promise<PrescriptionTemplate> {
  if (USE_MOCK_DATA) {
    const newTemplate: PrescriptionTemplate = {
      ...template,
      id: `template${mockTemplates.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    mockTemplates.push(newTemplate);
    return newTemplate;
  } else {
    const response = await api.post('/prescriptions/templates', template);
    return response.data;
  }
}

// Function to toggle template favorite status
export async function toggleTemplateFavorite(templateId: string, isFavorite: boolean): Promise<boolean> {
  if (USE_MOCK_DATA) {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      template.isFavorite = isFavorite;
      return true;
    }
    return false;
  } else {
    await api.patch(`/prescriptions/templates/${templateId}/favorite`, { isFavorite });
    return true;
  }
}

// Export the default object with all functions
export default {
  searchMedications,
  getMedicationDetails,
  getCommonMedications,
  getPrescriptionTemplates,
  savePrescriptionTemplate,
  toggleTemplateFavorite
};