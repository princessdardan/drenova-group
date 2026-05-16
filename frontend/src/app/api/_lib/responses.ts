import { NextResponse } from "next/server";

export function jsonError(body: object, status: number) {
  return NextResponse.json(body, { status });
}

export function jsonOk(body: object) {
  return NextResponse.json(body);
}
