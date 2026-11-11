import React, { useState } from 'react';
import {
  Sparkles,
  Truck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Gift,
  Star,
  Trees,
  CircleDot,
  Lightbulb,
} from 'lucide-react';
import {
  CHECKOUT_URL,
  PRODUCT_OFFER,
  IMAGES_CONFIG,
  BRAND_CONFIG,
  KitItem,
} from '../config';
import { SafeImage } from './SafeImage';
import { NucleoPayCheckoutModal } from './NucleoPayCheckoutModal';

interface StepOfferProps {
  userName: string;
}

export const StepOffer: React.FC<StepOfferProps> = ({ userName }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const personalizedTitle = PRODUCT_OFFER.headlineOffer.replace('{nome}', userName);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    // If CHECKOUT_URL is default '#' or empty, open the native NucleoPay checkout modal
    const isExternalCheckout = Boolean(CHECKOUT_URL && CHECKOUT_URL !== '#' && CHECKOUT_URL.trim() !== '');
    if (!isExternalCheckout) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const getItemIcon = (iconType: KitItem['iconType']) => {
    switch (iconType) {
      case 'tree':
        return <Trees className="w-6 h-6 text-emerald-400" />;
      case 'baubles':
        return <CircleDot className="w-6 h-6 text-[#f3c04d]" />;
      case 'star':
        return <Star className="w-6 h-6 text-amber-200 fill-amber-200/30" />;
      case 'lights':
        return <Lightbulb className="w-6 h-6 text-yellow-300" />;
      case 'bows':
        return <Gift className="w-6 h-6 text-[#f3c04d]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#d4af37]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1813] text-[#f8f5ee] pb-28 sm:pb-20">
      {/* 1. Header Section with Personalized Title */}
      <section className="pt-8 sm:pt-14 pb-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b3329]/80 border border-[#d4af37]/40 text-[#f3c04d] text-xs sm:text-sm font-medium tracking-wide mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Resultado Sob Medida</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#fdfbf7] tracking-tight leading-tight mb-4 text-balance">
            {personalizedTitle}
          </h1>

          <p className="text-base sm:text-lg text-[#ece5d6]/90 max-w-2xl mx-auto leading-relaxed text-balance">
            {PRODUCT_OFFER.commercialCall}
          </p>
        </div>
      </section>

      {/* 2. Main Product Showcase & Price Callout */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-[#13241d] to-[#0c1813] border border-[#d4af37]/35 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Top decorative light bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#f3c04d] to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Product Visual Area */}
              <div className="md:col-span-7 flex flex-col gap-3">
                <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/40 bg-[#08100d] shadow-xl group">
                  <SafeImage
                    src={IMAGES_CONFIG.kitMainProduct}
                    alt="Super Kit Árvore de Natal completo com pinheiro, bolinhas, estrela, luzes e lacinhos"
                    loading="eager"
                    className="w-full aspect-square sm:aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  
                  {/* Free Shipping Badge on Image */}
                  <div className="absolute top-3 left-3 bg-[#7f1d1d] text-[#fdfbf7] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-[#f3c04d]/50 flex items-center gap-1.5 shadow-lg">
                    <Truck className="w-3.5 h-3.5 text-[#f3c04d]" />
                    <span>{PRODUCT_OFFER.shippingBadge}</span>
                  </div>

                  {/* Complete Kit Badge */}
                  <div className="absolute bottom-3 right-3 bg-[#0c1813]/90 text-[#f3c04d] text-xs font-semibold px-3 py-1 rounded-full border border-[#d4af37]/40 backdrop-blur-sm">
                    Kit Completo 1,5m
                  </div>
                </div>

                <p className="text-[11px] text-[#ece5d6]/60 text-center italic">
                  Foto oficial do Super Kit Árvore de Natal com todos os itens inclusos
                </p>
              </div>

              {/* Purchase Box Details */}
              <div className="md:col-span-5 flex flex-col justify-center text-left">
                <div className="mb-2">
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                    Oferta Especial de Natal
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight mt-1">
                    {PRODUCT_OFFER.productName}
                  </h2>
                </div>

                <p className="text-sm text-[#ece5d6]/80 mb-6 leading-relaxed">
                  Decoração natalina completa, prática e elegante com a tradicional harmonia de verde, vermelho e dourado.
                </p>

                {/* Honest & Transparent Price Box */}
                <div className="bg-[#0c1813]/90 border border-[#d4af37]/40 rounded-2xl p-5 mb-6 shadow-inner">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-[#ece5d6]/70 uppercase tracking-wider">
                      Valor do Super Kit
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <Truck className="w-3 h-3" />
                      {PRODUCT_OFFER.shippingBadge}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#f3c04d] tracking-tight">
                      {PRODUCT_OFFER.price}
                    </span>
                  </div>

                  <p className="text-xs text-[#ece5d6]/70 mt-2">
                    Pagamento único com frete grátis incluso para entrega na sua residência.
                  </p>
                </div>

                {/* Primary Large Buy Button */}
                <a
                  href={CHECKOUT_URL}
                  onClick={handleBuyClick}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] hover:from-[#991b1b] hover:to-[#651313] text-[#fdfbf7] py-4 px-6 text-center font-bold text-base sm:text-lg tracking-wide shadow-xl wine-glow border border-[#f3c04d]/50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                  <span className="relative z-10">{PRODUCT_OFFER.primaryCta}</span>
                  <ArrowRight className="relative z-10 w-5 h-5 text-[#f3c04d] group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Trust cues */}
                <div className="mt-4 flex flex-col gap-1.5 text-xs text-[#ece5d6]/75">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Todos os 5 itens enviados juntos na mesma embalagem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Pinheiro de 1,5m pronto e simples para montagem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Emotional & Honest Benefits */}
      <section className="px-4 py-10 bg-[#08100d]/60 border-y border-[#d4af37]/15">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Por que escolher o Super Kit
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight mt-1">
              Uma celebração inesquecível sem dor de cabeça
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCT_OFFER.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-[#13241d]/70 border border-[#d4af37]/20 rounded-2xl p-5 hover:border-[#d4af37]/50 transition-colors shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7f1d1d]/40 border border-[#d4af37]/30 flex items-center justify-center text-[#f3c04d] mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#f3c04d]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#fdfbf7] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#ece5d6]/80 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Exactly 5 Items Included (Detailed Section with Lacinhos Dourados) */}
      <section className="px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              O que você recebe
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight mt-1">
              Tudo o que está incluso no seu Super Kit
            </h2>
            <p className="text-sm text-[#ece5d6]/80 mt-2">
              Exatamente os 5 componentes essenciais para montar sua árvore completa e cheia de vida.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {PRODUCT_OFFER.includedItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-[#13241d]/80 border border-[#d4af37]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:border-[#f3c04d]/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Numeric sequence / item icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#0c1813] border border-[#d4af37]/40 flex items-center justify-center shrink-0 shadow-inner">
                    {getItemIcon(item.iconType)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#d4af37]">0{idx + 1}.</span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#fdfbf7]">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#ece5d6]/80 mt-1 max-w-xl leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.badge && (
                  <span className="self-end sm:self-center shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-[#7f1d1d]/60 border border-[#d4af37]/40 text-[#f3c04d]">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Banner Highlight of the Complete Package */}
          <div className="mt-8 rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-xl bg-[#13241d]">
            <SafeImage
              src={IMAGES_CONFIG.kitOverviewBanner}
              alt="Super Kit Árvore de Natal com todos os itens e frete grátis"
              loading="lazy"
              className="w-full h-auto object-cover max-h-[480px]"
            />
          </div>
        </div>
      </section>

      {/* 5. "Como Fica Sua Árvore" Section */}
      <section className="px-4 py-12 bg-gradient-to-b from-[#08100d] to-[#0c1813] border-t border-[#d4af37]/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual showcase */}
            <div className="md:col-span-6 rounded-2xl overflow-hidden border border-[#d4af37]/35 shadow-2xl relative">
              <SafeImage
                src={IMAGES_CONFIG.treeShowcase}
                alt="Árvore de Natal montada na sala com estrela branca, fita LED, bolinhas e laços dourados"
                loading="lazy"
                className="w-full aspect-[4/3] sm:aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1813]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs bg-[#7f1d1d]/90 text-[#fdfbf7] px-3 py-1 rounded-full border border-[#d4af37]/40 font-medium">
                  Resultado no seu ambiente
                </span>
              </div>
            </div>

            {/* Explanatory points */}
            <div className="md:col-span-6 text-left">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Harmonia Visual
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight mt-1 mb-4">
                {PRODUCT_OFFER.visualShowcase.title}
              </h2>
              <p className="text-sm text-[#ece5d6]/80 mb-6 leading-relaxed">
                {PRODUCT_OFFER.visualShowcase.subtitle}
              </p>

              <div className="space-y-3 mb-6">
                {PRODUCT_OFFER.visualShowcase.highlightPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#f3c04d] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#ece5d6]/90">{point}</span>
                  </div>
                ))}
              </div>

              {/* Detail snippet with ornament */}
              <div className="p-3.5 rounded-xl bg-[#13241d]/90 border border-[#d4af37]/30 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#d4af37]/30">
                  <SafeImage
                    src={IMAGES_CONFIG.ornamentDetail}
                    alt="Detalhe dos lacinhos dourados e bolinhas"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f3c04d]">Acabamento com Laços Dourados</p>
                  <p className="text-xs text-[#ece5d6]/70">
                    Os lacinhos dourados decorativos dão o toque de elegância clássica entre as folhagens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Short & Honest FAQ (Zero Invented Guarantees/Deadlines) */}
      <section className="px-4 py-14">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Perguntas Frequentes
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight mt-1">
              Dúvidas comuns sobre o Super Kit
            </h2>
          </div>

          <div className="space-y-3">
            {PRODUCT_OFFER.faq.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#13241d]/80 border border-[#d4af37]/25 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3c04d]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-[#fdfbf7]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#d4af37] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#ece5d6]/80 leading-relaxed border-t border-[#d4af37]/10">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Final Purchase Section (Second Buy Button) */}
      <section className="px-4 py-12 bg-gradient-to-t from-[#08100d] via-[#13241d] to-[#0c1813] border-t border-[#d4af37]/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-[#7f1d1d]/40 border border-[#d4af37]/40 flex items-center justify-center text-[#f3c04d] mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#fdfbf7] tracking-tight mb-3">
            Leve o encanto do Natal para dentro do seu lar
          </h2>

          <p className="text-sm sm:text-base text-[#ece5d6]/85 max-w-lg mx-auto mb-6">
            Receba o <strong className="text-[#f3c04d] font-semibold">{PRODUCT_OFFER.productName}</strong> completo por apenas{' '}
            <strong className="text-[#f3c04d] font-semibold">{PRODUCT_OFFER.price}</strong> com frete grátis.
          </p>

          <div className="max-w-md mx-auto">
            <a
              href={CHECKOUT_URL}
              onClick={handleBuyClick}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] hover:from-[#991b1b] hover:to-[#651313] text-[#fdfbf7] py-4 px-6 text-center font-bold text-base sm:text-lg tracking-wide shadow-2xl wine-glow border border-[#f3c04d]/50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
              <span className="relative z-10">{PRODUCT_OFFER.bottomCta}</span>
              <ArrowRight className="relative z-10 w-5 h-5 text-[#f3c04d] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#d4af37]">
            <Truck className="w-4 h-4" />
            <span>Frete Grátis para todo o Brasil</span>
          </div>
        </div>
      </section>

      {/* 8. Simple Footer */}
      <footer className="py-6 px-4 text-center border-t border-[#d4af37]/15 text-xs text-[#ded3bd]/60">
        <p className="font-serif text-sm font-semibold text-[#fdfbf7] mb-1">
          {BRAND_CONFIG.name}
        </p>
        <p>{BRAND_CONFIG.footerText}</p>
      </footer>

      {/* 9. Mobile Sticky Bottom Bar (Exclusively on mobile, visible during scroll) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1813]/95 backdrop-blur-md border-t border-[#d4af37]/30 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1">
            <Truck className="w-3 h-3" />
            {PRODUCT_OFFER.shippingBadge}
          </span>
          <span className="font-serif text-xl font-extrabold text-[#f3c04d] tracking-tight">
            {PRODUCT_OFFER.price}
          </span>
        </div>

        <a
          href={CHECKOUT_URL}
          onClick={handleBuyClick}
          className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-[#fdfbf7] text-xs font-bold py-2.5 px-4 rounded-xl border border-[#f3c04d]/40 shadow-lg wine-glow flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Quero Meu Kit</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#f3c04d]" />
        </a>
      </div>

      {/* NucleoPay Native Checkout Modal */}
      <NucleoPayCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerInitialName={userName}
      />
    </div>
  );
};
