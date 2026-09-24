/**
 * Aceita "exemplo.com/caminho" e devolve "https://exemplo.com/caminho".
 * Retorna null quando o texto não vira um endereço http(s) válido.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  if (!URL.canParse(withProtocol)) return null

  const url = new URL(withProtocol)
  const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
  const hasDomain = url.hostname.includes('.') || url.hostname === 'localhost'

  return isHttp && hasDomain ? withProtocol : null
}
