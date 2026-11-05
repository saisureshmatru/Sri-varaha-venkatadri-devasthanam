import { Poppins } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/public/PublicLayoutWrapper";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { LanguageProvider } from "@/contexts/LanguageContext";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Temple Management Platform",
  description: "Official Temple Management and Donation Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <ThemeRegistry>
          <LanguageProvider>
            <PublicLayoutWrapper>
              {children}
            </PublicLayoutWrapper>
          </LanguageProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
