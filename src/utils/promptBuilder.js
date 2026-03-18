/**
 * promptBuilder.js — The heart of the Noor app.
 *
 * Constructs safe, aesthetic, non-representational image prompts
 * for the Pollinations AI image generation API.
 *
 * Every prompt enforces these rules:
 * - No humans, faces, figures, text, calligraphy, or Arabic script
 * - No prophet names or divine names
 * - Photorealistic abstract landscape style
 * - Cinematic lighting with atmospheric, painterly quality
 */

import { getRevelationType, ayahCounts } from './surahMeta'

// ---------------------------------------------------------------------------
// Mood style mappings — each mood adds a distinct visual atmosphere
// ---------------------------------------------------------------------------
const moodStyles = {
  contemplative: "soft diffused light, muted earth tones, misty, serene, vast empty landscape",
  awe: "dramatic golden light, towering scale, storm clouds parting, celestial rays, epic",
  tender: "warm amber glow, intimate, gentle, dawn light, soft bokeh, peaceful",
}

// ---------------------------------------------------------------------------
// Hardcoded thematic prompts for surahs 1–20
//
// Each theme captures the visual essence of the surah's content
// without referencing religious figures or divine names directly.
// These themes are the most important part of the image generation —
// they determine what the AI "sees" when generating imagery.
// ---------------------------------------------------------------------------
const surahThemes = {
  // Al-Fatiha: The Opening — light, guidance, a path revealed
  1: "golden light breaking through clouds over still water, dawn sky",

  // Al-Baqarah: The Cow — vast narrative spanning guidance and law
  2: "vast desert landscape at twilight, distant mountains, lone tree",

  // Aal-E-Imran: Family of Imran — steadfastness, high aspirations
  3: "high mountain peaks above clouds, dawn light, stillness",

  // An-Nisa: The Women — flowing networks of kinship and care
  4: "river delta seen from above, branching waterways, golden hour",

  // Al-Ma'idah: The Table Spread — covenant, sustenance, open plains
  5: "ancient stone archway opening to an open plain, sunlight",

  // Al-An'am: The Cattle — creation, night sky, deep contemplation
  6: "deep night sky full of stars over a dark ocean horizon",

  // Al-A'raf: The Heights — gardens, barriers, ancient civilizations
  7: "lush garden overgrown with vines, ancient stone walls, warm light",

  // Al-Anfal: The Spoils of War — storms, divine intervention
  8: "stormy sea with a shaft of light breaking through dark clouds",

  // At-Tawbah: The Repentance — stark truth, barren paths, turning
  9: "barren rocky terrain, single path winding through, stark light",

  // Yunus: Jonah — the sea, the moon, deep reflection
  10: "crescent moon rising over calm ocean, deep blue dusk",

  // Hud: Prophet Hud — rain on parched earth, renewal
  11: "rain falling on dry earth, desert blooming, dramatic sky",

  // Yusuf: Joseph — the well, patience, golden providence
  12: "deep well surrounded by ancient stone in a desert, golden light",

  // Ar-Ra'd: The Thunder — power of nature, awe
  13: "lightning striking over a vast plain at night, storm sky",

  // Ibrahim: Abraham — deep roots, shade, eternal growth
  14: "roots of a great tree seen from below, light filtering through canopy",

  // Al-Hijr: The Rocky Tract — ancient paths, carved stone
  15: "long straight road disappearing into flat horizon, dusk sky",

  // An-Nahl: The Bee — intricate creation, natural beauty
  16: "honeybee close up on a flower, extreme macro, warm bokeh",

  // Al-Isra: The Night Journey — night, cities of light
  17: "night cityscape from above, lights like stars, dark sky",

  // Al-Kahf: The Cave — refuge, hidden valleys, transcendence
  18: "cave entrance opening to a vast sunlit valley beyond",

  // Maryam: Mary — solitude, palm trees, desert springs
  19: "palm tree bending in desert wind, clear blue sky, stillness",

  // Ta-Ha: Ta-Ha — sacred fire, mountainside, divine encounter
  20: "burning bush on a rocky hillside at dusk, ember glow",
}

// ---------------------------------------------------------------------------
// Safety suffix — appended to EVERY prompt without exception.
// This prevents the AI from generating inappropriate content.
// ---------------------------------------------------------------------------
const SAFETY_SUFFIX = "no humans, no faces, no figures, no text, no calligraphy, no Arabic script, no animals, photorealistic abstract landscape"

// ---------------------------------------------------------------------------
// Style anchor — consistent cinematic quality across all images
// ---------------------------------------------------------------------------
const STYLE_ANCHOR = "cinematic lighting, atmospheric, painterly, wide angle"

