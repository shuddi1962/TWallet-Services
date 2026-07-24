export interface PaginationParams {
  cursor?: string;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export function encodeCursor(value: string): string {
  return Buffer.from(value).toString("base64");
}

export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, "base64").toString("utf-8");
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Math.min(Math.max(1, Number(searchParams.get("limit")) || 20), 100);
  return { cursor, limit };
}

export function buildPaginatedResponse<T>(
  data: T[],
  limit: number,
  cursorField: keyof T,
): PaginatedResult<T> {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore && items.length > 0
    ? encodeCursor(String(items[items.length - 1]![cursorField]))
    : undefined;
  return { data: items, nextCursor, hasMore };
}
