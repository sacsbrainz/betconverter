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
    images: "https://betconverter.xyz/og.png",
  },
  manifest: "https://betconverter.xyz/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://betconverter.xyz",
    title: "Bet Converter",
    description: "Covert betting codes from one platform to another",
    siteName: "Betconverter",
    images: [
      {
        url: "https://betconverter.xyz/og.png",
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