// ---------------------------------------------------------------------------
// Fallback theme generator for surahs 21–114
//
// Strategy:
// - Meccan surahs (cosmic, faith-oriented) get celestial/desert imagery
// - Medinan surahs (community, earthly guidance) get landscape/water imagery
// - Longer surahs (>50 ayahs) get expansive, wide landscapes
// - Shorter surahs (<=50 ayahs) get intimate, close-up scenes
// ---------------------------------------------------------------------------

// Meccan visual pools
const meccanExpansive = [
  "vast star-filled desert night sky with Milky Way visible, sand dunes stretching to horizon",
  "towering red rock canyon at golden hour, dramatic shadows and warm light",
  "endless sand dunes under a burning sunset, wind trails in the sand",
  "volcanic landscape at dawn with mist rising from dark rocky terrain",
  "sweeping view of a meteor shower over a silent desert plateau",
  "ancient weathered mountains under swirling dramatic clouds at dusk",
  "vast salt flat reflecting a perfectly mirrored sunset sky",
]

const meccanIntimate = [
  "single candle flame in darkness, warm amber light on ancient stone",
  "dew drops on desert flowers at first light, extreme close-up",
  "cracks in dry earth with a single green shoot emerging, morning light",
  "polished obsidian stone reflecting starlight, dark and mysterious",
  "smoke wisps rising from incense in still air, warm golden tones",
  "frost crystals forming intricate patterns on dark glass at dawn",
  "embers glowing in darkness, warm red and amber tones, intimate",
]

// Medinan visual pools
const medinanExpansive = [
  "wide river valley at sunrise, mist hanging over green fields and orchards",
  "terraced hillsides with flowing water channels, lush greenery, golden hour",
  "oasis surrounded by palm groves, calm reflective pool, warm afternoon light",
  "sweeping coastal landscape with waves meeting golden sand at sunset",
  "rolling green hills under dramatic cloud formations, shafts of light breaking through",
  "ancient stone aqueduct stretching across a misty valley at dawn",
  "vast olive grove on hillsides, silver-green leaves catching warm light",
]

const medinanIntimate = [
  "morning dew on a fig leaf, soft light filtering through branches",
  "smooth river stones in clear flowing water, warm sunlight patterns",
  "honey dripping from a wooden spoon in warm golden light, close-up",
  "woven basket of dates in warm amber interior light, rustic setting",
  "rain drops on a still pond creating concentric circles, peaceful",
  "wheat stalks bending in gentle breeze, golden sunset backlighting",
  "pomegranate split open revealing seeds, warm studio-like lighting",
]

/**
 * Generate a fallback theme for surahs 21-114 based on their
 * revelation type and length.
 *
 * @param {number} surahNumber - The surah number (21-114)
 * @returns {string} A descriptive visual theme string
 */
function getFallbackTheme(surahNumber) {
  const revelationType = getRevelationType(surahNumber)
  const count = ayahCounts[surahNumber] || 30
  const isExpansive = count > 50

  // Use surah number as a deterministic index into the pool
  let pool
  if (revelationType === 'Meccan') {
    pool = isExpansive ? meccanExpansive : meccanIntimate
  } else {
    pool = isExpansive ? medinanExpansive : medinanIntimate
  }

  const index = (surahNumber - 21) % pool.length
  return pool[index]
}

// ---------------------------------------------------------------------------
// Main export: buildPrompt
// ---------------------------------------------------------------------------

/**
 * Build a complete image generation prompt for a given surah and mood.
 *
 * The final prompt follows this structure:
 *   [surahTheme], [moodStyle], [styleAnchor], [safetySuffix]
 *
 * @param {{ number: number, englishName: string }} surahMeta
 *   Object with surah number and English name
 * @param {'contemplative'|'awe'|'tender'} mood
 *   The selected mood that influences the visual style
 * @returns {string} The complete prompt string ready for URL encoding
 *
 * @example
 *   buildPrompt({ number: 1, englishName: 'Al-Faatiha' }, 'contemplative')
 *   // => "golden light breaking through clouds over still water, dawn sky,
 *   //     soft diffused light, muted earth tones, misty, serene, vast empty landscape,
 *   //     cinematic lighting, atmospheric, painterly, wide angle,
 *   //     no humans, no faces, no figures, no text, ..."
 */
export function buildPrompt(surahMeta, mood = 'contemplative') {
  const surahNumber = surahMeta.number || 1
  const moodStyle = moodStyles[mood] || moodStyles.contemplative

  // Get the surah-specific theme (hardcoded for 1-20, generated for 21-114)
  const theme = surahThemes[surahNumber] || getFallbackTheme(surahNumber)

  // Assemble the final prompt
  return `${theme}, ${moodStyle}, ${STYLE_ANCHOR}, ${SAFETY_SUFFIX}`
}

export default buildPrompt
