// src/components/forms/__tests__/appointment-booking.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import AppointmentBookingForm from '../appointment-booking';
import { format } from 'date-fns';

// Mock the appointmentService
jest.mock('@/services/appointmentService', () => ({
  createAppointment: jest.fn().mockResolvedValue({ id: '123', status: 'scheduled' }),
  getAvailableSlots: jest.fn().mockResolvedValue([
    { id: 'slot1', time: '09:00', available: true },
    { id: 'slot2', time: '10:00', available: true },
    { id: 'slot3', time: '11:00', available: false }
  ])
}));

// Mock the doctorService
jest.mock('@/services/doctorService', () => ({
  getAllDoctors: jest.fn().mockResolvedValue([
    { id: 'doc1', firstName: 'John', lastName: 'Doe', specialization: 'Cardiology' },
    { id: 'doc2', firstName: 'Jane', lastName: 'Smith', specialization: 'Neurology' }
  ])
}));

describe('AppointmentBookingForm Component', () => {
  const onSuccess = jest.fn();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the form correctly', async () => {
    render(<AppointmentBookingForm onSuccess={onSuccess} />);
    
    // Check if main form elements are rendered
    expect(screen.getByText(/book an appointment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/doctor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason for visit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument();
    
    // Check if doctors are loaded
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });
  });
  
  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<AppointmentBookingForm onSuccess={onSuccess} />);
    
    // Submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/doctor is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reason for visit is required/i)).toBeInTheDocument();
    });
  });
  
  it('loads time slots when date and doctor are selected', async () => {
    const user = userEvent.setup();
    render(<AppointmentBookingForm onSuccess={onSuccess} />);
    
    // Select a doctor
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    const doctorSelect = screen.getByLabelText(/doctor/i);
    await user.click(doctorSelect);
    await user.click(screen.getByText(/john doe/i));
    
    // Select a date (using the date picker)
    const dateInput = screen.getByLabelText(/date/i);
    await user.click(dateInput);
    await user.clear(dateInput);
    await user.type(dateInput, format(tomorrow, 'MM/dd/yyyy'));
    await user.tab(); // Move focus away to trigger validation
    
    // Check if time slots are loaded
    await waitFor(() => {
      expect(screen.getByText(/09:00/i)).toBeInTheDocument();
      expect(screen.getByText(/10:00/i)).toBeInTheDocument();
    });
  });
  
  it('submits the form with valid data', async () => {
    const user = userEvent.setup();
    const { container } = render(<AppointmentBookingForm onSuccess={onSuccess} />);
    
    // Select a doctor
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    const doctorSelect = screen.getByLabelText(/doctor/i);
    await user.click(doctorSelect);
    await user.click(screen.getByText(/john doe/i));
    
    // Select a date
    const dateInput = screen.getByLabelText(/date/i);
    await user.click(dateInput);
    await user.clear(dateInput);
    await user.type(dateInput, format(tomorrow, 'MM/dd/yyyy'));
    await user.tab();
    
    // Wait for time slots to load and select one
    await waitFor(() => {
      expect(screen.getByText(/09:00/i)).toBeInTheDocument();
    });
    
    // Find the time slot radio buttons and select the first one
    const timeSlots = container.querySelectorAll('input[type="radio"]');
    if (timeSlots.length > 0) {
      await user.click(timeSlots[0]);
    }
    
    // Enter reason for visit
    const reasonInput = screen.getByLabelText(/reason for visit/i);
    await user.type(reasonInput, 'Annual checkup');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);
    
    // Verify form submission and success callback
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
  
  it('disables the form when submitting', async () => {
    const user = userEvent.setup();
    const { container } = render(<AppointmentBookingForm onSuccess={onSuccess} />);
    
    // Fill out the form
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    const doctorSelect = screen.getByLabelText(/doctor/i);
    await user.click(doctorSelect);
    await user.click(screen.getByText(/john doe/i));
    
    const dateInput = screen.getByLabelText(/date/i);
    await user.click(dateInput);
    await user.clear(dateInput);
    await user.type(dateInput, format(tomorrow, 'MM/dd/yyyy'));
    await user.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/09:00/i)).toBeInTheDocument();
    });
    
    const timeSlots = container.querySelectorAll('input[type="radio"]');
    if (timeSlots.length > 0) {
      await user.click(timeSlots[0]);
    }
    
    const reasonInput = screen.getByLabelText(/reason for visit/i);
    await user.type(reasonInput, 'Annual checkup');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);
    
    // Check that button is disabled during submission
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});