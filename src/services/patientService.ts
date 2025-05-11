import api from '@/lib/api';
import { Patient, PatientFilter, Visit, MedicalHistory, Allergy, Vitals, PatientStats } from '@/types/patient';

// For local development and testing
const USE_MOCK_DATA = true;

// Mock patients data
const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    contactNumber: '+91 9876543210',
    email: 'john.smith@example.com',
    address: '123 Main St, Bangalore',
    bloodGroup: 'O+',
    registrationDate: '2024-01-15',
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      contactNumber: '+91 9876543211'
    },
    medicalHistory: {
      allergies: [
        {
          id: 'a1',
          name: 'Penicillin',
          type: 'Drug',
          severity: 'Moderate',
          reaction: 'Rash and hives',
          dateIdentified: '2018-05-12'
        }
      ],
      chronicConditions: [
        {
          id: 'cc1',
          condition: 'Hypertension',
          diagnosedDate: '2020-03-15',
          status: 'Managed',
          notes: 'Controlled with medication'
        }
      ],
      pastSurgeries: [],
      familyHistory: [
        {
          id: 'fh1',
          condition: 'Diabetes',
          relationship: 'Father',
          notes: 'Type 2, diagnosed at age 50'
        }
      ],
      immunizations: [],
      medications: [
        {
          id: 'cm1',
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          startDate: '2020-03-20',
          prescribedBy: 'Dr. Jane Wilson',
          reason: 'Hypertension'
        }
      ]
    }
  },
  {
    id: 'p2',
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    contactNumber: '+91 9876543212',
    email: 'sarah.j@example.com',
    address: '456 Park Avenue, Mumbai',
    bloodGroup: 'B+',
    registrationDate: '2023-11-10',
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      pastSurgeries: [
        {
          id: 'ps1',
          procedure: 'Appendectomy',
          date: '2015-07-22',
          hospital: 'City General Hospital',
          notes: 'No complications'
        }
      ],
      familyHistory: [],
      immunizations: [],
      medications: []
    }
  },
  {
    id: 'p3',
    name: 'Michael Brown',
    age: 52,
    gender: 'Male',
    contactNumber: '+91 9876543213',
    email: 'michael.b@example.com',
    address: '789 Lake View, Delhi',
    bloodGroup: 'AB-',
    registrationDate: '2022-06-05',
    emergencyContact: {
      name: 'Robert Brown',
      relationship: 'Son',
      contactNumber: '+91 9876543214'
    },
    medicalHistory: {
      allergies: [
        {
          id: 'a2',
          name: 'Peanuts',
          type: 'Food',
          severity: 'Severe',
          reaction: 'Anaphylaxis',
          dateIdentified: '2010-01-10'
        }
      ],
      chronicConditions: [
        {
          id: 'cc2',
          condition: 'Type 2 Diabetes',
          diagnosedDate: '2018-05-12',
          status: 'Active',
          notes: 'Managed with oral medication and diet'
        },
        {
          id: 'cc3',
          condition: 'Hyperlipidemia',
          diagnosedDate: '2019-11-30',
          status: 'Active',
          notes: 'On statins'
        }
      ],
      pastSurgeries: [],
      familyHistory: [],
      immunizations: [],
      medications: [
        {
          id: 'cm2',
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          startDate: '2018-05-20',
          prescribedBy: 'Dr. Robert Miller',
          reason: 'Diabetes'
        },
        {
          id: 'cm3',
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily',
          startDate: '2019-12-10',
          prescribedBy: 'Dr. Robert Miller',
          reason: 'Hyperlipidemia'
        }
      ]
    }
  },
  {
    id: 'p4',
    name: 'Emma Wilson',
    age: 28,
    gender: 'Female',
    contactNumber: '+91 9876543215',
    email: 'emma.w@example.com',
    address: '101 Hill Road, Chennai',
    bloodGroup: 'A+',
    registrationDate: '2024-05-01',
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      pastSurgeries: [],
      familyHistory: [],
      immunizations: [],
      medications: []
    }
  }
];

