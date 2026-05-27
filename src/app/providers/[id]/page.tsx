import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, CheckCircle, Clock, Share2, MessageCircle, Shield, ChevronLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProviderById, PROVIDERS, DOG_SIZE_LABELS, SERVICES } from '@/lib/data';
import { ServiceType } from '@/lib/types';
import MobileStickyBar from './MobileStickyBar';

const SERVICE_LABELS: Record<string, string> = {
  boarding: 'לינה ביתית',
  sitting: 'שמירה בבית',
  walking: 'טיולים',
  daycare: 'טיפול יומי',
  grooming: 'טיפוח',
  training: 'אילוף',
  vet: 'וטרינר',
  taxi: 'הסעות',
};

const SERVICE_PRICE_LABELS: Record<string, string> = {
  boarding: '/ לילה',
  sitting: '/ ביקור',
  walking: '/ טיול',
  daycare: '/ יום',
  grooming: '/ טיפול',
  training: '/ שיעור',
  vet: '/ ביקור',
  taxi: '/ נסיעה',
};

export function generateStaticParams() {
  return PROVIDERS.map((p) => ({ id: p.id }));
}

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = getProviderById(id);

  if (!provider) {
    notFound();
  }

  const whatsappUrl = `https://wa.me/${provider.whatsapp}?text=${encodeURIComponent('שלום, ראיתי את הפרופיל שלך ב-Rokko')}`;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-[#FAFAF8]">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Link href="/" className="hover:text-[#2D7D5A] transition-colors">בית</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href="/search" className="hover:text-[#2D7D5A] transition-colors">מארחים</Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[#1A1A1A] font-medium">{provider.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== LEFT COLUMN (Main Content) ===== */}
            <div className="lg:col-span-2 space-y-8">

              {/* Gallery */}
              <section>
                <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden">
                  <Image
                    src={provider.images[0]}
                    alt={`${provider.name} תמונה ראשית`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
                {provider.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {provider.images.slice(1, 4).map((img, i) => (
                      <div key={i} className="relative h-24 md:h-32 rounded-xl overflow-hidden">
                        <Image
                          src={img}
                          alt={`${provider.name} תמונה ${i + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 1024px) 33vw, 22vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Provider Header */}
              <section className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-[#E8F5EE]">
                    <Image
                      src={provider.avatar}
                      alt={provider.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-black text-[#1A1A1A]">{provider.name}</h1>
                        <div className="flex items-center gap-1.5 text-[#6B7280] text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          {provider.city}, {provider.neighborhood}
                        </div>
                      </div>
                      <button className="p-2 rounded-xl border border-[#E8E8E6] hover:bg-[#F5F5F3] transition-colors">
                        <Share2 className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    </div>

                    {/* Rating + Verified */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 bg-[#FFF9E6] px-3 py-1.5 rounded-xl">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-[#1A1A1A]">{provider.rating}</span>
                        <span className="text-[#6B7280] text-sm">({provider.reviewCount} ביקורות)</span>
                      </div>

                      {provider.verified && (
                        <div className="flex items-center gap-1.5 bg-[#E8F5EE] px-3 py-1.5 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-[#2D7D5A]" />
                          <span className="text-[#2D7D5A] font-semibold text-sm">מארח מאומת</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[#6B7280] text-sm">
                        <Clock className="w-4 h-4" />
                        מגיב {provider.responseTime}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* About */}
              <section className="bg-white rounded-2xl p-6 card-shadow">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">על {provider.name}</h2>
                <p className="text-[#4B5563] leading-relaxed">{provider.bio}</p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E8E8E6]">
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#2D7D5A]">{provider.yearsExperience}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">שנות ניסיון</div>
                  </div>
                  <div className="text-center border-x border-[#E8E8E6]">
                    <div className="text-2xl font-black text-[#2D7D5A]">{provider.repeatCustomers}%</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">לקוחות חוזרים</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#2D7D5A]">{provider.responseTime}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">זמן תגובה</div>
                  </div>
                </div>
              </section>

              {/* Services & Pricing */}
              <section className="bg-white rounded-2xl p-6 card-shadow">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">שירותים ומחירים</h2>
                <div className="space-y-3">
                  {provider.services.map((serviceId) => {
                    const serviceInfo = SERVICES.find((s) => s.id === serviceId);
                    return (
                      <div
                        key={serviceId}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E8E6]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{serviceInfo?.icon}</span>
                          <div>
                            <p className="font-semibold text-[#1A1A1A]">{SERVICE_LABELS[serviceId]}</p>
                            <p className="text-[#6B7280] text-xs">{serviceInfo?.description}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className="text-xl font-black text-[#1A1A1A]">₪{provider.pricePerNight}</span>
                          <span className="text-[#6B7280] text-xs mr-1">{SERVICE_PRICE_LABELS[serviceId]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Home Environment */}
              <section className="bg-white rounded-2xl p-6 card-shadow">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">סביבת הבית</h2>
                <div className="flex flex-wrap gap-2 mb-5">
                  {provider.homeEnvironment.map((env) => (
                    <span
                      key={env}
                      className="bg-[#E8F5EE] text-[#2D7D5A] font-medium text-sm px-4 py-2 rounded-xl"
                    >
                      ✓ {env}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#E8E8E6]">
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-3">גדלי כלבים מתקבלים:</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.dogSizes.map((size) => (
                      <span
                        key={size}
                        className="bg-[#F5F5F3] text-[#4B5563] text-sm px-3 py-1.5 rounded-lg font-medium"
                      >
                        {DOG_SIZE_LABELS[size]}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1A1A1A]">
                    ביקורות ({provider.reviewCount})
                  </h2>
                  <div className="flex items-center gap-2 bg-[#FFF9E6] px-4 py-2 rounded-xl">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-black text-[#1A1A1A]">{provider.rating}</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {provider.reviews.map((review) => (
                    <div key={review.id} className="pb-5 border-b border-[#E8E8E6] last:border-0 last:pb-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={review.authorAvatar}
                            alt={review.authorName}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-[#1A1A1A] text-sm">{review.authorName}</p>
                              <p className="text-[#6B7280] text-xs">
                                בעל/ת {review.dogName} • {review.service}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[#4B5563] text-sm leading-relaxed">{review.text}</p>
                      <p className="text-[#9CA3AF] text-xs mt-2">
                        {new Date(review.date).toLocaleDateString('he-IL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ===== RIGHT COLUMN (Sticky Sidebar) ===== */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl p-6 card-shadow border border-[#E8E8E6]">
                  {/* Price */}
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black text-[#1A1A1A]">₪{provider.pricePerNight}</span>
                    <span className="text-[#6B7280] text-sm pb-1">/ לילה</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-6">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-[#1A1A1A] text-sm">{provider.rating}</span>
                    <span className="text-[#6B7280] text-sm">({provider.reviewCount} ביקורות)</span>
                  </div>

                  <p className="font-semibold text-[#1A1A1A] text-center mb-4">
                    חיבור ישיר עם {provider.name}
                  </p>

                  {/* WhatsApp Button */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20bd5b] transition-colors mb-3 text-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    שלח הודעה בווטסאפ
                  </a>

                  <button className="w-full py-3.5 rounded-xl border-2 border-[#2D7D5A] text-[#2D7D5A] font-semibold text-sm hover:bg-[#E8F5EE] transition-colors mb-6">
                    בקש פרטים נוספים
                  </button>

                  {/* Trust Points */}
                  <div className="space-y-3 pt-4 border-t border-[#E8E8E6]">
                    {[
                      { icon: Shield, text: 'תשלום מאובטח' },
                      { icon: CheckCircle, text: 'ביטוח מלא לכל הטיפולים' },
                      { icon: CheckCircle, text: 'מאומת ובדוק' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-sm text-[#4B5563]">
                        <Icon className="w-4 h-4 text-[#2D7D5A] flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <MobileStickyBar
        price={provider.pricePerNight}
        providerName={provider.name}
        whatsappUrl={whatsappUrl}
      />

      <Footer />
    </>
  );
}
