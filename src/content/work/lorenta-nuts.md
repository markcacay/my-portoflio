---
title: A holiday store with a one-order-per-customer rule
client: L'Orenta Nuts, gourmet nuts and candy (US)
summary: A seasonal WooCommerce store on its own subdomain, with a check that stops repeat orders on limited deals.
role: WooCommerce developer
stack: [WordPress, WooCommerce, PHP, JavaScript]
problem: For Christmas and New Year sales, L'Orenta runs a holiday version of the store with its own theme and prices. Deals were limited to one order per customer, but WooCommerce's built-in limit let customers buy again while their first order was still processing.
approach: I set up the holiday store on a subdomain with the same features as the main shop. Before checkout, a check looks up the customer's email against earlier purchases of that product, including orders still processing, and stops a second order.
result: Each customer can claim a holiday deal once, even while their earlier order is still being packed.
url: https://www.lorentanuts.com/
cover: ../../assets/work/lorenta-nuts/desktop.png
gallery: [../../assets/work/lorenta-nuts/mobile.png]
featured: false
order: 5
kind: wordpress
---
