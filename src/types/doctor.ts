export type Doctor = {
    id: string;
    name: string;
    specialty: string;
    experience: number;
    location: string;
    imageUrl?: string;
    email?: string;
    supportsTeleconsultation?: boolean;
  };