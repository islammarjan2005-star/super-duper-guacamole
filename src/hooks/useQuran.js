import { useState, useEffect, useRef, useCallback } from 'react'

const API_BASE = 'https://api.alquran.cloud/v1'

/**
 * Hook to fetch the list of all 114 surahs.
 * Fetches once on mount and caches the result.
 */
export function useSurahList() {
  const [surahs, setSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cached = useRef(null)

  const fetchSurahs = useCallback(async () => {
    if (cached.current) {
      setSurahs(cached.current)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/surah`)
      if (!res.ok) throw new Error(`API returned ${res.status}`)
      const json = await res.json()
      const data = json.data
      cached.current = data
      setSurahs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSurahs()
  }, [fetchSurahs])

  return { surahs, loading, error, retry: fetchSurahs }
}

/**
 * Hook to fetch a single surah with Arabic text and English translation.
 * Uses the editions endpoint to get both in one call.
 * Caches fetched surahs to avoid re-fetching.
 *
 * @param {number} surahNumber - 1-indexed surah number
 */
export function useSurah(surahNumber) {
  const [ayahs, setAyahs] = useState([])
  const [surahInfo, setSurahInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cache = useRef(new Map())

  const fetchSurah = useCallback(async (number, signal) => {
    // Check cache first
    if (cache.current.has(number)) {
      const cached = cache.current.get(number)
      setAyahs(cached.ayahs)
      setSurahInfo(cached.surahInfo)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${API_BASE}/surah/${number}/editions/quran-uthmani,en.asad`,
        { signal }
      )
      if (!res.ok) throw new Error(`API returned ${res.status}`)
      const json = await res.json()

      // data[0] = Arabic (quran-uthmani), data[1] = English (en.asad)
      const arabicEdition = json.data[0]
      const englishEdition = json.data[1]

      const mergedAyahs = arabicEdition.ayahs.map((ayah, i) => ({
        number: ayah.numberInSurah,
        arabic: ayah.text,
        english: englishEdition.ayahs[i].text,
      }))

      const info = {
        number: arabicEdition.number,
        name: arabicEdition.name,
        englishName: arabicEdition.englishName,
        englishNameTranslation: arabicEdition.englishNameTranslation,
        numberOfAyahs: arabicEdition.numberOfAyahs,
        revelationType: arabicEdition.revelationType,
      }

      // Cache the result
      cache.current.set(number, { ayahs: mergedAyahs, surahInfo: info })

      setAyahs(mergedAyahs)
      setSurahInfo(info)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!surahNumber) return

    const controller = new AbortController()
    fetchSurah(surahNumber, controller.signal)

    return () => controller.abort()
  }, [surahNumber, fetchSurah])

  const retry = useCallback(() => {
    fetchSurah(surahNumber)
  }, [surahNumber, fetchSurah])

  return { ayahs, surahInfo, loading, error, retry }
}
