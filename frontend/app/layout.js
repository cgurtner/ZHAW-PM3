import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ZHAW-PM3',
  description: 'This app is powering our PM3 ideas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  )
}