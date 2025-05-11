// src/types/auth.ts

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: string;
  hospital?: {
    _id: string;
    name: string;
    subdomain: string;
  };
  specialization?: string;
  licenseNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hospital {
  id: string;
  name: string;
  subdomain: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string;
  hospitalId: string;
  specialization?: string;
  licenseNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  expiresIn: string;
  hospital?: Hospital;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresAt: number | null;
  hospital: Hospital | null;
}