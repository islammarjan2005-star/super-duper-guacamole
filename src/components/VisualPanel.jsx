import { useEffect, useRef } from 'react'
import { useImageGen } from '../hooks/useImageGen'
import { buildPrompt } from '../utils/promptBuilder'

/**
 * VisualPanel — displays the AI-generated image for a surah.
 * Full width, 16:9 aspect ratio with loading skeleton,
 * error state with retry, and regenerate button.
 */
export default function VisualPanel({ surahNumber, surahName, mood }) {
  const { imageUrl, loading, error, generate } = useImageGen()
  const promptRef = useRef('')

  const buildAndGenerate = () => {
    const prompt = buildPrompt({ number: surahNumber, englishName: surahName }, mood)
    promptRef.current = prompt
    generate(prompt)
  }

  // Generate image when surah or mood changes
  useEffect(() => {
    buildAndGenerate()
  }, [surahNumber, mood, surahName])

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-card">
      {/* Loading shimmer skeleton */}
      {loading && (
        <div className="absolute inset-0 shimmer z-10" />
      )}

      {/* Successfully loaded image */}
      {imageUrl && !loading && !error && (
        <img
          src={imageUrl}
          alt={`AI-generated visual for Surah ${surahName}`}
          className="w-full h-full object-cover animate-[fadeIn_0.7s_ease-in]"
        />
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-card z-10">
          <p className="text-text-muted text-sm mb-3">Image failed to load</p>
          <button
            onClick={buildAndGenerate}
            className="px-4 py-2 rounded-lg bg-[#1e1b17] border border-[#2a2520] text-[#c4963a] text-sm font-inter hover:bg-[#2a2520] transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Gradient overlay at bottom */}
      {imageUrl && !error && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
      )}

      {/* Regenerate button — only show when image is loaded */}
      {imageUrl && !loading && !error && (
        <button
          onClick={buildAndGenerate}
          aria-label="Regenerate image"
          className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-[#2a2520] text-text-muted text-sm font-inter hover:text-text-primary hover:border-[#c4963a] transition-all duration-200 cursor-pointer"
        >
          Regenerate
        </button>
      )}
    </div>
  )
}
