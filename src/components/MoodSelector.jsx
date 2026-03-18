const moods = [
  { key: 'contemplative', label: 'Contemplative' },
  { key: 'awe', label: 'Awe' },
  { key: 'tender', label: 'Tender' },
]

/**
 * MoodSelector — three pill-shaped toggle buttons for selecting
 * the visual mood of AI-generated imagery.
 */
export default function MoodSelector({ selectedMood, onMoodChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {moods.map(({ key, label }) => {
        const isActive = selectedMood === key
        return (
          <button
            key={key}
            onClick={() => onMoodChange(key)}
            aria-pressed={isActive}
            className={`px-4 py-2 rounded-full text-sm font-inter transition-all duration-300 border cursor-pointer ${
              isActive
                ? 'border-[#c4963a] text-[#c4963a] bg-[#c4963a]/10'
                : 'border-[#2a2520] text-text-muted hover:border-[#3d3830] hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
