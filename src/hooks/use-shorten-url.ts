import { useMutation } from '@tanstack/react-query'

import { shortenUrl } from '@/lib/api'

export function useShortenUrl() {
  return useMutation({
    mutationKey: ['shorten-url'],
    mutationFn: shortenUrl,
  })
}
