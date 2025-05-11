'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import VideoConsultation from '@/components/telemedicine/VideoConsultation';
import Link from 'next/link';

export default function TelemedicineSessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  
  // Load Twilio Video JS when component mounts
  useEffect(() => {
    // Check if Twilio is already loaded
    if (window.Twilio) return;
    
    const script = document.createElement('script');
    script.src = 'https://sdk.twilio.com/js/video/releases/2.27.0/twilio-video.min.js';
    script.async = true;
    script.onload = () => console.log('Twilio Video SDK loaded');
    script.onerror = () => setError('Failed to load Twilio Video SDK');
    document.body.appendChild(script);
    
    return () => {
      // Remove script on cleanup
      document.body.removeChild(script);
    };
  }, []);
  
  // Fetch session data when component mounts
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);

        // For development mode, use mock data
        if (process.env.NODE_ENV === 'development') {
          // Get session data from localStorage if available
          const storedAppointments = localStorage.getItem('telemedicine_appointments');
          if (storedAppointments) {
            try {
              const appointments = JSON.parse(storedAppointments);
              const session = appointments.find((s: any) => s._id === id);

              if (session) {
                setSessionData(session);
                setIsLoading(false);
                return;
              }
            } catch (err) {
              console.error('Error parsing stored appointments:', err);
            }
          }

          // If not found in localStorage or error occurs, use mock data
          console.log('Using mock session data for development');

          // Create mock session data
          const mockSession = {
            _id: id,
            status: 'scheduled',
            roomName: `room-${id}`,
            roomSid: `RM${Date.now()}`,
            scheduledStartTime: new Date().toISOString(),
            appointment: {
              _id: `appt-${id}`,
              doctor: {
                user: {
                  firstName: 'Doctor',
                  lastName: 'Name'
                }
              },
              patient: {
                user: {
                  firstName: user?.firstName || 'Patient',
                  lastName: user?.lastName || 'Name'
                }
              },
              reason: 'Mock telemedicine session for development'
            }
          };

          setSessionData(mockSession);
          setIsLoading(false);
          return;
        }

        // Production code
        const response = await fetch(`/api/telemedicine/sessions/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }

        const data = await response.json();
        setSessionData(data.data);
      } catch (error: any) {
        console.error('Error fetching session data:', error);
        setError(error.message || 'Failed to fetch session data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSessionData();
    }
  }, [id, user]);
  
  // Handle session end
  const handleSessionEnd = () => {
    if (user?.role === 'patient') {
      setShowFeedbackForm(true);
    } else {
      // Redirect to appropriate dashboard
      if (user?.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else {
        router.push('/');
      }
    }
  };
  
  // Submit feedback
  const submitFeedback = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/telemedicine/sessions/${id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          comments: feedbackComment
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      // Redirect to patient dashboard
      router.push('/dashboard/patient');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Waiting view for loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading telemedicine session...</p>
        </div>
      </div>
    );
  }
  
  // Error view
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-lg p-6 bg-white shadow-md rounded-lg">
          <svg className="mx-auto h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Session Error</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Check if session status is valid for joining
  if (sessionData && !['scheduled', 'in-progress'].includes(sessionData.status)) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-lg p-6 bg-white shadow-md rounded-lg">
          <svg className="mx-auto h-12 w-12 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Session Unavailable</h3>
          <p className="mt-2 text-gray-600">
            This telemedicine session is {sessionData.status}.
            {sessionData.status === 'completed' && " The consultation has already ended."}
            {sessionData.status === 'cancelled' && " The consultation was cancelled."}
          </p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Feedback view
  if (showFeedbackForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Consultation Feedback</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please rate your telemedicine experience
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you rate your consultation?
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                id="comments"
                name="comments"
                rows={4}
                className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                placeholder="Tell us about your experience..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/patient')}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Skip
              </button>
              <button
                type="submit"
                onClick={submitFeedback}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Main view - video consultation
  return (
    <VideoConsultation 
      sessionId={id as string} 
      onSessionEnd={handleSessionEnd}
    />
  );
}