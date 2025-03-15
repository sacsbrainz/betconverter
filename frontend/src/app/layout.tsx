import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "~/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://betconverter.xyz"),
  title: "Betting Code Converter | SportyBet, MSport, Stake, BangBet",
  description: "Convert betting codes instantly between SportyBet, MSport, Stake, BangBet and other platforms. Compare odds, transfer bet slips, and optimize your betting strategy for free.",
  authors: [{ name: "sacsbrainz", url: "https://sacsbrainz.com" }],
  keywords: [
    'SportyBet', 'MSport', 'Stake', 'BangBet',
    'football betting', 'betting converter', 'odds comparison',
    'bet code converter', 'betting slip transfer',
    'free betting tools', 'sports betting'
  ],
  creator: "sacsbrainz",
  twitter: {
    card: "summary_large_image",
    site: "@site",
    creator: "@creator",
    title: "Betting Code Converter | Transfer Slips Between Platforms",
    description: "Free tool to convert betting codes between SportyBet, MSport, Stake, BangBet. Compare odds and maximize your betting strategy.",
    images: ['/twitter-image.png'],
  },
  openGraph: {
    title: "Betting Code Converter | SportyBet, MSport, Stake, BangBet",
    description: "Convert betting codes seamlessly between SportyBet, MSport, Stake, BangBet and other major betting platforms. Compare football odds, transfer bet slips, and maximize your sports betting strategy with our free converter tool.",
    images: [{
      url: '/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'Site preview'
    }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}