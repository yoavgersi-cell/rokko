import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rokko.co.il"),
  title: {
    default: "Rokko | בונים את הבית החדש לבעלי חיות מחמד בישראל",
    template: "%s | Rokko",
  },
  description:
    "פלטפורמה חדשה למציאת דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים אמינים לחיות המחמד שלכם.",
  keywords: [
    "מארח לכלב",
    "לינה לכלב",
    "דוגווקר",
    "שמירה על כלב",
    "מארח לחתול",
    "וטרינר עד הבית",
    "טיפול בחיות מחמד",
    "rokko",
    "רוקו",
    "כלבים ישראל",
  ],
  authors: [{ name: "Rokko" }],
  creator: "Rokko",
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://rokko.co.il",
    siteName: "Rokko",
    title: "Rokko | בונים את הבית החדש לבעלי חיות מחמד בישראל",
    description:
      "פלטפורמה חדשה למציאת דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים אמינים לחיות המחמד שלכם.",
    images: [
      {
        url: "/hero-old.png",
        width: 1200,
        height: 630,
        alt: "Rokko - קהילת מארחי חיות המחמד בישראל",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rokko | בונים את הבית החדש לבעלי חיות מחמד בישראל",
    description:
      "פלטפורמה חדשה למציאת דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים אמינים לחיות המחמד שלכם.",
    images: [
      "/hero-old.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://rokko.co.il",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF8]">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Rokko",
              url: "https://rokko.co.il",
              description:
                "קהילת מארחי חיות המחמד הראשונה בישראל — לינה ביתית, טיולים, שמירה בבית וביקורי בית.",
              areaServed: "IL",
              inLanguage: "he",
            }),
          }}
        />
      </body>
    </html>
  );
}
