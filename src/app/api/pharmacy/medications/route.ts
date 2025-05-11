import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeDrugDatabase,
  searchMedications as searchMedicationsUtil,
  getMedicationById,
  createCustomMedication
} from '@/utils/drugDatabaseUtils';
import { Medication } from '@/types/pharmacy';

// Initialize the database when the server starts
initializeDrugDatabase().catch(error => {
  console.error('Failed to initialize drug database:', error);
});

/**
 * GET - Search for medications
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const results = await searchMedicationsUtil(query, limit);
    
    return NextResponse.json({ 
      status: 'success', 
      data: { 
        medications: results,
        count: results.length
      } 
    });
  } catch (error) {
    console.error('Error searching medications:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to search medications',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a custom medication
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate the input
    if (!data.brandName || !data.genericName || !data.dosageForm) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required fields: brandName, genericName, or dosageForm'
        },
        { status: 400 }
      );
    }
    
    // Format the medication data
    const medicationData: Omit<Medication, 'id'> = {
      name: data.brandName,
      brandName: data.brandName,
      genericName: data.genericName,
      dosageForm: data.dosageForm,
      strength: data.strength || '',
      category: data.category || 'Other',
      price: parseFloat(data.price) || 0,
      manufacturer: data.manufacturer || 'Custom Entry',
      activeIngredient: data.genericName,
      isGeneric: !!data.isGeneric,
      isActive: true
    };
    
    // Create the custom medication
    const newMedication = await createCustomMedication(medicationData);
    
    return NextResponse.json({ 
      status: 'success', 
      data: { medication: newMedication } 
    });
  } catch (error) {
    console.error('Error creating custom medication:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to create custom medication',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}