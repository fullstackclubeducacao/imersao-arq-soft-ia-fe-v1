import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

const MAJOR_STEPS = [10, 25, 50, 100, 250, 500]

interface LengthTapeProps {
  /** Quantidade de caracteres do link longo. */
  length: number
  /** Quantidade de caracteres do link curto, quando já existe. */
  shortLength?: number
}

/**
 * Fita métrica que mede o link em caracteres. Enquanto a pessoa digita, a
 * fita cresce; quando o link é encurtado, ela recolhe até o tamanho novo e
 * deixa o contorno do tamanho original para comparação.
 */
export function LengthTape({ length, shortLength }: LengthTapeProps) {
  const isShortened = shortLength !== undefined
  const scale = Math.max(100, Math.ceil(length / 50) * 50)
  const majorStep =
    MAJOR_STEPS.find((step) => scale / step <= 6) ?? MAJOR_STEPS.at(-1)!
  const minorStep = majorStep / 5
  const marks = Array.from(
    { length: Math.floor(scale / majorStep) + 1 },
    (_, index) => index * majorStep,
  )

  const toPercent = (value: number) => `${Math.min(value / scale, 1) * 100}%`
  const fillWidth = toPercent(isShortened ? shortLength : length)

  return (
    <figure className="flex flex-col gap-2">
      <div aria-hidden className="flex flex-col gap-1">
        <div
          className="relative h-7 overflow-hidden rounded-sm bg-muted"
          style={
            {
              '--minor': toPercent(minorStep),
              '--major': toPercent(majorStep),
            } as CSSProperties
          }
        >
          {isShortened && (
            <div
              className="absolute inset-y-0 left-0 rounded-sm border-2 border-dashed border-tape"
              style={{ width: toPercent(length) }}
            />
          )}
          <div
            className="absolute inset-y-0 left-0 rounded-sm bg-tape transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ width: fillWidth }}
          />
          <div className="tape-ticks pointer-events-none absolute inset-0" />
        </div>
        <div className="relative h-4 font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
          {marks.map((mark) => (
            <span
              key={mark}
              className={cn(
                'absolute top-0',
                mark === scale && '-translate-x-full',
                mark !== 0 && mark !== scale && '-translate-x-1/2',
              )}
              style={{ left: toPercent(mark) }}
            >
              {mark}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <TapeCaption length={length} shortLength={shortLength} />
      </figcaption>
    </figure>
  )
}

function TapeCaption({ length, shortLength }: LengthTapeProps) {
  if (shortLength !== undefined) {
    const savings = Math.max(0, Math.round((1 - shortLength / length) * 100))
    return (
      <>
        <span>
          De <strong className="font-mono text-foreground">{length}</strong>{' '}
          para <strong className="font-mono text-foreground">{shortLength}</strong>{' '}
          caracteres
        </span>
        <span className="font-mono text-foreground">{savings}% menor</span>
      </>
    )
  }

  if (length === 0) {
    return <span>Cole um link para ver o tamanho dele.</span>
  }

  return (
    <span>
      <strong className="font-mono text-foreground">{length}</strong>{' '}
      {length === 1 ? 'caractere' : 'caracteres'}
    </span>
  )
}
