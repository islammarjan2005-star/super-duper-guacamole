import { useState, useMemo } from 'react'
import { useSurahList } from '../hooks/useQuran'

/**
 * SurahList — fixed left sidebar listing all 114 surahs.
 * Includes a search input to filter by name or number.
 */
export default function SurahList({ onSurahSelect, selectedSurahNumber }) {
  const { surahs, loading, error, retry } = useSurahList()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return surahs
    const q = search.toLowerCase().trim()
    return surahs.filter((s) =>
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      String(s.number).includes(q)
    )
  }, [surahs, search])

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="shimmer h-10 rounded-lg" />
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="p-3 flex gap-3 items-center">
              <div className="shimmer w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-4 rounded w-3/4" />
                <div className="shimmer h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="font-amiri text-2xl text-text-muted mb-2">
          عذراً
        </p>
        <p className="text-text-muted text-sm mb-4">
          Could not load surahs
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 rounded-lg bg-surface-card border border-[#2a2520] text-text-muted hover:text-text-primary hover:border-[#c4963a] transition-all text-sm cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search surahs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search surahs"
          className="w-full px-3 py-2 rounded-lg bg-surface-card border border-[#2a2520] text-text-primary placeholder-text-muted text-sm font-inter focus:outline-none focus:border-[#c4963a] transition-colors"
        />
      </div>

      {/* Surah list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filtered.map((surah) => {
          const isActive = surah.number === selectedSurahNumber
          return (
            <button
              key={surah.number}
              onClick={() => onSurahSelect(surah.number)}
              className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 mb-0.5 cursor-pointer ${
                isActive
                  ? 'bg-surface-hover border-l-2 border-[#c4963a]'
                  : 'hover:bg-surface-card border-l-2 border-transparent'
              }`}
            >
              {/* Surah number */}
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3d3830] text-[#c4963a] text-xs flex items-center justify-center font-inter">
                {surah.number}
              </span>

              {/* Names */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-text-primary truncate font-inter">
                    {surah.englishName}
                  </span>
                  <span
                    dir="rtl"
                    lang="ar"
                    className="text-base font-amiri text-text-muted flex-shrink-0"
                  >
                    {surah.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-text-muted truncate">
                    {surah.englishNameTranslation}
                  </span>
                  <span className="text-xs text-text-muted">
                    {surah.numberOfAyahs} ayahs
                  </span>
                </div>
              </div>
            </button>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-text-muted text-sm py-8">
            No surahs found
          </p>
        )}
      </div>
    </div>
  )
}
