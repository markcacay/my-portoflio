import * as si from 'simple-icons';

type Icon = { slug: string; path: string; hex: string };
export interface Tool { name: string; icon?: Icon }
const t = (name: string, icon?: Icon): Tool => ({ name, icon });

// Logos from Simple Icons (CC0). GoHighLevel and Klaviyo have no icon there, so they show as name-only chips.
export const toolRows: Tool[][] = [
  [t('WordPress', si.siWordpress), t('PHP', si.siPhp), t('Elementor', si.siElementor), t('WooCommerce', si.siWoocommerce),
   t('HTML', si.siHtml5), t('CSS', si.siCss), t('JavaScript', si.siJavascript), t('jQuery', si.siJquery), t('Shopify', si.siShopify),
   t('Laravel', si.siLaravel), t('Vue.js', si.siVuedotjs), t('Inertia', si.siInertia), t('PrimeVue', si.siPrimevue),
   t('Vite', si.siVite), t('Node.js', si.siNodedotjs), t('MySQL', si.siMysql)],
  [t('GoHighLevel'), t('HubSpot', si.siHubspot), t('Klaviyo'), t('Mailchimp', si.siMailchimp), t('Brevo', si.siBrevo),
   t('Stripe', si.siStripe), t('PayPal', si.siPaypal), t('Figma', si.siFigma), t('Astro', si.siAstro), t('Three.js', si.siThreedotjs),
   t('Docker', si.siDocker), t('Git', si.siGit), t('GitHub', si.siGithub), t('Cloudflare Pages', si.siCloudflarepages),
   t('DigitalOcean', si.siDigitalocean), t('Claude', si.siClaude)],
];
