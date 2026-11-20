// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { submitContact } from '../../src/scripts/contact-form';

let form: HTMLFormElement;
beforeEach(() => {
  document.body.innerHTML = `<form action="https://api.web3forms.com/submit" method="POST">
    <input name="access_key" value="k"><input name="name" value="Ana"><input name="email" value="ana@example.com">
    <textarea name="message">Need a WooCommerce store</textarea></form>`;
  form = document.querySelector('form')!;
});
const json = (body: unknown, status = 200) => async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('submitContact', () => {
  it('returns ok when the provider accepts the message', async () => {
    expect(await submitContact(form, json({ success: true }))).toBe('ok');
  });
  it('returns error and keeps what was typed when the network fails', async () => {
    const r = await submitContact(form, async () => { throw new TypeError('Failed to fetch'); });
    expect(r).toBe('error');
    expect((form.elements.namedItem('message') as HTMLTextAreaElement).value).toBe('Need a WooCommerce store');
  });
  it('returns error when the provider rejects the message', async () => {
    expect(await submitContact(form, json({ success: false, message: 'Invalid key' }, 400))).toBe('error');
  });
  it('posts the form fields to the form action as JSON', async () => {
    let seen: { url: string; body: Record<string, string> } | undefined;
    await submitContact(form, async (url, init) => { seen = { url: String(url), body: JSON.parse(String(init!.body)) }; return new Response('{"success":true}'); });
    expect(seen!.url).toBe('https://api.web3forms.com/submit');
    expect(seen!.body).toMatchObject({ access_key: 'k', name: 'Ana', email: 'ana@example.com' });
  });
});

describe('submitContact timeout', () => {
  it('gives up with error when the provider never answers', async () => {
    const hang: typeof fetch = (_u, init) => new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(new DOMException('timeout', 'TimeoutError'))));
    expect(await submitContact(form, hang, 50)).toBe('error');
  }, 1000);
});
