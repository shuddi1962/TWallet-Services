/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorItem {
  code: string;
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  errors: ApiErrorItem[];
}

export interface ApiPaginatedMeta {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  cursor?: string;
}

export function apiSuccess<T>(data: T, message?: string, status = 200) {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (message) body.message = message;
  return NextResponse.json(body, { status });
}

export function apiCreated<T>(data: T, message?: string) {
  return apiSuccess(data, message, 201);
}

export function apiError(errors: ApiErrorItem[], status = 400) {
  const body: ApiErrorResponse = { success: false, errors };
  return NextResponse.json(body, { status });
}

export function apiPaginated<T>(
  data: T[],
  meta: ApiPaginatedMeta,
  message?: string,
) {
  const body = {
    success: true as const,
    data,
    meta,
  } as any;
  if (message) body.message = message;
  return NextResponse.json(body, { status: 200 });
}
