import { Doctor } from '@/types/doctor';

export async function getDoctors(): Promise<Doctor[]> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'doctor1',
          name: 'Dr. John Smith',
          specialty: 'Cardiologist',
          experience: 12,
          location: 'Delhi',
          imageUrl: '/doctor1.jpg',
          email: 'doctor@test.com',
          supportsTeleconsultation: true
        },
        {
          id: 'doctor2',
          name: 'Dr. Sarah Johnson',
          specialty: 'Neurologist',
          experience: 8,
          location: 'Mumbai',
          imageUrl: '/doctor2.jpg',
          email: 'sarah@hospital.com',
          supportsTeleconsultation: true
        },
        {
          id: 'doctor3',
          name: 'Dr. OPD Doctor',
          specialty: 'General Medicine',
          experience: 10,
          location: 'Bangalore',
          imageUrl: '/doctor3.jpg',
          email: 'doctor@opd.com',
          supportsTeleconsultation: true
        },
        {
          id: '4',
          name: 'Dr. Anjali Mehra',
          specialty: 'Cardiologist',
          experience: 12,
          location: 'Delhi',
          imageUrl: '/doctor4.jpg',
          supportsTeleconsultation: false
        },
        {
          id: '5',
          name: 'Dr. Ravi Kapoor',
          specialty: 'Dermatologist',
          experience: 8,
          location: 'Mumbai',
          imageUrl: '/doctor5.jpg',
          supportsTeleconsultation: true
        },
      ]);
    }, 300); // Reduced delay for better UX
  });
}