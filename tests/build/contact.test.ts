import { describe, it, expect } from 'vitest';
import { readPage } from './helpers';

const html = readPage('contact/index.html');
const form = html.slice(html.indexOf('<form'), html.indexOf('</form>'));

describe('contact page', () => {
  it('posts to Web3Forms with the public key', () => {
    expect(form).toMatch(/action="https:\/\/api\.web3forms\.com\/submit"/);
    expect(form).toMatch(/method="POST"/i);
    expect(form).toMatch(/<input[^>]+type="hidden"[^>]+name="access_key"[^>]+value="300f6f90-c357-411e-a1ee-9493289cf80f"/);
  });
  it('requires name, a valid email and a message', () => {
    expect(form).toMatch(/<input[^>]+name="name"[^>]*required/);
    expect(form).toMatch(/<input[^>]+type="email"[^>]+name="email"[^>]*required/);
    expect(form).toMatch(/<textarea[^>]+name="message"[^>]*required/);
  });
  it('every field has a visible label', () => {
    for (const id of ['cf-name', 'cf-email', 'cf-message']) expect(form).toContain(`for="${id}"`);
  });
  it('has a honeypot hidden from people and screen readers', () => {
    expect(form).toMatch(/<input[^>]+name="botcheck"[^>]*style="display:\s*none/);
  });
  it('redirects back to the contact page after a no-JS submit', () => {
    expect(form).toMatch(/name="redirect"[^>]+value="https:\/\/markcacay\.pages\.dev\/contact\/\?sent=1"/);
  });
  it('offers email, LinkedIn and the CV as alternatives', () => {
    expect(html).toContain('href="mailto:markcacay@gmail.com"');
    expect(html).toContain('href="https://www.linkedin.com/in/mark-cacay-858a1896/"');
    expect(html).toContain('href="/mark-cacay-cv.pdf"');
  });
});
