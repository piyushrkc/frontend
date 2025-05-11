'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

// @ts-ignore - Twilio Video is loaded with a script tag
declare const Twilio: any;

interface VideoConsultationProps {
  sessionId: string;
  onSessionEnd?: () => void;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ sessionId, onSessionEnd }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [notes, setNotes] = useState('');
  
  // References
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const screenTrackRef = useRef<any>(null);
  
  // Get session data and token
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);

        // In development mode, use mock data
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data for video consultation in development mode');

          // Get session data from localStorage if available
          const storedAppointments = localStorage.getItem('telemedicine_appointments');
          if (storedAppointments) {
            try {
              const appointments = JSON.parse(storedAppointments);
              const session = appointments.find((s: any) => s._id === sessionId);

              if (session) {
                setSessionData(session);

                // Create a mock token - in real app, this would come from Twilio
                const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 15);
                setToken(mockToken);

                setIsLoading(false);
                return;
              }
            } catch (err) {
              console.error('Error parsing stored appointments:', err);
            }
          }

          // Create mock session data if not found in localStorage
          const mockSession = {
            _id: sessionId,
            status: 'scheduled',
            roomName: `room-${sessionId}`,
            roomSid: `RM${Date.now()}`,
            scheduledStartTime: new Date().toISOString(),
            appointment: {
              _id: `appt-${sessionId}`,
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

          // Create a mock token
          const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 15);
          setToken(mockToken);

          // Show mock message
          toast.success('Development mode: Using simulated video consultation');
          setIsLoading(false);
          return;
        }

        // Production code
        // First, fetch session details
        const sessionResponse = await fetch(`/api/telemedicine/sessions/${sessionId}`);

        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session data');
        }

        const sessionData = await sessionResponse.json();
        setSessionData(sessionData.data);

        // Then, generate a token
        const tokenResponse = await fetch('/api/telemedicine/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId })
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to generate token');
        }

        const tokenData = await tokenResponse.json();
        setToken(tokenData.data.token);
      } catch (error: any) {
        console.error('Error initializing video session:', error);
        setError(error.message || 'Failed to initialize video session');
        toast.error('Failed to initialize video session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();

    // Cleanup function
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [sessionId, user]);
  
  // Connect to Twilio room when token is available
  useEffect(() => {
    if (!token || !sessionData) return;

    const connectToRoom = async () => {
      try {
        // In development mode, simulate Twilio functionality
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Simulating Twilio video room connection');

          // Create a mock room object
          const mockRoom = {
            name: sessionData.roomName,
            sid: sessionData.roomSid || 'MOCK_ROOM_SID',
            state: 'connected',
            localParticipant: {
              identity: user?.id || 'local-user',
              sid: 'MOCK_LOCAL_PARTICIPANT_SID',
              tracks: []
            },
            participants: new Map(),
            on: (event: string, callback: Function) => {
              console.log(`Development: Registered mock handler for ${event} event`);
              return mockRoom;
            },
            disconnect: () => {
              console.log('Development: Mock room disconnected');
              return mockRoom;
            }
          };

          // Set the mock room
          setRoom(mockRoom);

          // Simulate remote video after a delay
          setTimeout(() => {
            // Create a mock participant
            const mockParticipant = {
              identity: 'remote-user',
              sid: 'MOCK_REMOTE_PARTICIPANT_SID',
              tracks: new Map(),
              on: (event: string, callback: Function) => {
                console.log(`Development: Registered mock handler for participant ${event} event`);
                return mockParticipant;
              }
            };

            // Add a mock video element to the remote container
            if (remoteVideoRef.current) {
              const mockVideo = document.createElement('div');
              mockVideo.style.width = '100%';
              mockVideo.style.height = '100%';
              mockVideo.style.backgroundColor = '#000';
              mockVideo.style.display = 'flex';
              mockVideo.style.alignItems = 'center';
              mockVideo.style.justifyContent = 'center';
              mockVideo.style.color = '#fff';
              mockVideo.style.fontSize = '1.5rem';
              mockVideo.innerText = 'Simulated Remote Video';
              remoteVideoRef.current.appendChild(mockVideo);
            }

            // Add a mock video element to the local container
            if (localVideoRef.current) {
              const mockVideo = document.createElement('div');
              mockVideo.style.width = '100%';
              mockVideo.style.height = '100%';
              mockVideo.style.backgroundColor = '#000';
              mockVideo.style.display = 'flex';
              mockVideo.style.alignItems = 'center';
              mockVideo.style.justifyContent = 'center';
              mockVideo.style.color = '#fff';
              mockVideo.style.fontSize = '1.5rem';
              mockVideo.innerText = 'Simulated Local Video';
              localVideoRef.current.appendChild(mockVideo);
            }
          }, 1000);

          // Show success message
          toast.success('Development mode: Connected to simulated video consultation');
          return;
        }

        // Production code - needs actual Twilio library
        if (!Twilio) {
          throw new Error('Twilio library not loaded');
        }

        // Connect to the Twilio Video room
        const room = await Twilio.Video.connect(token, {
          name: sessionData.roomName,
          audio: true,
          video: true,
          dominantSpeaker: true
        });

        setRoom(room);

        // Handle existing participants
        room.participants.forEach(participantConnected);

        // Set up event listeners for participant events
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        room.on('dominantSpeakerChanged', dominantSpeakerChanged);

        // Attach local tracks to local video container
        room.localParticipant.tracks.forEach((publication: any) => {
          if (publication.track) {
            if (localVideoRef.current) {
              localVideoRef.current.appendChild(publication.track.attach());
            }
          }
        });

        // Show success message
        toast.success('Connected to video consultation');
      } catch (error) {
        console.error('Error connecting to room:', error);
        setError('Failed to connect to video room');
        toast.error('Failed to connect to video consultation');
      }
    };

    connectToRoom();
  }, [token, sessionData, user]);
  
  // Handler for when a participant connects
  const participantConnected = (participant: any) => {
    setParticipants(prev => [...prev, participant]);
    
    // Set up event listeners for this participant's tracks
    participant.tracks.forEach((publication: any) => {
      if (publication.isSubscribed) {
        trackSubscribed(publication.track, participant);
      }
    });
    
    participant.on('trackSubscribed', (track: any) => trackSubscribed(track, participant));
    participant.on('trackUnsubscribed', trackUnsubscribed);
  };
  
  // Handler for when a participant disconnects
  const participantDisconnected = (participant: any) => {
    setParticipants(prev => prev.filter(p => p !== participant));
  };
  
  // Handler for when a track is subscribed
  const trackSubscribed = (track: any, participant: any) => {
    if (track.kind === 'audio') {
      // Handle audio track
    } else if (track.kind === 'video') {
      // Attach video track to remote video container
      if (remoteVideoRef.current) {
        const videoElement = track.attach();
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        remoteVideoRef.current.appendChild(videoElement);
      }
    }
  };
  
  // Handler for when a track is unsubscribed
  const trackUnsubscribed = (track: any) => {
    // Remove track elements
    track.detach().forEach((element: HTMLElement) => {
      element.remove();
    });
  };
  
  // Handler for when the dominant speaker changes
  const dominantSpeakerChanged = (participant: any) => {
    // Highlight the dominant speaker in the UI
    if (participant) {
      console.log('Dominant speaker changed:', participant.identity);
    }
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (!room) return;
    
    room.localParticipant.audioTracks.forEach((publication: any) => {
      if (isMicEnabled) {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
    });
    
    setIsMicEnabled(!isMicEnabled);
  };
  
  // Toggle camera
  const toggleCamera = () => {
    if (!room) return;
    
    room.localParticipant.videoTracks.forEach((publication: any) => {
      if (isCameraEnabled) {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
    });
    
    setIsCameraEnabled(!isCameraEnabled);
  };
  
  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!room) return;
    
    if (!isScreenSharing) {
      try {
        // Get screen share track
        const screenTrack = await Twilio.Video.createLocalVideoTrack({
          name: 'screen',
          video: { source: 'screen' }
        });
        
        // Save reference to screen track
        screenTrackRef.current = screenTrack;
        
        // Publish screen track
        await room.localParticipant.publishTrack(screenTrack);
        
        screenTrack.on('stopped', () => {
          room.localParticipant.unpublishTrack(screenTrack);
          setIsScreenSharing(false);
          screenTrackRef.current = null;
        });
        
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
        toast.error('Failed to share screen');
      }
    } else {
      // Stop screen sharing
      if (screenTrackRef.current) {
        room.localParticipant.unpublishTrack(screenTrackRef.current);
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
        setIsScreenSharing(false);
      }
    }
  };
  
  // End session
  const endSession = async () => {
    try {
      setIsLoading(true);
      
      // Submit notes if this is a doctor
      if (user?.role === 'doctor' && sessionId) {
        await fetch(`/api/telemedicine/sessions/${sessionId}/end`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ notes })
        });
      }
      
      // Disconnect from the room
      if (room) {
        room.disconnect();
      }
      
      toast.success('Video consultation ended');
      
      // Call the onSessionEnd callback if provided
      if (onSessionEnd) {
        onSessionEnd();
      }
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to end session properly');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Initializing video consultation...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-lg p-6 bg-white shadow-md rounded-lg">
          <svg className="mx-auto h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Video Consultation Error</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Video container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Remote video */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div ref={remoteVideoRef} className="w-full h-full"></div>
          {participants.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white bg-black bg-opacity-50 p-2 rounded">Waiting for other participant...</p>
            </div>
          )}
        </div>
        
        {/* Local video */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div ref={localVideoRef} className="w-full h-full"></div>
          <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 p-1 rounded">
            {user?.firstName} {user?.lastName} ({user?.role})
          </div>
        </div>
      </div>
      
      {/* Controls and info */}
      <div className="bg-white p-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button 
              onClick={toggleMicrophone}
              className={`p-3 rounded-full ${isMicEnabled ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'}`}
            >
              {isMicEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={toggleCamera}
              className={`p-3 rounded-full ${isCameraEnabled ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'}`}
            >
              {isCameraEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={toggleScreenShare}
              className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span 
              className={`inline-block w-3 h-3 rounded-full ${
                connectionQuality === 'good' ? 'bg-green-500' : 
                connectionQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            ></span>
            <span className="text-sm text-gray-600">
              {connectionQuality === 'good' ? 'Good connection' : 
               connectionQuality === 'fair' ? 'Fair connection' : 'Poor connection'}
            </span>
          </div>
          
          <button 
            onClick={endSession}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            End Consultation
          </button>
        </div>
        
        {/* Doctor notes section */}
        {user?.role === 'doctor' && (
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Consultation Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              rows={3}
              placeholder="Enter notes about this consultation (visible only to you)"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConsultation;