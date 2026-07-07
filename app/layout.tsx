import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Mudámos o nome para evitar conflito
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair", // Mudámos o nome para evitar conflito
});

export const metadata: Metadata = {
  // Nome e emoji fixos que aparecerão em todas as abas do projeto
  title: "Recipe Hub", 
  description: "A cookbook that remembers every taste you love.",
  // Ícone padrão apontando para a sua pasta public
  icons: {
    icon: "/fivecon.svg", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FAF8F5] text-[#2A2927] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}