// Builds code.js from code.template.js, injecting the "Tools I use" logos (same list as src/data/tools.ts).
import * as si from 'simple-icons';
import { readFileSync, writeFileSync } from 'node:fs';
const t = (name, icon) => ({ name, path: icon ? icon.path : null });
const rows = [
  [t('WordPress', si.siWordpress), t('PHP', si.siPhp), t('Elementor', si.siElementor), t('WooCommerce', si.siWoocommerce), t('HTML', si.siHtml5), t('CSS', si.siCss), t('JavaScript', si.siJavascript), t('jQuery', si.siJquery), t('Shopify', si.siShopify), t('Laravel', si.siLaravel), t('Vue.js', si.siVuedotjs), t('Inertia', si.siInertia), t('PrimeVue', si.siPrimevue), t('Vite', si.siVite), t('Node.js', si.siNodedotjs), t('MySQL', si.siMysql)],
  [t('GoHighLevel'), t('HubSpot', si.siHubspot), t('Klaviyo'), t('Mailchimp', si.siMailchimp), t('Brevo', si.siBrevo), t('Stripe', si.siStripe), t('PayPal', si.siPaypal), t('Figma', si.siFigma), t('Astro', si.siAstro), t('Three.js', si.siThreedotjs), t('Docker', si.siDocker), t('Git', si.siGit), t('GitHub', si.siGithub), t('Cloudflare Pages', si.siCloudflarepages), t('DigitalOcean', si.siDigitalocean), t('Claude', si.siClaude)],
];
const dir = new URL('.', import.meta.url);
const out = readFileSync(new URL('code.template.js', dir), 'utf8').replace('__TOOLS__', JSON.stringify(rows));
writeFileSync(new URL('code.js', dir), out);
console.log('code.js written,', rows.flat().length, 'tools,', out.length, 'bytes');
