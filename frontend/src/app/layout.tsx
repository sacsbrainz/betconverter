import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "~/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Bet Converter",
  description: "Covert betting codes from one platform to another",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: [{ name: "sacsbrainz", url: "https://sacsbrainz.com" }],
  creator: "sacsbrainz",
  twitter: {
    card: "summary_large_image",
    site: "@site",
    creator: "@creator",
    images: "https://betconvert.sacsbrainz.com/og.png",
  },
  manifest: "https://betconvert.sacsbrainz.com/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://betconvert.sacsbrainz.com",
    title: "Bet Converter",
    description: "Covert betting codes from one platform to another",
    siteName: "Betconverter",
    images: [
      {
        url: "https://betconvert.sacsbrainz.com/og.png",
      },
    ],
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
