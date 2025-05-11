'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function TelemedicineDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);

        // In development mode, we'll use mock data
        if (process.env.NODE_ENV === 'development') {
          // Get the current date and time
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);

          // Create some upcoming session data
          const mockUpcomingSessions = [
            {
              _id: 'session1',
              status: 'scheduled',
              roomName: 'appointment-appt123-' + Date.now(),
              roomSid: 'RM' + Math.random().toString(36).substring(2, 10),
              scheduledStartTime: new Date(now.getTime() + 3600000).toISOString(), // 1 hour from now
              appointment: {
                _id: 'appt123',
                doctor: {
                  user: {
                    firstName: 'John',
                    lastName: 'Smith'
                  }
                },
                patient: {
                  user: {
                    firstName: user?.firstName || 'Current',
                    lastName: user?.lastName || 'User'
                  }
                },
                reason: 'Annual checkup and consultation',
                scheduledTime: new Date(now.getTime() + 3600000).toISOString()
              }
            },
            {
              _id: 'session2',
              status: 'scheduled',
              roomName: 'appointment-appt456-' + Date.now(),
              roomSid: 'RM' + Math.random().toString(36).substring(2, 10),
              scheduledStartTime: tomorrow.toISOString(), // Tomorrow
              appointment: {
                _id: 'appt456',
                doctor: {
                  user: {
                    firstName: 'Sarah',
                    lastName: 'Johnson'
                  }
                },
                patient: {
                  user: {
                    firstName: user?.firstName || 'Current',
                    lastName: user?.lastName || 'User'
                  }
                },
                reason: 'Follow-up on medication',
                scheduledTime: tomorrow.toISOString()
              }
            }
          ];

          // Add the newly created appointment to the list if there's one in local storage
          try {
            const storedAppointments = localStorage.getItem('telemedicine_appointments');
            if (storedAppointments) {
              const parsedAppointments = JSON.parse(storedAppointments);
              mockUpcomingSessions.push(...parsedAppointments);
            }
          } catch (err) {
            console.error('Error parsing stored appointments:', err);
          }

          // Create some past session data
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);

          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);

          const mockPastSessions = [
            {
              _id: 'session3',
              status: 'completed',
              roomName: 'appointment-appt789-' + Date.now(),
              roomSid: 'RM' + Math.random().toString(36).substring(2, 10),
              scheduledStartTime: yesterday.toISOString(),
              actualStartTime: yesterday.toISOString(),
              endTime: new Date(yesterday.getTime() + 1800000).toISOString(), // 30 minutes after start
              duration: 30,
              appointment: {
                _id: 'appt789',
                doctor: {
                  user: {
                    firstName: 'OPD',
                    lastName: 'Doctor'
                  }
                },
                patient: {
                  user: {
                    firstName: user?.firstName || 'Current',
                    lastName: user?.lastName || 'User'
                  }
                },
                reason: 'Fever and cough',
                scheduledTime: yesterday.toISOString()
              },
              doctorNotes: 'Patient is showing signs of improvement. Continue medication for 3 more days.',
              patientFeedback: {
                rating: 5,
                comments: 'Excellent consultation, doctor was very thorough'
              }
            },
            {
              _id: 'session4',
              status: 'completed',
              roomName: 'appointment-appt012-' + Date.now(),
              roomSid: 'RM' + Math.random().toString(36).substring(2, 10),
              scheduledStartTime: lastWeek.toISOString(),
              actualStartTime: lastWeek.toISOString(),
              endTime: new Date(lastWeek.getTime() + 2700000).toISOString(), // 45 minutes after start
              duration: 45,
              appointment: {
                _id: 'appt012',
                doctor: {
                  user: {
                    firstName: 'Ravi',
                    lastName: 'Kapoor'
                  }
                },
                patient: {
                  user: {
                    firstName: user?.firstName || 'Current',
                    lastName: user?.lastName || 'User'
                  }
                },
                reason: 'Skin allergy',
                scheduledTime: lastWeek.toISOString()
              },
              doctorNotes: 'Prescribed antihistamines. Advised to avoid allergens.',
              patientFeedback: {
                rating: 4,
                comments: 'Good consultation, would recommend'
              }
            }
          ];

          // Set the mock data
          setUpcomingSessions(mockUpcomingSessions);
          setPastSessions(mockPastSessions);

          // Simulate network delay
          setTimeout(() => {
            setIsLoading(false);
          }, 500);

          return;
        }

        // Production code - real API calls
        // Fetch upcoming sessions
        const upcomingResponse = await fetch('/api/telemedicine/sessions?upcoming=true');
        if (!upcomingResponse.ok) {
          throw new Error('Failed to fetch upcoming sessions');
        }
        const upcomingData = await upcomingResponse.json();
        setUpcomingSessions(upcomingData.data);

        // Fetch past sessions
        const pastResponse = await fetch('/api/telemedicine/sessions?status=completed');
        if (!pastResponse.ok) {
          throw new Error('Failed to fetch past sessions');
        }
        const pastData = await pastResponse.json();
        setPastSessions(pastData.data);
      } catch (error: any) {
        console.error('Error fetching sessions:', error);
        setError(error.message || 'Failed to fetch sessions');
        toast.error('Failed to load telemedicine sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);
  
  const joinSession = (sessionId: string) => {
    router.push(`/telemedicine/session?id=${sessionId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Telemedicine Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your video consultations</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              {user?.role === 'patient' && (
                <Link
                  href="/telemedicine/book"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Book Telemedicine
                </Link>
              )}
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </header>
        
        {/* Tabs */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="px-4 sm:px-0">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`${
                    activeTab === 'upcoming'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Upcoming Sessions
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`${
                    activeTab === 'past'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Past Sessions
                </button>
              </nav>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                {error}
              </div>
            ) : activeTab === 'upcoming' ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Telemedicine Sessions</h2>
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming telemedicine sessions
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {user?.role === 'doctor' ? 'Patient' : 'Doctor'}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Scheduled Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reason
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingSessions.map((session: any) => (
                          <tr key={session._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user?.role === 'doctor' 
                                      ? `${session.appointment.patient.user.firstName} ${session.appointment.patient.user.lastName}`
                                      : `Dr. ${session.appointment.doctor.user.firstName} ${session.appointment.doctor.user.lastName}`
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(session.scheduledStartTime)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                session.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {session.status === 'scheduled' ? 'Scheduled' : 'In Progress'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {session.appointment.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => joinSession(session._id)}
                                className="text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1 rounded-md"
                              >
                                Join Session
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Past Telemedicine Sessions</h2>
                {pastSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No past telemedicine sessions
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {user?.role === 'doctor' ? 'Patient' : 'Doctor'}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reason
                          </th>
                          {user?.role === 'doctor' && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          )}
                          {user?.role === 'patient' && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Feedback
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pastSessions.map((session: any) => (
                          <tr key={session._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user?.role === 'doctor' 
                                      ? `${session.appointment.patient.user.firstName} ${session.appointment.patient.user.lastName}`
                                      : `Dr. ${session.appointment.doctor.user.firstName} ${session.appointment.doctor.user.lastName}`
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(session.actualStartTime || session.scheduledStartTime)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {session.duration ? `${session.duration} min` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {session.appointment.reason}
                            </td>
                            {user?.role === 'doctor' && (
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {session.doctorNotes || 'No notes'}
                              </td>
                            )}
                            {user?.role === 'patient' && (
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {session.patientFeedback?.rating ? (
                                  <div className="flex items-center">
                                    <span className="text-yellow-400">
                                      {'★'.repeat(session.patientFeedback.rating)}
                                      {'☆'.repeat(5 - session.patientFeedback.rating)}
                                    </span>
                                    <span className="ml-2">{session.patientFeedback.rating}/5</span>
                                  </div>
                                ) : (
                                  'No feedback provided'
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Help Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">How to Use Telemedicine</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-md font-medium">Step 1: Prepare</h3>
              </div>
              <p className="text-sm text-gray-600">
                Ensure you have a stable internet connection and a quiet, well-lit environment. Test your camera and microphone before the session.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-md font-medium">Step 2: Join</h3>
              </div>
              <p className="text-sm text-gray-600">
                Click the "Join Session" button 5-10 minutes before your scheduled time. Allow camera and microphone access when prompted.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-md font-medium">Step 3: Consult</h3>
              </div>
              <p className="text-sm text-gray-600">
                During the session, you can turn on/off your camera/microphone, share your screen, and end the call when finished.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}