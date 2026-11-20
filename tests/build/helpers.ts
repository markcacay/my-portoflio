import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const DIST = join(process.cwd(), 'dist');
export const readPage = (path: string) => readFileSync(join(DIST, path), 'utf8');
export const htmlFiles = (dir = DIST): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? htmlFiles(p) : f.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(f) ? [relative(DIST, p)] : []; // skip Search Console verification files
  });
export const titleOf = (html: string) => [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]);
