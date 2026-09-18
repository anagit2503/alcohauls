import Head from 'next/head'
import { Bodoni_Moda, Hanken_Grotesk } from 'next/font/google'
import Layout from '@/components/Layout'
import '@/styles/globals.css'

const display = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-display', adjustFontFallback: false })
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Alcohauls — Wine, spirits and beer delivered</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Shop wine, champagne, whisky, gin and more. Same-day delivery when you order by 4pm." />
      </Head>
      <style jsx global>{`
        :root { --font-display: ${display.style.fontFamily}; --font-sans: ${sans.style.fontFamily}; }
      `}</style>
      <div className={`${display.variable} ${sans.variable}`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  )
}
