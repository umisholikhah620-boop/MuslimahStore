import './globals.css'

export const metadata = {
  title: 'Muslimah Store',
  description: 'Ahlan wa Sahlan, Ukhti',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