// Mock visits data
const mockVisits: Visit[] = [
  {
    id: 'v1',
    patientId: 'p1',
    date: '2025-04-20',
    reason: 'Fever and cough',
    notes: 'Patient has had fever for 3 days with dry cough',
    doctorId: 'd1',
    doctorName: 'Dr. Robert Miller',
    diagnosis: 'Viral upper respiratory infection',
    prescription: {
      id: 'pr1',
      visitId: 'v1',
      patientId: 'p1',
      doctorId: 'd1',
      date: '2025-04-20',
      diagnosis: 'Viral upper respiratory infection',
      medications: [
        {
          id: 'm1',
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'TID',
          duration: '5 days',
          instructions: 'After food'
        },
        {
          id: 'm2',
          name: 'Cetirizine',
          dosage: '10mg',
          frequency: 'OD',
          duration: '3 days',
          instructions: 'At night'
        }
      ],
      notes: 'Plenty of fluids, rest advised'
    },
    vitals: {
      temperature: '99.6°F',
      pulse: '88',
      bloodPressure: '122/78',
      respiratoryRate: '18',
      oxygenSaturation: '97%',
      weight: '72kg',
      recordedAt: '2025-04-20T10:15:00',
      recordedBy: 'Nurse Johnson'
    },
    followUpDate: '2025-04-25',
    status: 'Completed'
  },
  {
    id: 'v2',
    patientId: 'p1',
    date: '2025-03-15',
    reason: 'Annual checkup',
    notes: 'Routine annual health assessment',
    doctorId: 'd1',
    doctorName: 'Dr. Robert Miller',
    diagnosis: 'Hypertension, well controlled',
    prescription: {
      id: 'pr2',
      visitId: 'v2',
      patientId: 'p1',
      doctorId: 'd1',
      date: '2025-03-15',
      diagnosis: 'Hypertension, well controlled',
      medications: [
        {
          id: 'm3',
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'OD',
          duration: '30 days',
          instructions: 'Morning after breakfast'
        }
      ],
      notes: 'Continue current lifestyle modifications'
    },
    vitals: {
      temperature: '98.4°F',
      pulse: '76',
      bloodPressure: '128/82',
      respiratoryRate: '16',
      oxygenSaturation: '98%',
      weight: '73kg',
      recordedAt: '2025-03-15T11:30:00',
      recordedBy: 'Nurse Wilson'
    },
    followUpDate: '2025-09-15',
    status: 'Completed'
  },
  {
    id: 'v3',
    patientId: 'p2',
    date: '2025-05-10',
    reason: 'Abdominal pain',
    notes: 'Patient reports intermittent abdominal pain for the past week',
    doctorId: 'd2',
    doctorName: 'Dr. Jane Wilson',
    diagnosis: 'Acute gastritis',
    prescription: {
      id: 'pr3',
      visitId: 'v3',
      patientId: 'p2',
      doctorId: 'd2',
      date: '2025-05-10',
      diagnosis: 'Acute gastritis',
      medications: [
        {
          id: 'm4',
          name: 'Pantoprazole',
          dosage: '40mg',
          frequency: 'OD',
          duration: '14 days',
          instructions: 'Before breakfast'
        },
        {
          id: 'm5',
          name: 'Domperidone',
          dosage: '10mg',
          frequency: 'TID',
          duration: '7 days',
          instructions: 'Before meals'
        }
      ],
      notes: 'Avoid spicy food, alcohol, and NSAIDs'
    },
    vitals: {
      temperature: '98.8°F',
      pulse: '82',
      bloodPressure: '110/70',
      respiratoryRate: '16',
      oxygenSaturation: '99%',
      weight: '58kg',
      recordedAt: '2025-05-10T14:45:00',
      recordedBy: 'Nurse Johnson'
    },
    followUpDate: '2025-05-24',
    status: 'Completed'
  },
  {
    id: 'v4',
    patientId: 'p3',
    date: '2025-05-05',
    reason: 'Diabetes follow-up',
    notes: 'Regular follow-up for diabetes management',
    doctorId: 'd1',
    doctorName: 'Dr. Robert Miller',
    diagnosis: 'Type 2 Diabetes, moderate control',
    prescription: {
      id: 'pr4',
      visitId: 'v4',
      patientId: 'p3',
      doctorId: 'd1',
      date: '2025-05-05',
      diagnosis: 'Type 2 Diabetes, moderate control',
      medications: [
        {
          id: 'm6',
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'BID',
          duration: '90 days',
          instructions: 'With meals'
        },
        {
          id: 'm7',
          name: 'Glimepiride',
          dosage: '2mg',
          frequency: 'OD',
          duration: '90 days',
          instructions: 'Before breakfast'
        }
      ],
      notes: 'Continue diet and exercise regimen, monitor blood glucose levels daily'
    },
    vitals: {
      temperature: '98.2°F',
      pulse: '78',
      bloodPressure: '138/88',
      respiratoryRate: '17',
      oxygenSaturation: '96%',
      weight: '84kg',
      recordedAt: '2025-05-05T09:30:00',
      recordedBy: 'Nurse Wilson'
    },
    followUpDate: '2025-08-05',
    status: 'Completed'
  },
  {
    id: 'v5',
    patientId: 'p4',
    date: '2025-05-01',
    reason: 'First consultation',
    notes: 'New patient registration and initial consultation',
    doctorId: 'd2',
    doctorName: 'Dr. Jane Wilson',
    diagnosis: 'Healthy individual',
    prescription: {
      id: 'pr5',
      visitId: 'v5',
      patientId: 'p4',
      doctorId: 'd2',
      date: '2025-05-01',
      diagnosis: 'Healthy individual',
      medications: [],
      notes: 'Routine health maintenance, recommended annual checkup'
    },
    vitals: {
      temperature: '98.6°F',
      pulse: '72',
      bloodPressure: '118/76',
      respiratoryRate: '14',
      oxygenSaturation: '99%',
      weight: '62kg',
      height: '168cm',
      recordedAt: '2025-05-01T16:15:00',
      recordedBy: 'Nurse Johnson'
    },
    status: 'Completed'
  }
];

