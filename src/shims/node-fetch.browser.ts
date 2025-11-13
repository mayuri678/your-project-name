// Browser shim for @supabase/node-fetch: re-export native browser APIs
const fetchImpl: typeof fetch = (...args: Parameters<typeof fetch>) => {
  return (globalThis.fetch as typeof fetch)(...args);
};

export default fetchImpl;
export const Request = globalThis.Request;
export const Response = globalThis.Response;
export const Headers = globalThis.Headers;
export const FormData = globalThis.FormData as typeof globalThis.FormData;
export const Blob = globalThis.Blob as typeof globalThis.Blob;


