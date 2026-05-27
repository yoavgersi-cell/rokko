import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#2D7D5A] flex items-center justify-center">
                <PawPrint className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-xl font-bold text-white">Rokko</span>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5 max-w-xs">
              הבית החדש לבעלי חיות בישראל. מחברים בין בעלי כלבים וחתולים לאנשים שאפשר לסמוך עליהם.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9CA3AF] text-sm hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              @rokko.il
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">שירותים</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/search?service=boarding', label: 'דוגסיטר' },
                { href: '/search?service=sitting', label: 'האוסיטינג' },
                { href: '/search?service=walking', label: 'דוגווקר' },
                { href: '/search?service=daycare', label: 'פנסיון' },
                { href: '/search?service=vet', label: 'וטרינרים' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[#9CA3AF] text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Providers */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">הצטרפות</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/join', label: 'הצטרפו כדוגסיטר' },
                { href: '/join', label: 'הצטרפו כדוגווקר' },
                { href: '/join', label: 'הצטרפו כוטרינר' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#9CA3AF] text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">מידע</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/coming-soon', label: 'איך זה עובד' },
                { href: '/coming-soon', label: 'אודות Rokko' },
                { href: '/coming-soon', label: 'צור קשר' },
                { href: '/coming-soon', label: 'פרטיות' },
                { href: '/coming-soon', label: 'תנאי שימוש' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#9CA3AF] text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#6B7280] text-xs">
            © 2026 Rokko. כל הזכויות שמורות.
          </p>
          <p className="text-[#6B7280] text-xs">
            נבנה מאהבה, צועד עם הקהילה
          </p>
        </div>
      </div>
    </footer>
  );
}