// Mock patient stats
const mockPatientStats: PatientStats = {
  totalPatients: 450,
  newPatientsToday: 8,
  newPatientsThisWeek: 32,
  newPatientsThisMonth: 87,
  genderDistribution: {
    male: 215,
    female: 230,
    other: 5
  },
  ageDistribution: {
    under18: 85,
    between18And30: 108,
    between31And45: 125,
    between46And60: 82,
    above60: 50
  }
};

// Function to get patients
export async function getPatients(filters?: PatientFilter): Promise<Patient[]> {
  if (USE_MOCK_DATA) {
    let filteredPatients = [...mockPatients];
    
    if (filters) {
      // Apply search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredPatients = filteredPatients.filter(
          patient => patient.name.toLowerCase().includes(query) || 
                    patient.id.toLowerCase().includes(query) ||
                    (patient.email && patient.email.toLowerCase().includes(query))
        );
      }
      
      // Apply gender filter
      if (filters.gender) {
        filteredPatients = filteredPatients.filter(patient => patient.gender === filters.gender);
      }
      
      // Apply age range filter
      if (filters.ageMin !== undefined) {
        filteredPatients = filteredPatients.filter(patient => patient.age >= filters.ageMin!);
      }
      
      if (filters.ageMax !== undefined) {
        filteredPatients = filteredPatients.filter(patient => patient.age <= filters.ageMax!);
      }
      
      // Apply blood group filter
      if (filters.bloodGroup) {
        filteredPatients = filteredPatients.filter(patient => patient.bloodGroup === filters.bloodGroup);
      }
      
      // Apply registration date filters
      if (filters.registrationDateFrom) {
        filteredPatients = filteredPatients.filter(
          patient => new Date(patient.registrationDate) >= new Date(filters.registrationDateFrom!)
        );
      }
      
      if (filters.registrationDateTo) {
        filteredPatients = filteredPatients.filter(
          patient => new Date(patient.registrationDate) <= new Date(filters.registrationDateTo!)
        );
      }
      
      // Apply chronic condition filter
      if (filters.chronicCondition) {
        const condition = filters.chronicCondition.toLowerCase();
        filteredPatients = filteredPatients.filter(
          patient => patient.medicalHistory?.chronicConditions.some(
            cc => cc.condition.toLowerCase().includes(condition)
          )
        );
      }
    }
    
    return filteredPatients;
  } else {
    const response = await api.get('/patients', { params: filters });
    return response.data;
  }
}

