import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { SkinProvider } from '../components/claireos/SkinContext'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SkinProvider>
        <Component {...pageProps} />
        <Analytics />
      </SkinProvider>
    </ThemeProvider>
  )
}

export default MyApp

// <ThemeProvider defaultTheme="light" attribute="class">
