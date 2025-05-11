import React, { forwardRef } from 'react';

interface PrescriptionItem {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionPreviewProps {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
  };
  doctor: {
    name: string;
    qualification?: string;
    specialization?: string;
    hospitalName?: string;
    hospitalAddress?: string;
    hospitalPhone?: string;
    hospitalEmail?: string;
  };
  prescriptions: PrescriptionItem[];
  notes?: string;
  date?: string;
}

const PrescriptionPreview = forwardRef<HTMLDivElement, PrescriptionPreviewProps>(
  ({ patient, doctor, prescriptions, notes, date }, ref) => {
    const currentDate = date || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div 
        ref={ref} 
        className="bg-white rounded shadow-lg p-8 mx-auto my-4 max-w-[210mm]" 
        style={{ minHeight: '297mm', width: '210mm' }} // A4 size
      >
        {/* Hospital/Clinic Header */}
        <div className="mb-8 text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-blue-800">{doctor.hospitalName || "City General Hospital"}</h1>
          <p className="text-gray-600">{doctor.hospitalAddress || "123 Healthcare Avenue, Medical District"}</p>
          <p className="text-gray-600">
            {doctor.hospitalPhone ? `Phone: ${doctor.hospitalPhone}` : "Phone: (123) 456-7890"} |
            {doctor.hospitalEmail ? `Email: ${doctor.hospitalEmail}` : "Email: care@cityhospital.com"}
          </p>
        </div>

        {/* Prescription Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold">Prescription</h2>
            <p className="text-gray-600">Date: {currentDate}</p>
            <p className="text-gray-600">Ref: P-{patient.id}-{new Date().getTime().toString().slice(-6)}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold">{doctor.name}</h3>
            {doctor.qualification && (
              <p className="text-gray-600">{doctor.qualification}</p>
            )}
            {doctor.specialization && (
              <p className="text-gray-600">{doctor.specialization}</p>
            )}
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-8 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-bold">Patient Name:</span> {patient.name}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Patient ID:</span> {patient.id}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-bold">Age:</span> {patient.age} years
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Gender:</span> {patient.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="mb-4">
          <span className="text-3xl font-serif italic">℞</span>
        </div>

        {/* Medications */}
        <div className="mb-8">
          <table className="w-full mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left border-b">Medication</th>
                <th className="py-2 px-4 text-left border-b">Dosage</th>
                <th className="py-2 px-4 text-left border-b">Frequency</th>
                <th className="py-2 px-4 text-left border-b">Duration</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription, index) => (
                <tr key={prescription.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-3 px-4 border-b">{prescription.medication}</td>
                  <td className="py-3 px-4 border-b">{prescription.dosage}</td>
                  <td className="py-3 px-4 border-b">{prescription.frequency}</td>
                  <td className="py-3 px-4 border-b">{prescription.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clinical Notes */}
        {notes && (
          <div className="mb-8">
            <h3 className="font-bold mb-2">Clinical Notes:</h3>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="whitespace-pre-line">{notes}</p>
            </div>
          </div>
        )}

        {/* Instructions & Signature */}
        <div className="grid grid-cols-2 gap-8 mt-16">
          <div>
            <h3 className="font-bold mb-2">Special Instructions:</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Take medications as prescribed</li>
              <li>Complete the full course of medication</li>
              <li>Keep medicines out of reach of children</li>
              <li>Store in a cool, dry place</li>
            </ul>
          </div>
          <div className="text-right">
            <div className="mb-16"></div>
            <div className="border-t border-gray-400 pt-2 inline-block">
              <p className="font-bold">{doctor.name}</p>
              <p className="text-gray-600">Signature</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-16 pt-4 border-t">
          <p>This prescription is valid for 6 months from the date of issue unless otherwise specified.</p>
          <p>Please bring this prescription for your next visit.</p>
        </div>
      </div>
    );
  }
);

PrescriptionPreview.displayName = 'PrescriptionPreview';

export default PrescriptionPreview;