import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NUCLEOPAY_BASE_URL = 'https://nucleopay.com.br';
// Default token provided by merchant
const DEFAULT_NUCLEOPAY_TOKEN = 'ncp_prod_f7890e285d060b9aaaa360';

app.use(express.json());

// In-memory store for orders and simulated/live charges
const chargesStore = new Map<string, {
  chargeId: string;
  order_id?: string;
  status: 'Pendente' | 'Aprovado' | 'Recusado' | string;
  value: number;
  customer_name?: string;
  customer_email?: string;
  createdAt: number;
}>();

function getActiveToken(): string {
  const envToken = process.env.NUCLEOPAY_API_TOKEN;
  if (envToken && envToken.trim() !== '' && envToken !== 'seu_token_nucleopay_aqui') {
    return envToken.trim();
  }
  return DEFAULT_NUCLEOPAY_TOKEN;
}

/**
 * 0) Status da configuração NucleoPay
 */
app.get('/api/nucleopay/config', (_req, res) => {
  const token = getActiveToken();
  const isConfigured = Boolean(token && token.trim() !== '');
  const isTestMode = token.startsWith('np_test_');

  res.json({
    configured: isConfigured,
    mode: isTestMode ? 'test' : 'live',
    tokenPrefix: token ? `${token.slice(0, 10)}...` : '',
    baseUrl: NUCLEOPAY_BASE_URL,
  });
});

/**
 * 1) Criar cobrança PIX avulsa (NucleoPay)
 * POST https://nucleopay.com.br/api/pix/charge/create
 */
