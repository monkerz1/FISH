'use client'

interface Club {
  id: string
  name: string
  slug: string
  city: string
  state: string
  website: string | null
  facebook_url: string | null
  focus: string[]
  meeting_frequency: string | null
  description: string | null
  is_verified: boolean
  member_count_approx: number | null
  founded_year: number | null
}

interface ClubsGridProps {
  clubs: Club[]
  focusColors: Record<string, string>
}

export function ClubsGrid({ clubs, focusColors }: ClubsGridProps) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-6">
        Showing {clubs.length} {clubs.length === 1 ? 'club' : 'clubs'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clubs.map(club => (
          <div
            key={club.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
          >
            {/* Club name + verified badge */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="font-bold text-gray-800 text-base leading-tight">{club.name}</h2>
              {club.is_verified && (
                <span className="shrink-0 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>

            {/* City */}
            <p className="text-gray-500 text-sm mb-3">
              {club.city}, {club.state}
            </p>

            {/* Focus tags */}
            {(club.focus || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {club.focus.map((f: string) => (
                  <span
                    key={f}
                    className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${focusColors[f] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {club.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
                {club.description}
              </p>
            )}

            {/* Meta info */}
            <div className="text-xs text-gray-400 space-y-1 mb-4">
              {club.meeting_frequency && (
                <div>📅 Meets {club.meeting_frequency}</div>
              )}
              {club.member_count_approx && (
                <div>👥 ~{club.member_count_approx.toLocaleString()} members</div>
              )}
              {club.founded_year && (
                <div>🗓 Founded {club.founded_year}</div>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-2 mt-auto">
              {club.website && (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Visit Website
                </a>
              )}
              {club.facebook_url && (
                <a
                  href={club.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-blue-50 text-blue-700 text-sm py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors border border-blue-200"
                >
                  Facebook
                </a>
              )}
              {!club.website && !club.facebook_url && (
                <span className="text-gray-400 text-xs italic">No links listed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
