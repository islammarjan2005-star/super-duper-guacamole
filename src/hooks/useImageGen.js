import { useState, useCallback } from 'react'

/**
 * Hook for generating AI images via the Pollinations API.
 *
 * Pollinations works as a URL-based API — the URL itself IS the image.
 * We preload via a hidden Image() object to detect load/error
 * before showing anything to the user.
 */
export function useImageGen() {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const generate = useCallback((prompt) => {
    setLoading(true)
    setError(false)
    setImageUrl(null)

    const seed = Math.floor(Math.random() * 999999)
    const encoded = encodeURIComponent(prompt)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`

    // Preload the image to detect success/failure before rendering
    const img = new Image()
    img.onload = () => {
      setImageUrl(url)
      setLoading(false)
    }
    img.onerror = () => {
      setLoading(false)
      setError(true)
    }
    img.src = url
  }, [])

  return { imageUrl, loading, error, generate }
}

export default useImageGen
