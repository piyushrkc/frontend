import { AppointmentWithDoctor } from '@/types/appointment';

export async function getMyAppointments(): Promise<AppointmentWithDoctor[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'a1',
          doctorId: '1',
          doctorName: 'Dr. Anjali Mehra',
          specialty: 'Cardiologist',
          date: '2024-05-05',
          time: '10:30',
          status: 'Upcoming',
        },
        {
          id: 'a2',
          doctorId: '2',
          doctorName: 'Dr. Ravi Kapoor',
          specialty: 'Dermatologist',
          date: '2024-04-27',
          time: '15:00',
          status: 'Completed',
        },
      ]);
    }, 500);
  });
}

// ✅ ADD THIS BELOW
type AppointmentInput = {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
  type?: 'in-person' | 'teleconsultation';
  isTelemedicine?: boolean;
};

export async function createAppointment(data: AppointmentInput): Promise<any> {
  console.log('Appointment Created:', data);

  // Mock appointment creation with a simulated response
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Create a mock response with an ID for the appointment
      const appointmentId = 'app_' + Math.random().toString(36).substring(2, 10);

      resolve({
        success: true,
        message: 'Appointment created successfully',
        id: appointmentId,
        data: {
          _id: appointmentId,
          doctorId: data.doctorId,
          date: data.date,
          time: data.time,
          type: data.type || 'in-person',
          isTelemedicine: data.isTelemedicine || false,
          status: 'scheduled'
        }
      });
    }, 1000);
  });
}