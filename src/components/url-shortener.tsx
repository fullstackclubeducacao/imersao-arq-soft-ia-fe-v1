import { zodResolver } from '@hookform/resolvers/zod'
import { LinkIcon } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'

import { LengthTape } from '@/components/length-tape'
import { ShortLinkCard } from '@/components/short-link-card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { useShortenUrl } from '@/hooks/use-shorten-url'
import { ApiError } from '@/lib/api'
import { normalizeUrl } from '@/lib/url'

const INVALID_URL_MESSAGE =
  'Esse endereço não parece válido. Confira se ele tem um domínio, como exemplo.com.'

const formSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Cole um link para encurtar.')
    .max(2048, 'Esse link passa de 2048 caracteres, o limite aceito.')
    .refine((value) => normalizeUrl(value) !== null, INVALID_URL_MESSAGE),
})

type FormValues = z.infer<typeof formSchema>

function getErrorMessage(error: Error) {
  if (error instanceof ApiError) {
    return error.code === 'VALIDATION_ERROR'
      ? INVALID_URL_MESSAGE
      : 'O servidor não conseguiu encurtar esse link. Tente de novo em instantes.'
  }
  return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
}

export function UrlShortener() {
  const shorten = useShortenUrl()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  })
  const value = useWatch({ control: form.control, name: 'url' })

  const isShowingResult =
    shorten.isSuccess && normalizeUrl(value) === shorten.variables

  function onSubmit({ url }: FormValues) {
    shorten.mutate(normalizeUrl(url)!, {
      onError: (error) => {
        form.setError('url', { type: 'server', message: getErrorMessage(error) })
      },
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <FieldGroup>
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Link para encurtar</FieldLabel>
                <InputGroup className="h-12">
                  <InputGroupAddon>
                    <LinkIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="https://exemplo.com/um-endereco-bem-comprido"
                    aria-invalid={fieldState.invalid}
                    className="font-mono text-sm"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="submit"
                      variant="default"
                      size="sm"
                      disabled={shorten.isPending}
                      className="h-9 px-4"
                    >
                      {shorten.isPending && <Spinner data-icon="inline-start" />}
                      {shorten.isPending ? 'Encurtando…' : 'Encurtar'}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <LengthTape
          length={isShowingResult ? shorten.data.longUrl.length : value.trim().length}
          shortLength={isShowingResult ? shorten.data.shortUrl.length : undefined}
        />
      </form>

      {shorten.data && (
        <ShortLinkCard key={shorten.data.shortCode} link={shorten.data} />
      )}
    </div>
  )
}
