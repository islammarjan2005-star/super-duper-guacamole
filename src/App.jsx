import { useState } from 'react'
import SurahList from './components/SurahList'
import SurahViewer from './components/SurahViewer'

export default function App() {
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSurahSelect = (number) => {
    setSelectedSurah(number)
    setSidebarOpen(false) // Auto-close on mobile
  }

  return (
    <div className="flex h-screen bg-surface text-text-primary font-inter">
      {/* Mobile hamburger button */}
      <button
        onClick={() => setSidebarOpen(true)}
        aria-label="Open surah list"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-surface-card border border-[#2a2520] flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 lg:z-auto top-0 left-0 h-full w-72 bg-surface border-r border-[#2a2520] flex-shrink-0 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App title */}
        <div className="p-4 border-b border-[#2a2520]">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-inter font-light tracking-[0.2em] uppercase text-[#c4963a]">
              Noor
            </h1>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-text-muted mt-0.5">Quran Visual Companion</p>
        </div>

        {/* Surah list */}
        <div className="h-[calc(100%-73px)]">
          <SurahList
            onSurahSelect={handleSurahSelect}
            selectedSurahNumber={selectedSurah}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <SurahViewer surahNumber={selectedSurah} />
      </main>
    </div>
  )
}
