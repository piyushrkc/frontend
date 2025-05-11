'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TreatmentTemplateModal from '@/components/doctor/TreatmentTemplateModal';

function DoctorDashboard() {
  const router = useRouter();
  const [pendingLabReports, setPendingLabReports] = useState([]);
  const [patientQueue, setPatientQueue] = useState([]);
  const [showReportsCard, setShowReportsCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([
    {
      name: "Hypertension",
      medications: [
        {
          medication: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days"
        },
        {
          medication: "Hydrochlorothiazide",
          dosage: "12.5mg",
          frequency: "Once daily",
          duration: "30 days"
        }
      ],
      instructions: "Monitor blood pressure weekly. Reduce salt intake."
    },
    {
      name: "Type 2 Diabetes",
      medications: [
        {
          medication: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily with meals",
          duration: "30 days"
        }
      ],
      instructions: "Check blood sugar daily. Follow diabetic diet."
    },
    {
      name: "Common Cold",
      medications: [
        {
          medication: "Paracetamol",
          dosage: "500mg",
          frequency: "Every 6 hours as needed",
          duration: "5 days"
        },
        {
          medication: "Cetirizine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "5 days"
        }
      ],
      instructions: "Rest and drink plenty of fluids."
    }
  ]);

  // Mock data fetch
  useEffect(() => {
    // Simulated data fetch
    setTimeout(() => {
      // Mock pending lab reports requiring attention
      const mockPendingLabReports = [
        {
          id: 'lab001',
          patient: {
            id: 'p5',
            name: 'David Anderson',
            gender: 'Male',
            age: 61
          },
          testType: 'Complete Blood Count',
          completedAt: '2023-09-05T08:45:00',
          urgency: 'high',
          hasAbnormalResults: true,
          abnormalParameters: ['hemoglobin', 'plateletCount'],
          status: 'completed',
          reason: 'Recent admission for anemia'
        },
        {
          id: 'lab002',
          patient: {
            id: 'p2',
            name: 'Sarah Johnson',
            gender: 'Female',
            age: 32
          },
          testType: 'Lipid Profile',
          completedAt: '2023-09-05T09:30:00',
          urgency: 'medium',
          hasAbnormalResults: true,
          abnormalParameters: ['totalCholesterol', 'ldlCholesterol'],
          status: 'completed',
          reason: 'Routine checkup'
        },
        {
          id: 'lab003',
          patient: {
            id: 'p7',
            name: 'Rahul Sharma',
            gender: 'Male',
            age: 42
          },
          testType: 'Thyroid Function',
          completedAt: '2023-09-05T10:15:00',
          urgency: 'low',
          hasAbnormalResults: false,
          status: 'completed',
          reason: 'Annual checkup'
        }
      ];
      
      // Mock patient queue data
      const mockPatientQueue = [
        {
          id: 'p1',
          name: 'John Smith',
          gender: 'Male',
          age: 45,
          appointmentTime: '09:00 AM',
          reason: 'Fever',
          status: 'waiting'
        },
        {
          id: 'p2',
          name: 'Sarah Johnson',
          gender: 'Female',
          age: 32,
          appointmentTime: '10:30 AM',
          reason: 'Follow-up',
          status: 'waiting'
        },
        {
          id: 'p3',
          name: 'Michael Brown',
          gender: 'Male',
          age: 52,
          appointmentTime: '11:00 AM',
          reason: 'Consultation',
          status: 'in-progress'
        },
        {
          id: 'p4',
          name: 'Emma Wilson',
          gender: 'Female',
          age: 28,
          appointmentTime: '11:30 AM',
          reason: 'Consultation',
          status: 'completed'
        }
      ];

      // Add lab reports to the queue for patients not already in queue
      mockPendingLabReports.forEach(report => {
        const patientInQueue = mockPatientQueue.find(p => p.id === report.patient.id);
        
        if (patientInQueue) {
          // Update existing patient with report information
          patientInQueue.hasLabReport = true;
          patientInQueue.labReportId = report.id;
          patientInQueue.reportStatus = 'unread';
          patientInQueue.testType = report.testType;
          patientInQueue.abnormal = report.hasAbnormalResults;
        } else if (report.patient.id === 'p5' || report.patient.id === 'p7') {
          // Add new patients with lab reports to the queue (except for p2 who is already in queue)
          mockPatientQueue.push({
            id: report.patient.id,
            name: report.patient.name,
            gender: report.patient.gender,
            age: report.patient.age,
            appointmentTime: new Date(report.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reason: report.reason,
            status: 'waiting',
            hasLabReport: true,
            labReportId: report.id,
            reportStatus: 'unread',
            testType: report.testType,
            abnormal: report.hasAbnormalResults
          });
        }
      });

      // Create notifications for new lab reports
      const newNotifications = mockPendingLabReports.map(report => ({
        id: `notif-${report.id}`,
        type: 'lab_report',
        message: `New lab results for ${report.patient.name} (${report.testType})`,
        time: new Date(report.completedAt).toLocaleTimeString(),
        read: false,
        labReportId: report.id,
        severity: report.hasAbnormalResults ? 'high' : 'normal'
      }));

      setPendingLabReports(mockPendingLabReports);
      setPatientQueue(mockPatientQueue);
      setNotifications(newNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const viewLabReport = (reportId) => {
    // Mark corresponding notification as read
    const notification = notifications.find(n => n.labReportId === reportId);
    if (notification) {
      markNotificationAsRead(notification.id);
    }
    
    // Navigate to lab results page with the report ID
    router.push(`/doctor-dashboard/lab-results?reportId=${reportId}`);
  };

  // Check if patient is already in queue
  const isPatientInQueue = (patientId) => {
    return patientQueue.some(p => p.id === patientId);
  };

  // Update a patient's record with lab report information
  const addToQueue = (report) => {
    // First check if patient is already in queue
    const patientExists = isPatientInQueue(report.patient.id);
    
    if (!patientExists) {
      const newPatient = {
        id: report.patient.id,
        name: report.patient.name,
        gender: report.patient.gender,
        age: report.patient.age,
        appointmentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reason: `Follow-up for ${report.testType}`,
        status: 'waiting',
        hasLabReport: true,
        labReportId: report.id
      };
      
      // Find the position after the last waiting patient
      const lastWaitingIndex = patientQueue.findLastIndex(p => p.status === 'waiting');
      
      // Create a new queue with the patient inserted at the right position
      const newQueue = [...patientQueue];
      newQueue.splice(lastWaitingIndex + 1, 0, newPatient);
      
      setPatientQueue(newQueue);
    } else {
      // Patient already exists in queue, just update their record with the lab report info
      const updatedQueue = patientQueue.map(patient => {
        if (patient.id === report.patient.id) {
          return {
            ...patient,
            hasLabReport: true,
            labReportId: report.id,
            reason: patient.reason ? `${patient.reason} + Lab Report` : `Lab Report: ${report.testType}`
          };
        }
        return patient;
      });
      
      setPatientQueue(updatedQueue);
    }
    
    // Mark the corresponding notification as read
    const notification = notifications.find(n => n.labReportId === report.id);
    if (notification) {
      markNotificationAsRead(notification.id);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Template management functions
  const handleSaveTemplate = (template) => {
    if (editingTemplate) {
      // Update existing template
      setSavedTemplates(savedTemplates.map(t => 
        t.name === editingTemplate.name ? template : t
      ));
    } else {
      // Add new template
      setSavedTemplates([...savedTemplates, template]);
    }
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleApplyTemplate = (template) => {
    // In real implementation, this would navigate to consultation
    // with prefilled medications from the template
    const firstPatient = patientQueue.find(p => p.status === 'waiting');
    if (firstPatient) {
      router.push(`/doctor-dashboard/consultation?patientId=${firstPatient.id}&name=${firstPatient.name}&age=${firstPatient.age}&gender=${firstPatient.gender}&reason=${firstPatient.reason}&template=${encodeURIComponent(JSON.stringify(template))}`);
    } else {
      // Show message if no waiting patients
      alert('Please select a patient first to apply this template.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Treatment Template Modal */}
        <TreatmentTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => {
            setIsTemplateModalOpen(false);
            setEditingTemplate(null);
          }}
          onSave={handleSaveTemplate}
          initialTemplate={editingTemplate}
        />
        <header className="bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
            <p className="text-gray-600">Welcome, Doctor</p>
          </div>
          
          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowReportsCard(!showReportsCard)}
              className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="notifications-bell"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showReportsCard && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
                          onClick={() => viewLabReport(notification.labReportId)}
                          data-testid={`notification-${notification.id}`}
                        >
                          <div className="flex items-start">
                            <div className={`mr-3 flex-shrink-0 p-1 rounded-full ${notification.severity === 'high' ? 'bg-red-100' : 'bg-blue-100'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${notification.severity === 'high' ? 'text-red-600' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                {notification.message}
                                {notification.severity === 'high' && (
                                  <span className="ml-2 px-2 text-xs font-bold rounded-full bg-red-100 text-red-800">
                                    Abnormal
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                              <div className="mt-2 flex space-x-2">
                                <button 
                                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewLabReport(notification.labReportId);
                                  }}
                                  data-testid={`view-report-${notification.id}`}
                                >
                                  View Report
                                </button>
                                <button 
                                  className="text-xs font-medium text-green-600 hover:text-green-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const report = pendingLabReports.find(r => r.id === notification.labReportId);
                                    if (report) {
                                      if (!isPatientInQueue(report.patient.id)) {
                                        addToQueue(report);
                                      }
                                    }
                                  }}
                                  disabled={isPatientInQueue(pendingLabReports.find(r => r.id === notification.labReportId)?.patient?.id)}
                                  data-testid={`add-to-queue-${notification.id}`}
                                >
                                  {!isPatientInQueue(pendingLabReports.find(r => r.id === notification.labReportId)?.patient?.id) 
                                    ? 'Add to Queue' 
                                    : 'Already in Queue'}
                                </button>
                              </div>
                            </div>
                            {!notification.read && (
                              <span className="ml-auto h-2 w-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <Link href="/doctor-dashboard/lab-results" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                    View All Lab Results
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg shadow-sm p-6">
            <p className="text-gray-700 text-sm font-medium">Today's Appointments</p>
            <p className="text-3xl font-bold mt-2 text-blue-600">12</p>
          </div>
          <div className="bg-amber-50 rounded-lg shadow-sm p-6">
            <p className="text-gray-700 text-sm font-medium">Patients in Queue</p>
            <p className="text-3xl font-bold mt-2 text-amber-600">
              {patientQueue.filter(p => p.status === 'waiting').length}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg shadow-sm p-6 group relative cursor-pointer" onClick={() => router.push('/doctor-dashboard/lab-results')}>
            <p className="text-gray-700 text-sm font-medium">Pending Reports</p>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold mt-2 text-emerald-600">{pendingLabReports.length}</p>
              {unreadNotificationsCount > 0 && (
                <span className="ml-2 text-sm font-bold text-red-600" data-testid="new-reports-count">
                  ({unreadNotificationsCount} new)
                </span>
              )}
            </div>
            <div className="absolute inset-0 rounded-lg transition duration-200 group-hover:bg-emerald-100 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-sm font-medium text-emerald-800">Click to view</span>
            </div>
          </div>
        </div>
        
        {/* Pending Lab Reports Section (shown when there are new reports) */}
        {/* Lab Reports have been integrated into the patient queue table */}
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Patient Queue & Lab Reports</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status/Reports</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div> Loading...
                    </td>
                  </tr>
                ) : (
                  patientQueue.map((patient) => (
                    <tr key={patient.id} className={patient.hasLabReport ? "bg-amber-50" : ""} data-testid={`patient-row-${patient.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              {patient.hasLabReport && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                  Lab Results
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{patient.gender}, {patient.age}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.appointmentTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${patient.status === 'waiting' ? 'bg-blue-100 text-blue-800' : 
                              patient.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`
                          }>
                            {patient.status === 'waiting' ? 'Waiting' : 
                             patient.status === 'in-progress' ? 'In Progress' :
                             'Completed'}
                          </span>
                          
                          {patient.hasLabReport && (
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${patient.abnormal ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}
                                ${patient.reportStatus === 'unread' ? 'animate-pulse' : ''}
                              `}
                              title="Click to view lab report details"
                            >
                              {patient.reportStatus === 'unread' ? '📋 New Report' : '📋 Report'} {patient.abnormal && '⚠️'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col space-y-2 items-end">
                          {patient.status === 'waiting' ? (
                            <a 
                              href={`/doctor-dashboard/consultation?patientId=${patient.id}&name=${patient.name}&age=${patient.age}&gender=${patient.gender}&reason=${patient.reason}${patient.labReportId ? `&reportId=${patient.labReportId}` : ''}`} 
                              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs"
                              data-testid={`start-consultation-${patient.id}`}
                            >
                              Start Consultation
                            </a>
                          ) : patient.status === 'in-progress' ? (
                            <a 
                              href={`/doctor-dashboard/consultation?patientId=${patient.id}&name=${patient.name}&age=${patient.age}&gender=${patient.gender}&reason=${patient.reason}${patient.labReportId ? `&reportId=${patient.labReportId}` : ''}`}
                              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs"
                              data-testid={`complete-consultation-${patient.id}`}
                            >
                              Complete
                            </a>
                          ) : (
                            <span className="text-green-600">Completed</span>
                          )}
                          
                          {patient.hasLabReport && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => viewLabReport(patient.labReportId)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                data-testid={`view-lab-report-${patient.id}`}
                              >
                                View Report
                              </button>
                              <button
                                onClick={() => {
                                  // Mark report as read
                                  const updatedQueue = patientQueue.map(p => 
                                    p.id === patient.id ? { ...p, reportStatus: 'read' } : p
                                  );
                                  setPatientQueue(updatedQueue);
                                  
                                  // Navigate to consultation with report context
                                  router.push(`/doctor-dashboard/consultation?patientId=${patient.id}&name=${patient.name}&age=${patient.age}&gender=${patient.gender}&reason=${patient.reason}&reportId=${patient.labReportId}`);
                                }}
                                className="text-green-600 hover:text-green-800 text-xs font-medium"
                                data-testid={`update-prescription-${patient.id}`}
                              >
                                Update Prescription
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8" id="quick-actions">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Create Treatment Template
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="/pharmacy" 
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors"
              data-testid="quick-action-pharmacy"
            >
              <span className="text-2xl mb-2">💊</span>
              <span className="text-sm text-gray-700 text-center">Pharmacy</span>
            </a>
            <a 
              href="/doctor-dashboard/lab-results" 
              className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors"
              data-testid="quick-action-laboratory"
            >
              <span className="text-2xl mb-2">🧪</span>
              <span className="text-sm text-gray-700 text-center">Laboratory</span>
            </a>
            <a
              href="/appointments"
              className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors"
              data-testid="quick-action-appointments"
            >
              <span className="text-2xl mb-2">📅</span>
              <span className="text-sm text-gray-700 text-center">Appointments</span>
            </a>
            <a
              href="/telemedicine/dashboard"
              className="flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition-colors"
              data-testid="quick-action-telemedicine"
            >
              <span className="text-2xl mb-2">📹</span>
              <span className="text-sm text-gray-700 text-center">Telemedicine</span>
            </a>
            <a 
              href="/medical-records" 
              className="flex flex-col items-center justify-center bg-amber-50 hover:bg-amber-100 p-4 rounded-lg transition-colors"
              data-testid="quick-action-records"
            >
              <span className="text-2xl mb-2">📁</span>
              <span className="text-sm text-gray-700 text-center">Medical Records</span>
            </a>
          </div>
          
          {/* Treatment Templates Section */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">My Treatment Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTemplates.map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="text-gray-400 hover:text-blue-500"
                        title="Edit template"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleApplyTemplate(template)}
                        className="text-gray-400 hover:text-green-500"
                        title="Apply template to consultation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.medications.length} medication{template.medications.length !== 1 ? 's' : ''}
                  </p>
                  <div className="mt-2">
                    <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
                      {template.medications.slice(0, 2).map((med, idx) => (
                        <li key={idx}>{med.medication} - {med.dosage}</li>
                      ))}
                      {template.medications.length > 2 && (
                        <li>... and {template.medications.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
              
              {/* Add Template Card */}
              <div 
                className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
                onClick={() => setIsTemplateModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">Add New Template</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-6">
          <a href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;