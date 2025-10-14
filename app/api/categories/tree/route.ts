import { NextRequest } from "next/server";
import { GET_TREE } from "../route";

export async function GET(request: NextRequest) {
  return GET_TREE(request);
}
