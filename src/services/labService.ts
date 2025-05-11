import api from '@/lib/api';
import { 
  LabTest, 
  LabResult, 
  LabTestInput, 
  LabResultInput 
} from '@/types/lab';

// For local development and testing, we'll use mock data
const USE_MOCK_DATA = true;

// ================= LAB TEST MANAGEMENT =================

export async function getAllLabTests(
  patientId?: string,
  orderedBy?: string,
  status?: string
): Promise<LabTest[]> {
  if (USE_MOCK_DATA) {
    return getMockLabTests();
  }

  let url = '/api/lab/tests';
  const params = new URLSearchParams();
  
  if (patientId) params.append('patient', patientId);
  if (orderedBy) params.append('orderedBy', orderedBy);
  if (status) params.append('status', status);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await api.get(url);
  return response.data.data.labTests;
}

export async function getLabTest(id: string): Promise<LabTest> {
  if (USE_MOCK_DATA) {
    const labTests = await getMockLabTests();
    const labTest = labTests.find(test => test.id === id);
    if (!labTest) throw new Error('Lab test not found');
    return labTest;
  }

  const response = await api.get(`/api/lab/tests/${id}`);
  return response.data.data.labTest;
}

export async function createLabTest(data: LabTestInput): Promise<LabTest> {
  if (USE_MOCK_DATA) {
    console.log('Creating lab test:', data);
    return {
      id: 'new-test-' + Date.now(),
      patient: {
        id: data.patientId,
        name: 'Test Patient',
      },
      orderedBy: {
        id: 'current-doctor',
        name: 'Dr. Current User',
      },
      testType: data.testType,
      description: data.description || '',
      specialInstructions: data.specialInstructions || '',
      urgency: data.urgency || 'routine',
      status: 'ordered',
      orderedAt: new Date().toISOString(),
    };
  }

  const response = await api.post('/api/lab/tests', data);
  return response.data.data.labTest;
}

export async function updateLabTest(id: string, data: Partial<LabTestInput>): Promise<LabTest> {
  if (USE_MOCK_DATA) {
    console.log('Updating lab test:', id, data);
    const labTests = await getMockLabTests();
    const labTest = labTests.find(test => test.id === id);
    if (!labTest) throw new Error('Lab test not found');
    
    return {
      ...labTest,
      testType: data.testType || labTest.testType,
      description: data.description || labTest.description,
      specialInstructions: data.specialInstructions || labTest.specialInstructions,
      urgency: data.urgency || labTest.urgency,
    };
  }

  const response = await api.patch(`/api/lab/tests/${id}`, data);
  return response.data.data.labTest;
}

export async function deleteLabTest(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    console.log('Deleting lab test:', id);
    return;
  }

  await api.delete(`/api/lab/tests/${id}`);
}

export async function updateLabTestStatus(
  id: string, 
  status: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled'
): Promise<LabTest> {
  if (USE_MOCK_DATA) {
    console.log('Updating lab test status:', id, status);
    const labTests = await getMockLabTests();
    const labTest = labTests.find(test => test.id === id);
    if (!labTest) throw new Error('Lab test not found');
    
    return {
      ...labTest,
      status,
      ...(status === 'collected' && { collectedAt: new Date().toISOString() }),
      ...(status === 'completed' && { completedAt: new Date().toISOString() }),
      processedBy: 'current-user',
    };
  }

  const response = await api.patch(`/api/lab/tests/${id}/status`, { status });
  return response.data.data.labTest;
}

export async function getPatientLabTests(patientId: string): Promise<LabTest[]> {
  if (USE_MOCK_DATA) {
    const labTests = await getMockLabTests();
    return labTests.filter(test => test.patient.id === patientId);
  }

  const response = await api.get(`/api/lab/patient/${patientId}`);
  return response.data.data.labTests;
}

// ================= LAB RESULT MANAGEMENT =================

export async function createLabResult(data: LabResultInput): Promise<LabResult> {
  if (USE_MOCK_DATA) {
    console.log('Creating lab result:', data);
    return {
      id: 'new-result-' + Date.now(),
      labTest: data.labTestId,
      findings: data.findings,
      interpretation: data.interpretation || '',
      normalRanges: data.normalRanges || {},
      recommendations: data.recommendations || '',
      isAbnormal: data.isAbnormal || false,
      enteredBy: 'current-user',
      enteredAt: new Date().toISOString(),
    };
  }

  const response = await api.post('/api/lab/results', data);
  return response.data.data.labResult;
}

export async function getLabResult(id: string): Promise<LabResult> {
  if (USE_MOCK_DATA) {
    const labResults = await getMockLabResults();
    const result = labResults.find(res => res.id === id);
    if (!result) throw new Error('Lab result not found');
    return result;
  }

  const response = await api.get(`/api/lab/results/${id}`);
  return response.data.data.labResult;
}

export async function updateLabResult(id: string, data: Partial<LabResultInput>): Promise<LabResult> {
  if (USE_MOCK_DATA) {
    console.log('Updating lab result:', id, data);
    const labResults = await getMockLabResults();
    const result = labResults.find(res => res.id === id);
    if (!result) throw new Error('Lab result not found');
    
    return {
      ...result,
      findings: data.findings || result.findings,
      interpretation: data.interpretation || result.interpretation,
      normalRanges: data.normalRanges || result.normalRanges,
      recommendations: data.recommendations || result.recommendations,
      isAbnormal: data.isAbnormal !== undefined ? data.isAbnormal : result.isAbnormal,
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    };
  }

  const response = await api.patch(`/api/lab/results/${id}`, data);
  return response.data.data.labResult;
}

