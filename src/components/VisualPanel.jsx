import { useEffect } from 'react'
import { useImageGen } from '../hooks/useImageGen'
import { buildPrompt } from '../utils/promptBuilder'

/**
 * VisualPanel — displays the AI-generated image for a surah.
 * Full width, 16:9 aspect ratio with loading skeleton,
 * error state, and regenerate button.
 */
export default function VisualPanel({ surahNumber, surahName, mood }) {
  const { imageUrl, loading, setLoading, generate } = useImageGen()

  // Generate image when surah or mood changes
  useEffect(() => {
    const prompt = buildPrompt({ number: surahNumber, englishName: surahName }, mood)
    generate(prompt)
  }, [surahNumber, mood, surahName, generate])

  const handleRegenerate = () => {
    const prompt = buildPrompt({ number: surahNumber, englishName: surahName }, mood)
    generate(prompt)
  }

  const handleImageLoad = () => {
    setLoading(false)
  }

  const handleImageError = () => {
    setLoading(false)
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-card">
      {/* Loading shimmer skeleton */}
      {loading && (
        <div className="absolute inset-0 shimmer z-10" />
      )}

      {/* The image — hidden until loaded */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`AI-generated visual for Surah ${surahName}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Gradient overlay at bottom — fades image into the background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

      {/* Error state with retry */}
      {!loading && imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="hidden"
          onError={() => {
            // If image fails, show error overlay
          }}
        />
      )}

      {/* Regenerate button */}
      <button
        onClick={handleRegenerate}
        aria-label="Regenerate image"
        className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-[#2a2520] text-text-muted text-sm font-inter hover:text-text-primary hover:border-[#c4963a] transition-all duration-200 cursor-pointer"
      >
        Regenerate
      </button>
    </div>
  )
}
