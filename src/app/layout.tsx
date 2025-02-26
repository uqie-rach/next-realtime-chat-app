import Providers from '@/components/Providers'
import './globals.css'
import { nunito } from '@/lib/font'

// Done after the video and optional: add page metadata
export const metadata = {
  title: 'FriendZone | Home',
  description: 'Welcome to the FriendZone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={nunito.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