app.post('/api/nucleopay/pix', async (req, res) => {
  try {
    const token = getActiveToken();
    const {
      customer_name,
      customer_email,
      customer_cpf,
      customer_phone,
      address,
      external_id,
    } = req.body;

    const orderRef = external_id || `PED-${Date.now()}`;

    // Payload de cobrança avulsa (value + title)
    const chargePayload = {
      value: 139.90, // Valor oficial: R$ 139,90
      title: 'SUPER KIT ÁRVORE DE NATAL',
      description: 'Super Kit Árvore de Natal Completo 1,5m com Frete Grátis - Noel Decore',
      external_id: orderRef,
      customer_name: customer_name || 'Cliente Noel Decore',
      customer_email: customer_email || undefined,
      customer_cpf: customer_cpf ? customer_cpf.replace(/\D/g, '') : undefined,
      customer_phone: customer_phone ? customer_phone.replace(/\D/g, '') : undefined,
      address: address || undefined,
    };

    if (token) {
      console.log(`[NucleoPay] Criando cobrança PIX avulsa de R$ 139.90 para "${chargePayload.customer_name}"...`);

      const response = await fetch(`${NUCLEOPAY_BASE_URL}/api/pix/charge/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(chargePayload),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        console.error('[NucleoPay Erro]:', data.error || data.message, data.debug);
        return res.status(response.status || 400).json({
          success: false,
          error: data.error || data.message || 'Erro ao gerar cobrança na NucleoPay',
          debug: data.debug,
        });
      }

      // NucleoPay wraps charge in data: { chargeId, order_id, brCode, qrCodeImage, ... }
      const payload = (data && data.data) ? data.data : data;
      const brCode = payload.brCode || data.brCode;
      const chargeId = payload.chargeId || payload.order_id || data.chargeId;

      // Gera QR Code em base64 localmente a partir do brCode oficial para garantir carregamento 100% offline
      let localQrDataUrl = '';
      if (brCode) {
        try {
          localQrDataUrl = await QRCode.toDataURL(brCode, {
            width: 320,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
          });
        } catch (e) {
          console.error('[NucleoPay] Erro ao gerar QR Code local no servidor:', e);
        }
      }

      // Registra no store local
      chargesStore.set(chargeId, {
        chargeId,
        order_id: payload.order_id || chargeId,
        status: payload.status || 'Pendente',
        value: payload.value || 139.90,
        customer_name: chargePayload.customer_name,
        customer_email: chargePayload.customer_email,
        createdAt: Date.now(),
      });

      return res.json({
        success: true,
        chargeId,
        order_id: payload.order_id || chargeId,
        status: payload.status || 'Pendente',
        statusCode: payload.statusCode || 'pending',
        value: payload.value || 139.90,
        brCode: brCode,
        qrCodeImage: localQrDataUrl || payload.qrCodeImage,
        provider: payload.provider || 'nucleopay',
        livemode: payload.livemode ?? true,
        isSimulated: false,
      });
    }

    // Fallback demo caso nenhum token exista
    const demoChargeId = `DEMO-PIX-${Date.now()}`;
    const demoBrCode = `00020126580014br.gov.bcb.pix0136${demoChargeId}5204000053039865406139.905802BR5920NOEL DECORE NATAL6009SAO PAULO62070503***6304ABCD`;
    const localQrDataUrl = await QRCode.toDataURL(demoBrCode, { width: 320, margin: 1 });

    chargesStore.set(demoChargeId, {
      chargeId: demoChargeId,
      status: 'Pendente',
      value: 139.90,
      createdAt: Date.now(),
    });

    return res.json({
      success: true,
      chargeId: demoChargeId,
      status: 'Pendente',
      value: 139.90,
      brCode: demoBrCode,
      qrCodeImage: localQrDataUrl,
      provider: 'nucleopay',
      isSimulated: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[NucleoPay] Falha ao processar /api/nucleopay/pix:', err);
    return res.status(500).json({ success: false, error: message });
  }
});

/**
 * 2) Consultar status da cobrança PIX
 * GET https://nucleopay.com.br/api/pix/charge/status?charge_id={chargeId}
 */
app.get('/api/nucleopay/status', async (req, res) => {
  try {
    const chargeId = String(req.query.charge_id || '');
    if (!chargeId) {
      return res.status(400).json({ success: false, error: 'charge_id é obrigatório' });
    }

    const token = getActiveToken();

    // Se for cobrança real com NucleoPay
    if (!chargeId.startsWith('DEMO-') && token) {
      const response = await fetch(`${NUCLEOPAY_BASE_URL}/api/pix/charge/status?charge_id=${encodeURIComponent(chargeId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const payload = (data && data.data) ? data.data : data;

      const currentStatus = payload.status || data.status;
      const currentStatusCode = payload.statusCode || data.statusCode;

      // Atualiza store local se aprovado
      if (currentStatus === 'Aprovado' || currentStatusCode === 'approved') {
        const stored = chargesStore.get(chargeId);
        if (stored) {
          stored.status = 'Aprovado';
          chargesStore.set(chargeId, stored);
        }
      }

      return res.json({
        success: true,
        chargeId,
        status: currentStatus,
        statusCode: currentStatusCode,
        value: payload.value || data.value || 139.90,
        data: payload,
      });
    }

    // Consulta demo
    const demo = chargesStore.get(chargeId);
    return res.json({
      success: true,
      chargeId,
      status: demo ? demo.status : 'Pendente',
      statusCode: (demo && demo.status === 'Aprovado') ? 'approved' : 'pending',
      value: 139.90,
      isSimulated: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return res.status(500).json({ success: false, error: message });
  }
});

/**
 * 3) Listar cobranças recentes
 * GET https://nucleopay.com.br/api/pix/charges
 */
app.get('/api/nucleopay/charges', async (req, res) => {
  try {
    const token = getActiveToken();
    const limit = Number(req.query.limit) || 20;

    if (!token) {
      return res.json({ success: true, charges: Array.from(chargesStore.values()) });
    }

    const response = await fetch(`${NUCLEOPAY_BASE_URL}/api/pix/charges?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return res.status(500).json({ success: false, error: message });
  }
});

/**
 * 4) Webhook de saída NucleoPay
 * Recebe notificações instantâneas (ex: charge.approved, charge.created, etc.)
 */
app.post('/api/nucleopay/webhook', (req, res) => {
  try {
    const signature = req.headers['x-nucleopay-signature'] as string | undefined;
    const event = req.headers['x-nucleopay-event'] as string | undefined;
    const webhookSecret = process.env.NUCLEOPAY_WEBHOOK_SECRET;

    // Valida HMAC SHA-256 se webhookSecret estiver configurado
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const computed = `sha256=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;
      if (computed !== signature) {
        console.warn('[NucleoPay Webhook] Assinatura HMAC inválida!');
        return res.status(401).json({ error: 'Assinatura inválida' });
      }
    }

    const payload = req.body;
    console.log(`[NucleoPay Webhook] Evento recebido: ${event || payload.event}`);

    if (payload.data && payload.data.chargeId) {
      const chargeId = payload.data.chargeId;
      const status = payload.data.status;

      const stored = chargesStore.get(chargeId);
      if (stored) {
        stored.status = status;
        chargesStore.set(chargeId, stored);
      }
    }

    return res.json({ received: true });
  } catch (err: unknown) {
    console.error('[NucleoPay Webhook] Erro ao processar webhook:', err);
    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

/**
 * Endpoint de teste / sandbox para aprovar cobrança
 */
app.post('/api/nucleopay/simulate-pay', async (req, res) => {
  try {
    const { charge_id } = req.body;
    if (!charge_id) {
      return res.status(400).json({ success: false, error: 'charge_id é obrigatório' });
    }

    const token = getActiveToken();

    if (!charge_id.startsWith('DEMO-') && token && token.startsWith('np_test_')) {
      const response = await fetch(`${NUCLEOPAY_BASE_URL}/api/pix/charge/simulate-pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ charge_id }),
      });
      const data = await response.json();
      return res.json(data);
    }

    const stored = chargesStore.get(charge_id);
    if (stored) {
      stored.status = 'Aprovado';
      chargesStore.set(charge_id, stored);
    }

    return res.json({
      success: true,
      chargeId: charge_id,
      status: 'Aprovado',
      statusCode: 'approved',
      message: 'Pagamento aprovado com sucesso!',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return res.status(500).json({ success: false, error: message });
  }
});

/**
 * Inicialização do servidor
 */
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Noel Decore] Servidor rodando em http://0.0.0.0:${PORT}`);
    console.log(`[Noel Decore] NucleoPay Token ativo: ${getActiveToken().slice(0, 12)}...`);
  });
}

startServer();
