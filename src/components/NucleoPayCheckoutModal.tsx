import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { PRODUCT_OFFER, CHECKOUT_URL } from '../config';

interface NucleoPayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerInitialName: string;
}

interface AddressData {
  zip: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const NucleoPayCheckoutModal: React.FC<NucleoPayCheckoutModalProps> = ({
  isOpen,
  onClose,
  customerInitialName,
}) => {
  const [stage, setStage] = useState<'form' | 'pix' | 'success'>('form');
  const [customerName, setCustomerName] = useState(customerInitialName || '');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState<AddressData>({
    zip: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Charge Data from NucleoPay
  const [chargeId, setChargeId] = useState<string | null>(null);
  const [brCode, setBrCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [clientQrDataUrl, setClientQrDataUrl] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSimulatingPay, setIsSimulatingPay] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render QR Code 100% locally to Canvas and DataURL whenever brCode is received
  useEffect(() => {
    if (brCode) {
      // Generate Data URL for image fallback
      QRCode.toDataURL(brCode, {
        width: 320,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      })
        .then((url) => setClientQrDataUrl(url))
        .catch((err) => console.error('Erro ao gerar QR Code local:', err));

      // Draw directly on canvas if present
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, brCode, {
          width: 240,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        }).catch((err) => console.error('Erro ao renderizar no canvas:', err));
      }
    }
  }, [brCode, stage]);

  // Auto-sync initial customer name
  useEffect(() => {
    if (customerInitialName && !customerName) {
      setCustomerName(customerInitialName);
    }
  }, [customerInitialName, customerName]);

  // Cep auto-lookup
  const handleCepChange = async (cepRaw: string) => {
    const cleaned = cepRaw.replace(/\D/g, '').slice(0, 8);
    setAddress((prev) => ({ ...prev, zip: cleaned }));

    if (cleaned.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
        }
      } catch {
        // silent fail on cep lookup
      }
    }
  };

  // Poll for payment approval
  useEffect(() => {
    if (stage !== 'pix' || !chargeId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/nucleopay/status?charge_id=${encodeURIComponent(chargeId)}`);
        const data = await res.json();

        if (data.status === 'Aprovado' || data.statusCode === 'approved') {
          setStage('success');
          clearInterval(interval);
        }
      } catch {
        // silent poll error
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [stage, chargeId]);

  if (!isOpen) return null;

  // Handle PIX creation
  const handleCreatePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/nucleopay/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_cpf: customerCpf,
          customer_phone: customerPhone,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível gerar a cobrança PIX');
      }

      const payload = (data && data.data) ? data.data : data;
      const extractedChargeId = payload.chargeId || payload.order_id || data.chargeId;
      const extractedBrCode = payload.brCode || data.brCode;
      const extractedQr = payload.qrCodeImage || data.qrCodeImage;

      setChargeId(extractedChargeId);
      setBrCode(extractedBrCode);
      setQrCodeImage(extractedQr);
      setIsSimulated(Boolean(payload.isSimulated ?? data.isSimulated));
      setStage('pix');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar pedido';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBrCode = async () => {
    if (!brCode) return;
    try {
      await navigator.clipboard.writeText(brCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSimulateApproval = async () => {
    if (!chargeId) return;
    setIsSimulatingPay(true);
    try {
      await fetch('/api/nucleopay/simulate-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charge_id: chargeId }),
      });
      setStage('success');
    } catch {
      //
    } finally {
      setIsSimulatingPay(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c1813] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden text-[#f8f5ee] my-6">
        {/* Top Header Accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#7f1d1d] via-[#f3c04d] to-[#7f1d1d]" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#d4af37]/20 bg-[#13241d]/70">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#7f1d1d] border border-[#d4af37]/40 flex items-center justify-center text-[#f3c04d]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#fdfbf7] leading-tight">
                {PRODUCT_OFFER.productName}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#f3c04d]">{PRODUCT_OFFER.price}</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Frete Grátis
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full hover:bg-white/10 text-[#ece5d6]/70 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STAGE 1: FORM */}
          {stage === 'form' && (
            <form onSubmit={handleCreatePix} className="space-y-4 text-left">
              <div className="bg-[#13241d]/50 border border-[#d4af37]/20 rounded-xl p-3 text-xs text-[#ece5d6]/90 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Pagamento oficial com tecnologia <strong>NucleoPay</strong>. Seus dados estão protegidos.
                </span>
              </div>

              {/* Customer Personal Details */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Dados do Comprador</span>
                </p>

                <div>
                  <label className="block text-xs text-[#ece5d6]/80 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#ece5d6]/80 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#d4af37]" />
                      <span>E-mail (para rastreio)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#ece5d6]/80 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#d4af37]" />
                      <span>WhatsApp / Telefone</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#ece5d6]/80 mb-1">CPF (obrigatório para PIX)</label>
                  <input
                    type="text"
                    required
                    value={customerCpf}
                    onChange={(e) => setCustomerCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2">
                <p className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Endereço de Entrega (Frete Grátis)</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#ece5d6]/80 mb-1">CEP</label>
                    <input
                      type="text"
                      required
                      maxLength={9}
                      value={address.zip}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#ece5d6]/80 mb-1">Rua / Avenida</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Nome da rua"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-[#ece5d6]/80 mb-1">Número</label>
                    <input
                      type="text"
                      required
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      placeholder="123"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#ece5d6]/80 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      placeholder="Apto 101"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#ece5d6]/80 mb-1">Bairro</label>
                    <input
                      type="text"
                      required
                      value={address.neighborhood}
                      onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                      placeholder="Bairro"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#ece5d6]/80 mb-1">Cidade/UF</label>
                    <input
                      type="text"
                      required
                      value={address.city ? `${address.city}/${address.state}` : ''}
                      onChange={(e) => {
                        const parts = e.target.value.split('/');
                        setAddress({
                          ...address,
                          city: parts[0] || '',
                          state: parts[1] || '',
                        });
                      }}
                      placeholder="São Paulo/SP"
                      className="w-full px-3.5 py-2.5 bg-[#08100d] border border-[#d4af37]/30 rounded-xl text-sm text-[#fdfbf7] placeholder-white/30 focus:outline-none focus:border-[#f3c04d]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl font-bold text-base bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] hover:from-[#991b1b] hover:to-[#651313] text-[#fdfbf7] shadow-xl wine-glow border border-[#f3c04d]/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <QrCode className="w-5 h-5 text-[#f3c04d]" />
                  <span>{isLoading ? 'Gerando PIX NucleoPay...' : 'Pagar R$ 139,90 via PIX (Frete Grátis)'}</span>
                </button>
              </div>

              {CHECKOUT_URL && CHECKOUT_URL !== '#' && (
                <div className="text-center pt-2">
                  <a
                    href={CHECKOUT_URL}
                    className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Prefere pagar via cartão no checkout externo? Clique aqui</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </form>
          )}

          {/* STAGE 2: PIX QR CODE & COPIA E COLA */}
          {stage === 'pix' && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Aguardando Pagamento PIX</span>
              </div>

              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#fdfbf7]">
                Pague com PIX para liberar o envio
              </h4>
              <p className="text-xs sm:text-sm text-[#ece5d6]/80 max-w-sm mx-auto">
                Escaneie o QR Code abaixo no app do seu banco ou use a chave Copia e Cola.
              </p>

              {/* QR Code Container with Local Base64 & Canvas */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl mx-auto border-4 border-[#d4af37]">
                {clientQrDataUrl || (qrCodeImage && qrCodeImage.startsWith('data:')) ? (
                  <img
                    src={clientQrDataUrl || qrCodeImage || undefined}
                    alt="QR Code PIX NucleoPay"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto block"
                  />
                ) : (
                  <div>
                    <canvas
                      ref={canvasRef}
                      className="w-48 h-48 sm:w-56 sm:h-56 mx-auto block"
                    />
                    {!brCode && !qrCodeImage && (
                      <div className="w-48 h-48 flex items-center justify-center text-slate-900 font-mono text-xs">
                        Gerando QR Code PIX...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount reminder */}
              <div>
                <span className="text-xs text-[#ece5d6]/70">Valor exato: </span>
                <span className="font-bold text-lg text-[#f3c04d]">{PRODUCT_OFFER.price}</span>
                <span className="text-xs text-emerald-400 ml-1.5 font-medium">(Frete Grátis)</span>
              </div>

              {/* Copia e Cola Button */}
              {brCode && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleCopyBrCode}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#13241d] hover:bg-[#1b3329] border border-[#d4af37]/60 text-[#fdfbf7] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Código PIX Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#f3c04d]" />
                        <span>Copiar Código PIX (Copia e Cola)</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#ece5d6]/60 break-all px-2 font-mono">
                    {brCode.slice(0, 40)}...
                  </p>
                </div>
              )}

              {/* Steps guide */}
              <div className="bg-[#13241d]/60 rounded-xl p-3.5 border border-[#d4af37]/20 text-left text-xs text-[#ece5d6]/80 space-y-1.5">
                <p className="font-semibold text-[#f3c04d]">Como pagar:</p>
                <p>1. Abra o aplicativo do seu banco no celular</p>
                <p>2. Selecione PIX &gt; Pagar com QR Code ou Copia e Cola</p>
                <p>3. Cole o código ou aponte a câmera para o QR Code</p>
                <p>4. Esta tela será atualizada automaticamente assim que o pagamento for aprovado!</p>
              </div>

              {/* Sandbox / Simulation Helper */}
              {isSimulated && (
                <div className="pt-2 border-t border-[#d4af37]/20">
                  <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 text-left">
                    <p className="font-bold mb-1">Modo Demonstração / Sandbox:</p>
                    <p className="mb-2 text-[11px]">
                      Para testar a confirmação de compra sem debitar valor real, use o botão abaixo:
                    </p>
                    <button
                      type="button"
                      disabled={isSimulatingPay}
                      onClick={handleSimulateApproval}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
                    >
                      {isSimulatingPay ? 'Simulando...' : 'Simular Aprovação Imediata (Teste)'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE 3: ORDER SUCCESS */}
          {stage === 'success' && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
                Parabéns, {customerName || 'Cliente'}!
              </h4>

              <p className="text-sm text-emerald-300 font-semibold">
                Pagamento de {PRODUCT_OFFER.price} confirmado com sucesso!
              </p>

              <div className="bg-[#13241d]/80 border border-[#d4af37]/30 rounded-2xl p-4 text-left text-xs sm:text-sm text-[#ece5d6]/90 space-y-2">
                <div className="flex items-center gap-2 text-[#f3c04d] font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Pedido Noel Decore #{chargeId?.slice(-6) || 'NATAL'}</span>
                </div>
                <p>
                  O seu <strong>{PRODUCT_OFFER.productName}</strong> completo está garantido com <strong>Frete Grátis</strong>.
                </p>
                <div className="text-xs text-[#ece5d6]/80 pt-1 border-t border-[#d4af37]/15">
                  <p className="font-semibold text-[#f3c04d] mb-1">Itens inclusos:</p>
                  <p>• 1 pinheiro de Natal de 1,5 metro</p>
                  <p>• 24 bolinhas decorativas (12 vermelhas e 12 douradas)</p>
                  <p>• 1 estrela branca para o topo da árvore</p>
                  <p>• 1 fita pisca-pisca LED de 2 metros</p>
                  <p>• Lacinhos dourados decorativos</p>
                </div>
                {address.street && (
                  <p className="text-xs text-[#ece5d6]/70 pt-2 border-t border-[#d4af37]/15">
                    <strong>Entrega para:</strong> {address.street}, {address.number} - {address.city}/{address.state}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-white hover:brightness-110 transition-all cursor-pointer"
              >
                Concluir e Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
