import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import QRCode from 'qrcode';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NUCLEOPAY_BASE_URL = 'https://nucleopay.com.br';

app.use(express.json());

// In-memory simulation store for charges created when running in sandbox/demo without token
const simulatedCharges = new Map<string, {
  chargeId: string;
  status: 'Pendente' | 'Aprovado';
  value: number;
  createdAt: number;
}>();

/**
 * Endpoint to check if NucleoPay API token is configured
 */
app.get('/api/nucleopay/config', (_req, res) => {
  const token = process.env.NUCLEOPAY_API_TOKEN;
  const isConfigured = Boolean(token && token.trim() !== '' && token !== 'seu_token_nucleopay_aqui');
  const isTestMode = token ? token.startsWith('np_test_') : false;

  res.json({
    configured: isConfigured,
    mode: isTestMode ? 'test' : isConfigured ? 'live' : 'demo',
    hasToken: isConfigured,
    baseUrl: NUCLEOPAY_BASE_URL,
  });
});

/**
 * Endpoint: Create PIX Charge via NucleoPay
 */
app.post('/api/nucleopay/pix', async (req, res) => {
  try {
    const token = process.env.NUCLEOPAY_API_TOKEN;
    const {
      customer_name,
      customer_email,
      customer_cpf,
      customer_phone,
      address,
    } = req.body;

    const chargePayload = {
      value: 139.90, // Authoritative price: R$ 139,90
      title: 'SUPER KIT ÁRVORE DE NATAL',
      description: 'Super Kit Árvore de Natal Completo 1,5m com Frete Grátis - Noel Decore',
      customer_name: customer_name || 'Cliente Noel Decore',
      customer_email: customer_email || undefined,
      customer_cpf: customer_cpf ? customer_cpf.replace(/\D/g, '') : undefined,
      customer_phone: customer_phone ? customer_phone.replace(/\D/g, '') : undefined,
      address: address || undefined,
    };

    // If NucleoPay token is configured, call NucleoPay directly
    if (token && token.trim() !== '' && token !== 'seu_token_nucleopay_aqui') {
      const response = await fetch(`${NUCLEOPAY_BASE_URL}/api/pix/charge/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`,
        },
        body: JSON.stringify(chargePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || 'Erro ao gerar cobrança na NucleoPay',
          details: data,
        });
      }

      // NucleoPay wraps charge in data: { chargeId, brCode, qrCodeImage, ... }
      const payload = (data && data.data) ? data.data : data;
      const brCode = payload.brCode || data.brCode;
      const chargeId = payload.chargeId || payload.order_id || data.chargeId;

      // Always generate a reliable base64 Data URL from brCode to bypass any external image blocker
      let finalQrCode = '';
      if (brCode) {
        try {
          finalQrCode = await QRCode.toDataURL(brCode, {
            width: 320,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
          });
        } catch (e) {
          console.error('Erro ao gerar QR Code local no servidor:', e);
        }
      }

      return res.json({
        success: true,
        chargeId,
        status: payload.status || 'Pendente',
        statusCode: payload.statusCode || 'pending',
        value: payload.value || 139.90,
        brCode: brCode,
        qrCodeImage: finalQrCode || payload.qrCodeImage,
        provider: payload.provider || 'nucleopay',
        isSimulated: false,
      });
    }

    // Fallback Demo / Simulation mode if token has not yet been set in .env
    const demoChargeId = `DEMO-PIX-${Date.now()}`;
    const demoBrCode = `00020126580014br.gov.bcb.pix0136${demoChargeId}5204000053039865406139.905802BR5920NOEL DECORE NATAL6009SAO PAULO62070503***6304ABCD`;

    // Generate local base64 Data URL (100% offline, zero external requests)
    const localQrDataUrl = await QRCode.toDataURL(demoBrCode, {
      width: 320,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    simulatedCharges.set(demoChargeId, {
      chargeId: demoChargeId,
      status: 'Pendente',
      value: 139.90,
      createdAt: Date.now(),
    });

    return res.json({
      chargeId: demoChargeId,
      status: 'Pendente',
      value: 139.90,
      brCode: demoBrCode,
      qrCodeImage: localQrDataUrl,
      provider: 'nucleopay',
      isSimulated: true,
      message: 'Cobrança gerada em modo demonstração. Para processamento real, adicione NUCLEOPAY_API_TOKEN no seu arquivo .env.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('Erro ao criar cobrança PIX:', err);
    return res.status(500).json({ error: message });
  }
});

/**
 * Endpoint: Check status of a PIX charge
 */
app.get('/api/nucleopay/status', async (req, res) => {
  try {
    const chargeId = String(req.query.charge_id || '');
    if (!chargeId) {
      return res.status(400).json({ error: 'charge_id é obrigatório' });
    }

    const token = process.env.NUCLEOPAY_API_TOKEN;

    // Check live NucleoPay if not a demo charge
    if (!chargeId.startsWith('DEMO-') && token && token.trim() !== '' && token !== 'seu_token_nucleopay_aqui') {
      const response = await fetch(`${NUCLEOPAY_BASE_URL}/api/pix/charge/status?charge_id=${encodeURIComponent(chargeId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
        },
      });

      const data = await response.json();
      const payload = (data && data.data) ? data.data : data;
      return res.json({
        ...payload,
        status: payload.status || data.status,
        statusCode: payload.statusCode || data.statusCode,
      });
    }

    // Simulated status check
    const demo = simulatedCharges.get(chargeId);
    if (demo) {
      return res.json({
        chargeId: demo.chargeId,
        status: demo.status,
        statusCode: demo.status === 'Aprovado' ? 'approved' : 'pending',
        value: demo.value,
        isSimulated: true,
      });
    }

    return res.json({
      chargeId,
      status: 'Pendente',
      statusCode: 'pending',
      value: 139.90,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return res.status(500).json({ error: message });
  }
});

/**
 * Endpoint: Simulate payment approval (sandbox or demo)
 */
app.post('/api/nucleopay/simulate-pay', async (req, res) => {
  try {
    const { charge_id } = req.body;
    if (!charge_id) {
      return res.status(400).json({ error: 'charge_id é obrigatório' });
    }

    const token = process.env.NUCLEOPAY_API_TOKEN;

    if (!charge_id.startsWith('DEMO-') && token && token.startsWith('np_test_')) {
      const response = await fetch(`${NUCLEOPAY_BASE_URL}/api/pix/charge/simulate-pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ charge_id }),
      });
      const data = await response.json();
      return res.json(data);
    }

    // Approve simulated charge
    const demo = simulatedCharges.get(charge_id);
    if (demo) {
      demo.status = 'Aprovado';
      simulatedCharges.set(charge_id, demo);
    }

    return res.json({
      chargeId: charge_id,
      status: 'Aprovado',
      statusCode: 'approved',
      message: 'Pagamento aprovado com sucesso!',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return res.status(500).json({ error: message });
  }
});

/**
 * Start Server with Vite middlewares in Dev, or Static Serve in Production
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
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
