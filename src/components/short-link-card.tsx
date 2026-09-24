import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ShortenedUrl } from "@/lib/api";

const COPIED_FEEDBACK_MS = 2000;

interface ShortLinkCardProps {
  link: ShortenedUrl;
}

export function ShortLinkCard({ link }: ShortLinkCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timeout = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setIsCopied(true);
      toast.success("Link copiado");
    } catch {
      toast.error(
        "Não foi possível copiar. Selecione o link e copie manualmente.",
      );
    }
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
      <CardHeader>
        <CardTitle>Link encurtado</CardTitle>
        <CardDescription className="truncate" title={link.longUrl}>
          {link.longUrl}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xl font-medium break-all underline-offset-4 hover:underline sm:text-2xl"
        >
          {link.shortUrl}
        </a>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <Button onClick={handleCopy}>
          {isCopied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {isCopied ? "Copiado" : "Copiar link"}
        </Button>
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline" })}
        >
          <ExternalLinkIcon data-icon="inline-start" />
          Abrir link
        </a>
      </CardFooter>
    </Card>
  );
}
