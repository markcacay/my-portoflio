import { describe, it, expect } from 'vitest';
import { htmlFiles, readPage } from './helpers';

const home = readPage('index.html');
const about = readPage('about/index.html');
const tools = home.slice(home.indexOf('id="tools"'), home.indexOf('</section>', home.indexOf('id="tools"')));

describe('positioning copy', () => {
  it('hero says build, fix and connect', () => {
    expect(home).toMatch(/<h1[^>]*>I build fast websites, fix the broken ones, and connect them to the tools your business runs on\.<\/h1>/);
  });
  it('calls Mark AI-driven and a problem-solver on the homepage and About', () => {
    for (const html of [home, about]) { expect(html).toContain('AI-driven'); expect(html).toContain('problem-solver'); }
  });
  it('lists debugging and site rescues as a service', () => expect(home).toContain('Debugging and site rescues'));
  it.each(htmlFiles())('%s never calls Pageant Poll "my own"', (p) => {
    expect(readPage(p).toLowerCase()).not.toMatch(/my own (saas|product)/);
  });
});

describe('tools logo strip', () => {
  it('is headed "Tools I use"', () => {
    expect(tools).toMatch(/>Tools I use</);
    expect(home).not.toContain('Tools I use every week');
  });
  it.each(['WordPress', 'PHP', 'HTML', 'CSS', 'JavaScript', 'jQuery', 'Laravel', 'Vue.js', 'Inertia', 'PrimeVue', 'Vite', 'Node.js', 'MySQL', 'Docker', 'Astro', 'Three.js', 'GoHighLevel', 'Klaviyo', 'Claude'])(
    'names %s', (name) => expect(tools).toContain(`>${name}<`));
  it('draws logos from one shared sprite', () => {
    expect(home).toMatch(/<symbol id="si-wordpress"/);
    expect(tools).toContain('href="#si-laravel"');
  });
  it('has exactly one copy for screen readers; loop duplicates are hidden', () => {
    const lists = [...tools.matchAll(/<ul class="tools-list[^"]*"([^>]*)>/g)].map((m) => m[1]);
    expect(lists.filter((a) => !a.includes('aria-hidden="true"')).length).toBe(1);
    expect(lists.some((a) => a.includes('aria-hidden="true"'))).toBe(true);
  });
});