export async function generateLabResultPDF(id: string): Promise<string> {
  if (USE_MOCK_DATA) {
    console.log('Generating PDF for lab result:', id);
    return 'https://example.com/mock-pdf-url.pdf';
  }

  const response = await api.get(`/api/lab/results/${id}/pdf`);
  return response.data.data.pdfUrl;
}

// ================= MOCK DATA =================

async function getMockLabTests(): Promise<LabTest[]> {
  const mockResults = await getMockLabResults();
  
  return [
    {
      id: 'test1',
      patient: {
        id: 'pat1',
        name: 'John Smith',
        contactNumber: '+91 9876543210',
        dateOfBirth: '1985-05-15',
        gender: 'Male',
      },
      orderedBy: {
        id: 'doc1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Internal Medicine',
      },
      testType: 'Complete Blood Count (CBC)',
      description: 'Routine blood check for annual physical',
      urgency: 'routine',
      status: 'completed',
      orderedAt: '2023-11-05T09:30:00',
      collectedAt: '2023-11-05T10:15:00',
      processedBy: 'lab1',
      completedAt: '2023-11-05T14:45:00',
      result: mockResults[0],
    },
    {
      id: 'test2',
      patient: {
        id: 'pat2',
        name: 'Emma Wilson',
        contactNumber: '+91 9876543211',
        dateOfBirth: '1990-08-22',
        gender: 'Female',
      },
      orderedBy: {
        id: 'doc2',
        name: 'Dr. Michael Brown',
        specialization: 'Cardiology',
      },
      testType: 'Lipid Profile',
      description: 'Checking cholesterol levels',
      urgency: 'routine',
      status: 'processing',
      orderedAt: '2023-11-07T11:00:00',
      collectedAt: '2023-11-07T11:45:00',
      processedBy: 'lab2',
    },
    {
      id: 'test3',
      patient: {
        id: 'pat3',
        name: 'Robert Johnson',
        contactNumber: '+91 9876543212',
        dateOfBirth: '1978-03-10',
        gender: 'Male',
      },
      orderedBy: {
        id: 'doc3',
        name: 'Dr. Jessica Lee',
        specialization: 'Endocrinology',
      },
      testType: 'HbA1c',
      description: 'Diabetes monitoring',
      specialInstructions: 'Patient is on insulin therapy',
      urgency: 'urgent',
      status: 'ordered',
      orderedAt: '2023-11-10T09:00:00',
    },
    {
      id: 'test4',
      patient: {
        id: 'pat1',
        name: 'John Smith',
        contactNumber: '+91 9876543210',
        dateOfBirth: '1985-05-15',
        gender: 'Male',
      },
      orderedBy: {
        id: 'doc1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Internal Medicine',
      },
      testType: 'Liver Function Test',
      description: 'Follow-up test for medication monitoring',
      urgency: 'routine',
      status: 'collected',
      orderedAt: '2023-11-09T14:30:00',
      collectedAt: '2023-11-09T15:15:00',
      processedBy: 'lab1',
    },
    {
      id: 'test5',
      patient: {
        id: 'pat4',
        name: 'Alice Chen',
        contactNumber: '+91 9876543213',
        dateOfBirth: '1995-11-18',
        gender: 'Female',
      },
      orderedBy: {
        id: 'doc4',
        name: 'Dr. David Wilson',
        specialization: 'Pulmonology',
      },
      testType: 'Chest X-Ray',
      description: 'Suspected pneumonia',
      urgency: 'stat',
      status: 'completed',
      orderedAt: '2023-11-08T10:00:00',
      collectedAt: '2023-11-08T10:15:00',
      processedBy: 'lab3',
      completedAt: '2023-11-08T11:30:00',
      result: mockResults[1],
    },
  ];
}

async function getMockLabResults(): Promise<LabResult[]> {
  return [
    {
      id: 'result1',
      labTest: 'test1',
      findings: {
        hemoglobin: 14.2,
        whiteCellCount: 7500,
        redCellCount: 5.1,
        platelets: 250000,
        hematocrit: 42,
        mcv: 88,
        mch: 29,
        mchc: 33,
        rdw: 13.2,
        neutrophils: 58,
        lymphocytes: 30,
        monocytes: 5,
        eosinophils: 2,
        basophils: 0.5,
      },
      interpretation: 'All values are within normal range.',
      normalRanges: {
        hemoglobin: '13.5-17.5 g/dL (male), 12.0-15.5 g/dL (female)',
        whiteCellCount: '4,500-11,000 cells/μL',
        redCellCount: '4.5-5.9 million cells/μL (male), 4.1-5.1 million cells/μL (female)',
        platelets: '150,000-450,000 platelets/μL',
        hematocrit: '41-50% (male), 36-44% (female)',
        mcv: '80-100 fL',
        mch: '27-33 pg',
        mchc: '32-36 g/dL',
        rdw: '11.5-14.5%',
        neutrophils: '40-60%',
        lymphocytes: '20-40%',
        monocytes: '2-8%',
        eosinophils: '1-4%',
        basophils: '0.5-1%'
      },
      recommendations: 'No further testing required at this time.',
      isAbnormal: false,
      enteredBy: 'lab1',
      enteredAt: '2023-11-05T14:45:00',
    },
    {
      id: 'result2',
      labTest: 'test5',
      findings: {
        image: 'chest-xray-image-url.jpg',
        findings: 'Patchy opacities observed in right lower lobe, consistent with pneumonia.',
      },
      interpretation: 'Findings consistent with right lower lobe pneumonia.',
      recommendations: 'Recommend antibiotic therapy. Follow-up X-ray in 2 weeks.',
      isAbnormal: true,
      enteredBy: 'lab3',
      enteredAt: '2023-11-08T11:30:00',
    },
  ];
}