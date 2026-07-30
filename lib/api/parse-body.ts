export async function parseBody<T = Record<string, unknown>>(request: Request): Promise<T> {
  try {
    return await request.clone().json() as T;
  } catch {
    const text = await request.clone().text();
    try {
      return JSON.parse(decodeURIComponent(text)) as T;
    } catch {
      try {
        return JSON.parse(text) as T;
      } catch {
        throw new Error(`Failed to parse request body: ${text.slice(0, 100)}`);
      }
    }
  }
}