// Function to get patient details
export async function getPatientById(patientId: string): Promise<Patient | null> {
  if (USE_MOCK_DATA) {
    const patient = mockPatients.find(patient => patient.id === patientId);
    return patient || null;
  } else {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  }
}

// Function to get patient visits
export async function getPatientVisits(patientId: string): Promise<Visit[]> {
  if (USE_MOCK_DATA) {
    return mockVisits.filter(visit => visit.patientId === patientId);
  } else {
    const response = await api.get(`/patients/${patientId}/visits`);
    return response.data;
  }
}

// Function to get patient medical history
export async function getPatientMedicalHistory(patientId: string): Promise<MedicalHistory | null> {
  if (USE_MOCK_DATA) {
    const patient = mockPatients.find(patient => patient.id === patientId);
    return patient?.medicalHistory || null;
  } else {
    try {
      const response = await api.get(`/patients/${patientId}/medical-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient medical history:', error);
      return null;
    }
  }
}

// Function to add allergy to patient
export async function addPatientAllergy(patientId: string, allergy: Omit<Allergy, 'id'>): Promise<boolean> {
  if (USE_MOCK_DATA) {
    const patient = mockPatients.find(patient => patient.id === patientId);
    if (patient && patient.medicalHistory) {
      const newAllergy: Allergy = {
        ...allergy,
        id: `a${Date.now()}`
      };
      patient.medicalHistory.allergies.push(newAllergy);
      return true;
    }
    return false;
  } else {
    try {
      await api.post(`/patients/${patientId}/allergies`, allergy);
      return true;
    } catch (error) {
      console.error('Error adding patient allergy:', error);
      return false;
    }
  }
}

// Function to record patient vitals
export async function recordPatientVitals(patientId: string, visitId: string, vitals: Omit<Vitals, 'recordedAt' | 'recordedBy'>): Promise<boolean> {
  if (USE_MOCK_DATA) {
    const visit = mockVisits.find(visit => visit.id === visitId && visit.patientId === patientId);
    if (visit) {
      visit.vitals = {
        ...vitals,
        recordedAt: new Date().toISOString(),
        recordedBy: 'Current User'
      };
      return true;
    }
    return false;
  } else {
    try {
      await api.post(`/visits/${visitId}/vitals`, vitals);
      return true;
    } catch (error) {
      console.error('Error recording patient vitals:', error);
      return false;
    }
  }
}

// Function to get patient statistics
export async function getPatientStats(): Promise<PatientStats> {
  if (USE_MOCK_DATA) {
    return mockPatientStats;
  } else {
    const response = await api.get('/patients/stats');
    return response.data;
  }
}

// Export the default object with all functions
export default {
  getPatients,
  getPatientById,
  getPatientVisits,
  getPatientMedicalHistory,
  addPatientAllergy,
  recordPatientVitals,
  getPatientStats
};