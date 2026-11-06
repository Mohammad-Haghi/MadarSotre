<p align="center">
  <a href="https://www.medusajs.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
      <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg" height="58">
    </picture>
  </a>
</p>
<h1 align="center">Production-ready Medusa DTC Starter</h1>

<p align="center">
  Storefront
</p>

<h4 align="center">
  <a href="https://docs.gorgojs.com/tools/medusa-dtc-starter">Starter documentation</a> |
  <a href="https://dtc-starter-demo.gorgojs.com">Live demo</a> |
  <a href="https://gorgojs.com">Gorgo</a>
</h4>

<p align="center">
  The Next.js storefront of <a href="../../README.md">Medusa DTC Starter by Gorgo</a> offers a modal checkout with address autocomplete, a filterable catalog with instant search, a Persian interface, and SEO with an <code>llms.txt</code> endpoint.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/next--intl-4-1e293b" alt="next-intl 4" />
  <img src="https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
</p>

## Commands

| Task | pnpm | npm | yarn |
|---|---|---|---|
| Start on port 8000 with Turbopack | `pnpm dev` | `npm run dev` | `yarn dev` |
| Production build (`standalone` output) | `pnpm build` | `npm run build` | `yarn build` |
| Serve the build on port 8000 | `pnpm start` | `npm start` | `yarn start` |
| Run ESLint | `pnpm lint` | `npm run lint` | `yarn lint` |
| Build with the bundle analyzer enabled | `pnpm analyze` | `npm run analyze` | `yarn analyze` |

`lint` and `analyze` load `next.config.js` like a build does, so both need `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in the environment or in `.env.local`.

## Environment Variables

Copy [`.env.template`](.env.template) to `.env.local`. `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is the only variable the app refuses to start without, because [`check-env-variables.js`](check-env-variables.js) runs from `next.config.js`. The Default column is the value the template ships.

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Publishable API key from the Medusa backend. Required | — |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Backend base URL | `http://localhost:9000` |
| `NEXT_PUBLIC_DEFAULT_REGION` | You use Iran (`ir`) as the only country. The storefront always selects Iran | `ir` |
| `NEXT_PUBLIC_BASE_URL` | Storefront base URL, used for absolute URLs in metadata, the sitemap, and `llms.txt` | `https://localhost:8000` |
| `NEXT_PUBLIC_SITE_NAME` | Store name in the header, footer, checkout, `schema.org` markup, and `llms.txt` | `فروشگاه مادر` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID, `G-XXXXXXXXXX`. Leave empty to ship no analytics at all | — |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key, only needed when paying through Stripe | — |
| `NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY` | Medusa Cloud Payments publishable key, used when `NEXT_PUBLIC_STRIPE_KEY` is empty | — |
| `NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID` | Connected account that key charges on behalf of, passed to Stripe as `stripeAccount` | — |
| `NEXT_PUBLIC_ADDRESS_AUTOCOMPLETE_PROVIDER` | Address autocomplete provider; `dadata`, or anything else for manual entry | `dadata` |
| `NEXT_PUBLIC_ADDRESS_AUTOCOMPLETE_PROVIDER_API_KEY` | API token for the address autocomplete provider | — |
| `GEOLOCATION_PROVIDER` | Inactive while the storefront uses Iran as its only country | `ip-api` |
| `GEOLOCATION_PROVIDER_API_KEY` | Inactive while the storefront uses Iran as its only country | — |
| `GEOLOCATION_DEBUG` | Inactive while the storefront uses Iran as its only country | `false` |
| `REVALIDATE_SECRET` | Shared secret checked on `api/revalidate`; must match the backend's value | `supersecret` |
| `MEDUSA_CLOUD_S3_HOSTNAME`, `MEDUSA_CLOUD_S3_PATHNAME` | Add the Medusa Cloud bucket to the allowed image hosts | — |
| `NODE_ENV` | Node environment | `development` |

See [Set Up Country Detection](https://docs.gorgojs.com/tools/medusa-dtc-starter/setup-country-detection) and [Set Up Address Autocomplete](https://docs.gorgojs.com/tools/medusa-dtc-starter/setup-address-autocomplete) for what the two pluggable providers do and how to add one of your own.

## Analytics

With `NEXT_PUBLIC_GA_MEASUREMENT_ID` set, [`GoogleAnalytics`](src/modules/common/components/google-analytics/index.tsx) holds `gtag.js` back until the browser goes idle after load, or until the visitor first scrolls, taps, clicks or types, capped at 3 seconds, which keeps the script out of Largest Contentful Paint and Total Blocking Time. That has two consequences. A visitor who closes the tab within the first second is never counted, and the tag loads for everyone, so a shop serving the EU or the UK needs a consent banner in front of it. Client-side navigation reports on its own, as long as **Enhanced Measurement** is on for the property.

Installation, features, deployment, and everything else that spans both apps live in the [root README](../../README.md).

## Persian Storefront

You use Persian as the only interface language, with right-to-left layouts and `/fa` routes. The storefront ignores other browser language preferences and redirects old language URLs to Persian. The navigation shows no region or language selector. You always shop in Iran, regardless of your location or a previous country cookie.

You maintain interface text in `messages/fa.json`. You keep only the Persian catalog.

## Local Font

You use the bundled IRANSansX variable web font for interface text and controls. You keep its font file in `src/assets/fonts`. The root layout loads and preloads it through `next/font/local`, and Tailwind uses the same family.


## Persian And Iran Configuration

You use Persian as the only storefront and Admin interface language and Iran as the only sales region. Fresh databases seed Persian and the Iranian rial.

For an existing database, run `npm run configure:persian` from `apps/backend`. This removes other regions and catalog locales, restricts store currencies to the Iranian rial, and adds Persian catalog translations. Restart both apps afterward.


## Customer Login

Customers sign in with a username and password. You open the customer account creation page at `/app/customer-accounts` in Admin and enter their Iranian mobile number, username and password. Email is optional and the form does not request it. You can also reach the form from the link above the customer list. Open an existing customer details page to change their credentials. You can change either value there. Leave the password blank to keep it unchanged. Passwords require 8 to 256 characters and you cannot read a saved password.

Usernames accept 3 to 64 letters, digits, dots, hyphens or underscores. The backend trims and normalizes usernames and ignores letter case. You keep customer email addresses for order communication. Customers contact you for an account or a password reset. Admin staff continue to sign in with email and password.


## Storefront Theme

You use an emerald, gold and ivory theme throughout the storefront. You set shared Medusa color tokens in `src/styles/globals.css` and the neutral palette in `tailwind.config.js`. The header, footer, mobile navigation and checkout header share the `store-chrome` class. Product previews use `store-product-card`. You edit the homepage banner text in the `Hero` section of `messages/fa.json`.
