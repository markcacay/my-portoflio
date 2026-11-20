// One node per real integration; each points at the case study that shows it.
// x/y are the 600×560 poster coordinates; z is depth for the 3D scene; r is radius in poster px.
export type Tone = 'ink' | 'far' | 'cobalt';
export interface IntegrationNode { id: string; label: string; x: number; y: number; z: number; r: number; tone: Tone; project: string; line: string; href: string }

export const nodes: IntegrationNode[] = [
  { id: 'wp', label: 'WordPress', x: 290, y: 290, z: 0, r: 50, tone: 'ink', project: 'Six sites and counting', line: 'Most of my work starts here.', href: '/work/' },
  { id: 'ghl', label: 'GoHighLevel', x: 480, y: 120, z: 0.6, r: 30, tone: 'ink', project: 'Virtual Assistant Talent', line: 'Two-step booking synced to the GoHighLevel calendar.', href: '/work/virtual-assistant-talent/' },
  { id: 'hubspot', label: 'HubSpot', x: 540, y: 300, z: 1.2, r: 34, tone: 'cobalt', project: 'My Medical Affairs', line: 'Google and LinkedIn sign-ups land in HubSpot as leads.', href: '/work/my-medical-affairs/' },
  { id: 'klaviyo', label: 'Klaviyo', x: 450, y: 470, z: -1, r: 22, tone: 'far', project: 'Saffron & More', line: 'Abandoned carts get an automatic follow-up email.', href: '/work/saffron-and-more/' },
  { id: 'woo', label: 'WooCommerce', x: 170, y: 470, z: 0.8, r: 32, tone: 'ink', project: "L'Orenta Nuts", line: 'A holiday store that allows one order per customer.', href: '/work/lorenta-nuts/' },
  { id: 'slots', label: 'Delivery-slot API', x: 110, y: 300, z: -1.4, r: 20, tone: 'far', project: 'Getfish', line: "Checkout only offers slots for the customer's postcode.", href: '/work/getfish/' },
  { id: 'laravel', label: 'Laravel + Vue', x: 170, y: 110, z: 0.4, r: 28, tone: 'ink', project: 'Pageant Poll', line: 'My own voting SaaS, built outside WordPress.', href: '/work/pageant-poll/' },
  { id: 'paypal', label: 'PayPal', x: 60, y: 160, z: -1.2, r: 18, tone: 'far', project: 'Pageant Poll', line: 'Fans buy supporter packs through PayPal.', href: '/work/pageant-poll/' },
];

// [from, to, control point x, y, dashed]
export const wires: [string, string, number, number, boolean?][] = [
  ['wp', 'ghl', 420, 160], ['wp', 'hubspot', 430, 320], ['wp', 'klaviyo', 380, 420], ['wp', 'woo', 210, 400],
  ['wp', 'slots', 180, 280], ['wp', 'laravel', 220, 170, true], ['laravel', 'paypal', 110, 120],
];
