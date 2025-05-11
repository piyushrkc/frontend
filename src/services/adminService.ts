import { Doctor } from '@/types/doctor';

let adminDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Anjali Mehra',
    specialty: 'Cardiologist',
    experience: 12,
    location: 'Delhi',
    imageUrl: '',
  },
  {
    id: '2',
    name: 'Dr. Ravi Kapoor',
    specialty: 'Dermatologist',
    experience: 8,
    location: 'Mumbai',
    imageUrl: '',
  },
];

export async function getDoctors(): Promise<Doctor[]> {
  return new Promise((resolve) => setTimeout(() => resolve(adminDoctors), 300));
}

export async function deleteDoctor(id: string): Promise<void> {
  adminDoctors = adminDoctors.filter((doc) => doc.id !== id);
}

export async function addDoctor(data: { name: string; specialty: string }): Promise<void> {
  adminDoctors.unshift({
    id: Date.now().toString(),
    name: data.name,
    specialty: data.specialty,
    experience: Math.floor(Math.random() * 10 + 1),
    location: 'Unknown',
    imageUrl: '',
  });
}