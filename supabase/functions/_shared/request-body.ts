export async function parseRequestBody<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return await req.clone().json() as T;
  } catch {
    const text = await req.clone().text();
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
