import { NextRequest } from 'next/server';
import { GET_MAIN_CATEGORIES } from '../route';

export async function GET(request: NextRequest) {
  return GET_MAIN_CATEGORIES(request);
}
