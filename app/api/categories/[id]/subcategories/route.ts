import { NextRequest } from 'next/server';
import { GET_SUBCATEGORIES } from '../../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return GET_SUBCATEGORIES(request, { params });
}
