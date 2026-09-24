const API_URL =
  import.meta.env.VITE_API_URL ?? 'https://bitly.fullstackclub.com.br'

export interface ShortenedUrl {
  shortCode: string
  shortUrl: string
  longUrl: string
}

interface ApiErrorBody {
  error: string
  code: string
}

export class ApiError extends Error {
  readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export async function shortenUrl(url: string): Promise<ShortenedUrl> {
  const response = await fetch(`${API_URL}/api/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(
      body?.error ?? `Request failed with status ${response.status}`,
      body?.code ?? 'UNKNOWN_ERROR',
    )
  }

  return response.json()
}
