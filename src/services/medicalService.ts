import { MedicalRecord } from '@/types/medical';

export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'r1',
          title: 'Blood Test Report',
          description: 'CBC + Lipid Profile',
          date: '2024-04-20',
          downloadUrl: '/files/report1.pdf',
        },
        {
          id: 'r2',
          title: 'MRI Brain',
          description: 'Suspected migraine-related scan',
          date: '2024-03-14',
          downloadUrl: '/files/report2.pdf',
        },
      ]);
    }, 800);
  });
}