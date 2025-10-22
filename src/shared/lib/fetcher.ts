export type FetcherInit = RequestInit & { authToken?: string };

export async function fetcher<T = unknown>(url: string, init: FetcherInit = {}): Promise<T> {
  const { authToken, headers, ...rest } = init;
  const h = new Headers(headers);
  if (authToken) h.set("Authorization", `Bearer ${authToken}`);
  const res = await fetch(url, { ...rest, headers: h });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // @ts-expect-error: may be empty
  return res.headers.get("content-type")?.includes("application/json") ? await res.json() : await res.text();
}


