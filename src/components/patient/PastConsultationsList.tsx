import React from 'react';

type Consultation = {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  prescriptions: string[];
};

interface PastConsultationsListProps {
  patientId: string;
  consultations?: Consultation[];
  loading?: boolean;
}

const PastConsultationsList: React.FC<PastConsultationsListProps> = ({ 
  patientId, 
  consultations = [], 
  loading = false 
}) => {
  // Dummy data for demonstration
  const dummyConsultations: Consultation[] = [
    {
      id: 'cons1',
      date: '2023-10-15',
      doctorName: 'Dr. Sarah Johnson',
      diagnosis: 'Acute bronchitis',
      prescriptions: ['Azithromycin 500mg', 'Paracetamol 650mg']
    },
    {
      id: 'cons2',
      date: '2023-09-02',
      doctorName: 'Dr. Michael Brown',
      diagnosis: 'Hypertension, well-controlled',
      prescriptions: ['Amlodipine 5mg', 'Aspirin 75mg']
    },
    {
      id: 'cons3',
      date: '2023-06-18',
      doctorName: 'Dr. Sarah Johnson',
      diagnosis: 'Allergic rhinitis',
      prescriptions: ['Cetirizine 10mg', 'Fluticasone nasal spray']
    }
  ];

  // Use provided consultations if available, otherwise use dummy data
  const displayConsultations = consultations.length > 0 ? consultations : dummyConsultations;
  
  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        <p className="mt-2 text-gray-500">Loading past consultations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6 bg-indigo-50">
        <h3 className="text-lg font-medium text-gray-900">Past Consultations</h3>
        <p className="mt-1 text-sm text-gray-500">Consultation history and previous diagnoses</p>
      </div>
      
      {displayConsultations.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No past consultations found.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {displayConsultations.map((consultation) => (
            <div key={consultation.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-gray-900">{new Date(consultation.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {consultation.doctorName}
                </span>
              </div>
              
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
              </div>
              
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Medications:</p>
                <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                  {consultation.prescriptions.map((prescription, index) => (
                    <li key={index}>{prescription}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 flex">
                <button 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => {/* Implementation to view full consultation */}}
                >
                  View full details
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => {/* Implementation to download prescription */}}
                >
                  Download prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastConsultationsList;