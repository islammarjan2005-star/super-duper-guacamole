import { useState, useCallback } from 'react'

/**
 * Hook for generating AI images via the Pollinations API.
 *
 * Pollinations works as a URL-based API — the URL itself IS the image.
 * We construct the URL with the encoded prompt and parameters,
 * then let an <img> tag load it. Image preloading is handled via
 * the onLoad/onError callbacks on the img element.
 *
 * @returns {{ imageUrl: string|null, loading: boolean, setLoading: Function, generate: Function }}
 */
export function useImageGen() {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = useCallback((prompt) => {
    setLoading(true)
    const seed = Math.floor(Math.random() * 999999)
    const encoded = encodeURIComponent(prompt)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`
    // Set the URL — the VisualPanel component will use onLoad/onError
    // on the <img> element to track when it finishes loading
    setImageUrl(url)
  }, [])

  return { imageUrl, loading, setLoading, generate }
}

export default useImageGen
