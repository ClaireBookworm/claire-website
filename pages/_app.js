import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
	    <Analytics />
    </ThemeProvider>
  )
}

export default MyApp

// <ThemeProvider defaultTheme="light" attribute="class">
