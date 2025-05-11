import { Appointment } from '@/types/appointment';

export async function getAdminAppointments(): Promise<Appointment[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: 'a1',
          patientName: 'Rahul Sharma',
          doctorName: 'Dr. Anjali Mehra',
          date: '2024-06-01',
          time: '10:00 AM',
          status: 'Upcoming',
        },
        {
          id: 'a2',
          patientName: 'Neha Verma',
          doctorName: 'Dr. Ravi Kapoor',
          date: '2024-05-25',
          time: '02:30 PM',
          status: 'Completed',
        },
      ]);
    }, 500)
  );
}