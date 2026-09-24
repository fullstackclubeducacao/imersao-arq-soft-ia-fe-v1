import { UrlShortener } from '@/components/url-shortener'

function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto w-full max-w-2xl px-4 py-6">
        <span className="font-heading text-lg font-semibold tracking-tight">
          curto<span className="text-tape">.</span>
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 pt-[8vh] pb-16">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            Deixe seu link do{' '}
            <span className="underline decoration-tape decoration-[0.18em] underline-offset-[0.12em]">
              tamanho certo
            </span>
            .
          </h1>
          <p className="max-w-lg text-lg text-pretty text-muted-foreground">
            Cole um endereço longo e receba um link curto, pronto para
            compartilhar.
          </p>
        </div>

        <UrlShortener />
      </main>
    </div>
  )
}

export default App
