export type AppointmentWithDoctor = {
    id: string;
    doctorId: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
  };
  
  export type Appointment = {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
  };