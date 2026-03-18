import { useState, useRef, useEffect } from 'react'
import { useSurah } from '../hooks/useQuran'
import MoodSelector from './MoodSelector'
import VisualPanel from './VisualPanel'
import AyahCard from './AyahCard'

/**
 * SurahViewer — main content area showing the surah's visual panel,
 * mood selector, and list of ayahs with Arabic + English text.
 */
export default function SurahViewer({ surahNumber }) {
  const { ayahs, surahInfo, loading, error, retry } = useSurah(surahNumber)
  const [mood, setMood] = useState('contemplative')
  const containerRef = useRef(null)

  // Scroll to top when surah changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }
  }, [surahNumber])

  // Loading state
  if (loading) {
    return (
      <div ref={containerRef} className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header skeleton */}
        <div className="mb-6 space-y-3">
          <div className="shimmer h-8 rounded w-48" />
          <div className="shimmer h-5 rounded w-72" />
        </div>

        {/* Mood selector skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-9 w-28 rounded-full" />
          ))}
        </div>

        {/* Image skeleton */}
        <div className="shimmer w-full aspect-video rounded-xl mb-8" />

        {/* Ayah skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="py-6 border-b border-[#2a2520] space-y-3">
            <div className="flex gap-4">
              <div className="shimmer w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-6 rounded w-full" />
                <div className="shimmer h-6 rounded w-3/4" />
              </div>
            </div>
            <div className="pl-12 space-y-2">
              <div className="shimmer h-4 rounded w-full" />
              <div className="shimmer h-4 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="font-amiri text-4xl text-text-muted mb-3" dir="rtl" lang="ar">
          عذراً
        </p>
        <p className="text-text-muted text-sm mb-1">
          Could not load this surah
        </p>
        <p className="text-text-muted/60 text-xs mb-4">
          {error}
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

  if (!surahInfo) return null

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* Surah header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl lg:text-3xl font-inter font-light text-text-primary">
            {surahInfo.englishName}
          </h1>
          <span className="px-2 py-0.5 rounded text-xs font-inter bg-surface-card text-text-muted border border-[#2a2520]">
            {surahInfo.revelationType}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-text-muted text-sm font-inter">
            {surahInfo.englishNameTranslation} &middot; {surahInfo.numberOfAyahs} ayahs
          </p>
          <p dir="rtl" lang="ar" className="font-amiri text-xl text-text-muted">
            {surahInfo.name}
          </p>
        </div>
      </div>

      {/* Mood selector */}
      <div className="mb-4">
        <MoodSelector selectedMood={mood} onMoodChange={setMood} />
      </div>

      {/* AI Visual Panel */}
      <div className="mb-8">
        <VisualPanel
          surahNumber={surahNumber}
          surahName={surahInfo.englishName}
          mood={mood}
        />
      </div>

      {/* Ayah list */}
      <div>
        {ayahs.map((ayah) => (
          <AyahCard
            key={ayah.number}
            arabicText={ayah.arabic}
            englishText={ayah.english}
            ayahNumber={ayah.number}
          />
        ))}
      </div>
    </div>
  )
}
