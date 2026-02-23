import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

const STATE_SLUGS = [
  'alabama','alaska','arizona','arkansas','california','colorado','connecticut',
  'delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa',
  'kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan',
  'minnesota','mississippi','missouri','montana','nebraska','nevada','new-hampshire',
  'new-jersey','new-mexico','new-york','north-carolina','north-dakota','ohio',
  'oklahoma','oregon','pennsylvania','rhode-island','south-carolina','south-dakota',
  'tennessee','texas','utah','vermont','virginia','washington','west-virginia',
  'wisconsin','wyoming'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lfsdirectory.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/add-store`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/tools`, priority: 0.6, changeFrequency: 'monthly' },
  ]

  // State pages
  const statePages: MetadataRoute.Sitemap = STATE_SLUGS.map(state => ({
    url: `${baseUrl}/${state}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  // All store pages
  const { data: stores } = await supabase
    .from('stores')
    .select('slug, city, state, updated_at')
    .not('slug', 'is', null)
    .limit(5000)

  const STATE_ABBR_TO_SLUG: Record<string, string> = {
    'AL':'alabama','AK':'alaska','AZ':'arizona','AR':'arkansas','CA':'california',
    'CO':'colorado','CT':'connecticut','DE':'delaware','FL':'florida','GA':'georgia',
    'HI':'hawaii','ID':'idaho','IL':'illinois','IN':'indiana','IA':'iowa','KS':'kansas',
    'KY':'kentucky','LA':'louisiana','ME':'maine','MD':'maryland','MA':'massachusetts',
    'MI':'michigan','MN':'minnesota','MS':'mississippi','MO':'missouri','MT':'montana',
    'NE':'nebraska','NV':'nevada','NH':'new-hampshire','NJ':'new-jersey','NM':'new-mexico',
    'NY':'new-york','NC':'north-carolina','ND':'north-dakota','OH':'ohio','OK':'oklahoma',
    'OR':'oregon','PA':'pennsylvania','RI':'rhode-island','SC':'south-carolina',
    'SD':'south-dakota','TN':'tennessee','TX':'texas','UT':'utah','VT':'vermont',
    'VA':'virginia','WA':'washington','WV':'west-virginia','WI':'wisconsin','WY':'wyoming'
  }

  const storePages: MetadataRoute.Sitemap = (stores || [])
    .filter(s => s.slug && s.city && s.state)
    .map(store => {
      const stateSlug = STATE_ABBR_TO_SLUG[store.state.toUpperCase()] || store.state.toLowerCase()
      const citySlug = store.city.toLowerCase().replace(/\s+/g, '-')
      return {
        url: `${baseUrl}/${stateSlug}/${citySlug}/${store.slug}`,
        lastModified: store.updated_at ? new Date(store.updated_at) : new Date(),
        priority: 0.7,
        changeFrequency: 'weekly' as const,
      }
    })

  return [...staticPages, ...statePages, ...storePages]
}
