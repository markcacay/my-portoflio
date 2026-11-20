// Sends the form with fetch so the visitor stays on the page; never clears fields on failure.
export async function submitContact(form: HTMLFormElement, fetchImpl: typeof fetch = fetch, timeoutMs = 15000): Promise<'ok' | 'error'> {
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetchImpl(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(timeoutMs), // a stalled provider must still end in the error message
    });
    const body = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && body.success === true ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}
