import type { NextConfig } from "next";

const STATE_SLUG_TO_ABBR: Record<string, string> = {
  'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar',
  'california': 'ca', 'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de',
  'florida': 'fl', 'georgia': 'ga', 'hawaii': 'hi', 'idaho': 'id',
  'illinois': 'il', 'indiana': 'in', 'iowa': 'ia', 'kansas': 'ks',
  'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
  'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms',
  'missouri': 'mo', 'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv',
  'new-hampshire': 'nh', 'new-jersey': 'nj', 'new-mexico': 'nm', 'new-york': 'ny',
  'north-carolina': 'nc', 'north-dakota': 'nd', 'ohio': 'oh', 'oklahoma': 'ok',
  'oregon': 'or', 'pennsylvania': 'pa', 'rhode-island': 'ri', 'south-carolina': 'sc',
  'south-dakota': 'sd', 'tennessee': 'tn', 'texas': 'tx', 'utah': 'ut',
  'vermont': 'vt', 'virginia': 'va', 'washington': 'wa', 'west-virginia': 'wv',
  'wisconsin': 'wi', 'wyoming': 'wy'
}

const stateRedirects = Object.entries(STATE_SLUG_TO_ABBR).flatMap(([full, abbr]) => [
  // /california -> /ca
  {
    source: `/${full}`,
    destination: `/${abbr}`,
    permanent: true,
  },
  // /california/:city -> /ca/:city
  {
    source: `/${full}/:city`,
    destination: `/${abbr}/:city`,
    permanent: true,
  },
  // /california/:city/:store -> /ca/:city/:store
  {
    source: `/${full}/:city/:store`,
    destination: `/${abbr}/:city/:store`,
    permanent: true,
  },
])

const nextConfig: NextConfig = {
  trailingSlash: false,
  allowedDevOrigins: ['scrapper'],
  async redirects() {
    return stateRedirects
  },
  async rewrites() {
    return [
      {
        source: '/blog/:slug',
        destination: '/blog/:slug',
      },
    ]
  },
};

export default nextConfig;
