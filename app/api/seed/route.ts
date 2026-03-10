import { clearDatabase, seedDynamic } from '@/lib/seed/dynamic-seeder';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      action,
      categoriesCount = 10,
      productsCount = 50,
      clearExisting = true
    } = await request.json();

    if (action === 'seed') {
      const result = await seedDynamic({
        categoriesCount: Math.min(parseInt(categoriesCount) || 10, 100), // Limit to 100 max
        productsCount: Math.min(parseInt(productsCount) || 50, 1000), // Limit to 1000 max
        clearExisting: Boolean(clearExisting)
      });

      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully',
        data: result
      });
    } else if (action === 'clear') {
      await clearDatabase();
      return NextResponse.json({
        success: true,
        message: 'Database cleared successfully'
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'seed' or 'clear'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST request with parameters',
    example: {
      action: 'seed',
      categoriesCount: 20,
      productsCount: 100,
      clearExisting: true
    }
  });
}
