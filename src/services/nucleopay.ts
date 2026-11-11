/**
 * NucleoPay API Client & Integration Types
 * Documentação: https://nucleopay.com.br/api/integrations/mcp/manifest
 */

export const NUCLEOPAY_BASE_URL = 'https://nucleopay.com.br';

export interface NucleoPayAddress {
  zip?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface CreatePixChargeInput {
  value: number; // Ex: 139.90
  title: string; // Ex: "SUPER KIT ÁRVORE DE NATAL"
  description?: string;
  external_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_cpf?: string;
  customer_phone?: string;
  address?: NucleoPayAddress;
}

export interface NucleoPayChargeData {
  chargeId: string;
  order_id?: string;
  product_id?: string;
  product_name?: string;
  status: 'Pendente' | 'Aprovado' | 'Recusado' | 'Cancelado' | 'Expirado' | string;
  statusCode?: 'pending' | 'approved' | 'declined' | 'canceled' | 'expired' | 'failed' | 'refunded';
  value: number;
  brCode: string; // Código Copia e Cola PIX
  qrCodeImage: string; // Base64 ou URL do QR Code
  provider?: string;
  livemode?: boolean;
}

export interface NucleoPayApiResponse<T = NucleoPayChargeData> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  debug?: {
    token?: string;
    endpoint?: string;
    detail?: string;
  };
}

export interface CreateCardChargeInput {
  value: number;
  title: string;
  customer_email?: string;
  external_id?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface CardChargeData {
  chargeId: string;
  status: string;
  statusCode: string;
  checkoutUrl: string; // https://nucleopay.com.br/pay/NCC-...
  method: string;
  livemode: boolean;
}

/**
 * Cliente da API NucleoPay
 */
export class NucleoPayClient {
  private token: string;
  private baseUrl: string;

  constructor(token: string, baseUrl: string = NUCLEOPAY_BASE_URL) {
    this.token = token.trim();
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  /**
   * 1) Cria uma cobrança PIX avulsa
   */
  async createPixCharge(input: CreatePixChargeInput): Promise<NucleoPayChargeData> {
    const payload = {
      value: input.value,
      title: input.title,
      description: input.description,
      external_id: input.external_id || `PED-${Date.now()}`,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_cpf: input.customer_cpf ? input.customer_cpf.replace(/\D/g, '') : undefined,
      customer_phone: input.customer_phone ? input.customer_phone.replace(/\D/g, '') : undefined,
      address: input.address,
    };

    const res = await fetch(`${this.baseUrl}/api/pix/charge/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const result: NucleoPayApiResponse = await res.json();

    if (!res.ok || result.success === false) {
      if (result.debug) {
        console.error('[NucleoPay Debug Error]:', result.debug);
      }
      throw new Error(result.error || result.message || `Erro HTTP ${res.status} ao criar cobrança PIX na NucleoPay`);
    }

    const data = result.data || (result as unknown as NucleoPayChargeData);
    return data;
  }

  /**
   * 2) Consulta o status de uma cobrança PIX
   */
  async getPixChargeStatus(chargeId: string): Promise<NucleoPayChargeData> {
    const res = await fetch(`${this.baseUrl}/api/pix/charge/status?charge_id=${encodeURIComponent(chargeId)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result: NucleoPayApiResponse = await res.json();

    if (!res.ok || result.success === false) {
      if (result.debug) {
        console.error('[NucleoPay Debug Error]:', result.debug);
      }
      throw new Error(result.error || result.message || `Erro HTTP ${res.status} ao consultar status`);
    }

    const data = result.data || (result as unknown as NucleoPayChargeData);
    return data;
  }

  /**
   * 3) Cria checkout de cartão
   */
  async createCardCharge(input: CreateCardChargeInput): Promise<CardChargeData> {
    const res = await fetch(`${this.baseUrl}/api/card/charge/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(input),
    });

    const result: NucleoPayApiResponse<CardChargeData> = await res.json();

    if (!res.ok || result.success === false) {
      if (result.debug) {
        console.error('[NucleoPay Debug Error]:', result.debug);
      }
      throw new Error(result.error || result.message || 'Erro ao gerar checkout de cartão');
    }

    const data = result.data || (result as unknown as CardChargeData);
    return data;
  }
}
