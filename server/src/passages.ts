const API_BASE = process.env.CLIENT_URL || "http://localhost:3000"

// Fallback passage in case the API is unreachable
const FALLBACK_PASSAGE =
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How quickly daft jumping zebras vex a lazy hound."

/**
 * Fetches a random passage from the Next.js API.
 * Falls back to a hardcoded string if the API is down.
 */
export async function getRandomPassage(): Promise<string> {
    try {
        const res = await fetch(`${API_BASE}/api/passages/random`)

        if (!res.ok) {
            console.warn(`Passage API returned ${res.status}, using fallback`)
            return FALLBACK_PASSAGE
        }

        const data = await res.json() as { text: string }
        return data.text
    } catch (err) {
        console.error("Failed to fetch passage from API, using fallback:", err)
        return FALLBACK_PASSAGE
    }
}