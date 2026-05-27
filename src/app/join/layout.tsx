import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מחפשים מארחים ואנשי מקצוע לחיות מחמד | Rokko',
  description:
    'רוקו בונה את קהילת מארחי חיות המחמד הראשונה בישראל — ומחפשים אנשים כמוכם. ההצטרפות ללא עלות, וכל פרופיל עובר בדיקה ידנית.',
  openGraph: {
    title: 'רוצים שבעלי כלבים וחתולים ימצאו אתכם?',
    description:
      'Rokko בונה את הקהילה הראשונה בישראל למארחים ואנשי מקצוע לחיות מחמד. הצטרפו עכשיו — ללא עלות, עם פרופיל שעובר בדיקה ידנית.',
    url: 'https://rokko.co.il/join',
    siteName: 'Rokko',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=630&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'הצטרפו כמארח ל-Rokko',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'רוצים שבעלי כלבים וחתולים ימצאו אתכם?',
    description:
      'Rokko בונה את הקהילה הראשונה בישראל למארחים ואנשי מקצוע לחיות מחמד. הצטרפו עכשיו — ללא עלות.',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=630&auto=format&fit=crop&q=80',
    ],
  },
  alternates: {
    canonical: 'https://rokko.co.il/join',
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
