import { NextRequest } from "next/server";
import { GET_CATEGORY_WITH_HIERARCHY } from "../../route";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return GET_CATEGORY_WITH_HIERARCHY(request, { params });
}
