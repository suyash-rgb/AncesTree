import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fira-code",
});

export const metadata = {
  title: "AncesTree",
  description: "Git lineage visualizer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={firaCode.variable}>
      <body>{children}</body>
    </html>
  );
}
