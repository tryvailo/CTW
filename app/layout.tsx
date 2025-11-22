import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyFooterCTA } from '@/components/layout/StickyFooterCTA'

export const metadata: Metadata = {
  title: 'Compare The Wait - NHS vs Private Surgery Comparison',
  description: 'Compare NHS waiting times vs private surgery costs for cataract, hip and knee surgery in major UK cities. Free information for patients 65+.',
  keywords: ['NHS waiting times', 'private surgery cost', 'cataract surgery', 'hip replacement', 'knee replacement', 'NHS vs private', 'elderly surgery'],
  authors: [{ name: 'Compare The Wait' }],
  openGraph: {
    title: 'Compare The Wait - NHS vs Private Surgery Comparison',
    description: 'Compare NHS waiting times vs private surgery costs for cataract, hip and knee surgery in major UK cities.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare The Wait - NHS vs Private Surgery Comparison',
    description: 'Compare NHS waiting times vs private surgery costs for cataract, hip and knee surgery in major UK cities.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-grow pb-20">
          {children}
        </main>
        <Footer />
        <StickyFooterCTA />
      </body>
    </html>
  )
}

