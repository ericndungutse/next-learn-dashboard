import '@/app/ui/global.css';
import inter from './ui/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        {/* Alert */}
        {/* Only shared among /app/routes not deeper */}
        {/* <div className='bg-yellow-400 text-black p-2 text-center'>
          <p>Alert: Your account is due for renewal.</p>
        </div> */}
        {children}
      </body>
    </html>
  );
}
