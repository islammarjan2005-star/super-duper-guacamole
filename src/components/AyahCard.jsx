import { memo } from 'react'

/**
 * AyahCard — displays a single ayah with Arabic text and English translation.
 * Memoized because surah 2 (Al-Baqarah) has 286 ayahs, and we don't want
 * mood changes or other parent re-renders to cascade into every card.
 */
const AyahCard = memo(function AyahCard({ arabicText, englishText, ayahNumber }) {
  return (
    <div className="py-6 border-b border-[#2a2520] last:border-b-0">
      {/* Ayah number badge */}
      <div className="flex items-start gap-4 mb-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3d3830] text-[#c4963a] text-sm flex items-center justify-center font-inter mt-1">
          {ayahNumber}
        </span>

        {/* Arabic text */}
        <p
          dir="rtl"
          lang="ar"
          className="flex-1 text-right font-amiri text-[28px] leading-[1.8] text-text-primary"
        >
          {arabicText}
        </p>
      </div>

      {/* English translation */}
      <p className="text-[15px] leading-relaxed text-text-muted pl-12 font-inter">
        {englishText}
      </p>
    </div>
  )
})

export default AyahCard
