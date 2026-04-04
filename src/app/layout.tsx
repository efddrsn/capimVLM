import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DentAI — Avaliação Dental com IA",
  description:
    "Em menos de 2 minutos, tire uma foto da boca e receba uma avaliação inicial com linguagem simples, estimativa de custo e simulação visual do resultado.",
  openGraph: {
    title: "DentAI — Avaliação Dental com IA",
    description:
      "Pré-triagem dental por imagem com inteligência artificial. Rápido, gratuito e privado.",
    type: "website",
    locale: "pt_BR",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0284c7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🦷</span>
              <span className="font-bold text-lg text-sky-700">DentAI</span>
            </Link>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              beta
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-4">
          <div className="max-w-lg mx-auto px-4 text-center">
            <p className="text-xs text-gray-400">
              DentAI — Avaliação educativa e informativa.
              <br />
              Não substitui consulta com dentista.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
