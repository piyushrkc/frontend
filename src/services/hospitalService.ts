import api from '@/lib/api';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  website: string;
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
}

interface WorkingHour {
  start: string;
  end: string;
}

interface WorkingHours {
  monday: WorkingHour;
  tuesday: WorkingHour;
  wednesday: WorkingHour;
  thursday: WorkingHour;
  friday: WorkingHour;
  saturday: WorkingHour;
  sunday: WorkingHour;
}

interface HospitalSettings {
  theme?: ThemeSettings;
  workingHours?: Partial<WorkingHours>;
  appointmentDuration?: number;
  enableSMS?: boolean;
  enableEmailNotifications?: boolean;
}

export interface Hospital {
  _id: string;
  name: string;
  subdomain: string;
  address: Address;
  contactInfo: ContactInfo;
  type: 'private' | 'government' | 'nonprofit';
  size: 'small' | 'medium' | 'large';
  logo?: string;
  settings: HospitalSettings;
  isActive: boolean;
}

export interface DoctorDetails {
  id: string;
  firstName: string;
  lastName: string;
  qualification?: string;
  specialization?: string;
  licenseNumber?: string;
  gstNumber?: string;
  useClinicGST?: boolean;
}

// Get hospital details
export const getHospitalDetails = async (): Promise<Hospital> => {
  try {
    const response = await api.get('/hospital');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update hospital details
export const updateHospitalDetails = async (data: Partial<Hospital>): Promise<Hospital> => {
  try {
    const response = await api.put('/hospital', data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update doctor details
export const updateDoctorDetails = async (doctorId: string, data: Partial<DoctorDetails>): Promise<DoctorDetails> => {
  try {
    const response = await api.put(`/hospital/doctors/${doctorId}`, data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};