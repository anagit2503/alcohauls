import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { Bodoni_Moda, Hanken_Grotesk } from 'next/font/google'
import Layout from '@/components/Layout'
import '@/styles/globals.css'

const display = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-display', adjustFontFallback: false })
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Noma Wine & Liquor — Wine, spirits and beer in NoMa, DC</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Noma Wine &amp; Liquor, 40 Patterson St NE, Washington DC. Shop wine, whisky, tequila, beer and more." />
      </Head>
      <style jsx global>{`
        :root { --font-display: ${display.style.fontFamily}; --font-sans: ${sans.style.fontFamily}; }
      `}</style>
      <div className={`${display.variable} ${sans.variable}`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </SessionProvider>
  )
}
