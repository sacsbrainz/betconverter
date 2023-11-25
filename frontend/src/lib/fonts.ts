import { Poppins as FontPoppins } from "next/font/google";

export const fontPoppins = FontPoppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});
