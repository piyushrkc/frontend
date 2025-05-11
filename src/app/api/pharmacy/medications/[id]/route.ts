import { NextRequest, NextResponse } from 'next/server';
import { getMedicationById, updateMedicationPrice } from '@/utils/drugDatabaseUtils';

/**
 * GET - Retrieve a medication by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const medication = await getMedicationById(id);
    
    if (!medication) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Medication with ID ${id} not found`
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      data: { medication } 
    });
  } catch (error) {
    console.error(`Error retrieving medication with ID ${params.id}:`, error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve medication',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update a medication's price
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();
    
    // Validate the input
    if (data.price === undefined || isNaN(parseFloat(data.price))) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid price value'
        },
        { status: 400 }
      );
    }
    
    const updatedMedication = await updateMedicationPrice(id, parseFloat(data.price));
    
    if (!updatedMedication) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Medication with ID ${id} not found`
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      data: { medication: updatedMedication } 
    });
  } catch (error) {
    console.error(`Error updating medication with ID ${params.id}:`, error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to update medication',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}