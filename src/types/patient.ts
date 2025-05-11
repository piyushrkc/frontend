export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  registrationDate: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  medicalHistory?: MedicalHistory;
}

export interface MedicalHistory {
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  pastSurgeries: PastSurgery[];
  familyHistory: FamilyHistory[];
  immunizations: Immunization[];
  medications: CurrentMedication[];
}

export interface Allergy {
  id: string;
  name: string;
  type: 'Drug' | 'Food' | 'Environmental' | 'Other';
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
  notes?: string;
  dateIdentified?: string;
}

export interface ChronicCondition {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: 'Active' | 'Managed' | 'Resolved';
  notes?: string;
}

export interface PastSurgery {
  id: string;
  procedure: string;
  date: string;
  hospital?: string;
  surgeon?: string;
  notes?: string;
}

export interface FamilyHistory {
  id: string;
  condition: string;
  relationship: string;
  notes?: string;
}

export interface Immunization {
  id: string;
  name: string;
  date: string;
  dueDate?: string;
  notes?: string;
}

export interface CurrentMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  reason?: string;
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  reason: string;
  notes: string;
  doctorId: string;
  doctorName: string;
  diagnosis?: string;
  prescription?: Prescription;
  vitals?: Vitals;
  followUpDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Prescription {
  id: string;
  visitId: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  medications: PrescribedMedication[];
  notes?: string;
  followUpDate?: string;
  isPrescriptionUploaded?: boolean;
  prescriptionImageUrl?: string;
}

export interface PrescribedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  isScheduleH?: boolean;
  isScheduleH1?: boolean;
}

export interface Vitals {
  temperature?: string;
  bloodPressure?: string;
  pulse?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  painLevel?: number;
  recordedAt: string;
  recordedBy: string;
}

export interface PatientFilter {
  searchQuery?: string;
  gender?: string;
  ageMin?: number;
  ageMax?: number;
  bloodGroup?: string;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  chronicCondition?: string;
}

export interface PatientStats {
  totalPatients: number;
  newPatientsToday: number;
  newPatientsThisWeek: number;
  newPatientsThisMonth: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  ageDistribution: {
    under18: number;
    between18And30: number;
    between31And45: number;
    between46And60: number;
    above60: number;
  };
}