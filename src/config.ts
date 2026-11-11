/**
 * =======================================================================
 * NOEL DECORE - ARQUIVO CENTRAL DE CONFIGURAÇÃO
 * =======================================================================
 * Todos os textos, preço, link de checkout, imagens e itens estão centralizados
 * aqui para facilitar a sua edição sem precisar alterar os componentes.
 */

/**
 * -----------------------------------------------------------------------
 * 1. FORMA DE PAGAMENTO / CHECKOUT (NUCLEOPAY)
 * -----------------------------------------------------------------------
 * O site já vem com o Checkout Modal integrado com suporte à API da NUCLEOPAY!
 *
 * OPÇÃO A (Recomendada - Checkout Nativo PIX NucleoPay):
 * Mantenha CHECKOUT_URL = "#". O botão abrirá o modal nativo com formulário de
 * endereço de entrega, geração de QR Code PIX, Copia e Cola e conferência automática
 * de pagamento. Para ativar a cobrança real, adicione NUCLEOPAY_API_TOKEN no seu .env.
 *
 * OPÇÃO B (Link Direto de Checkout / Cartão):
 * Se você criou um checkout de produto na NucleoPay (ex: https://nucleopay.com.br/pay/NCC-...),
 * basta colar a URL aqui abaixo:
 */
export const CHECKOUT_URL: string = "#"; // Mantenha "#" para usar o checkout PIX nativo NucleoPay ou cole seu link externo.

/**
 * -----------------------------------------------------------------------
 * 2. DADOS DA MARCA
 * -----------------------------------------------------------------------
 */
export const BRAND_CONFIG = {
  name: "Noel Decore",
  tagline: "Seu Natal mais bonito começa aqui.",
  subtitle: "Responda 3 perguntas rápidas e descubra o kit perfeito para deixar sua casa decorada e aconchegante.",
  durationBadge: "Leva menos de 1 minuto",
  ctaHome: "Descobrir meu Natal perfeito",
  footerText: "© Noel Decore. Todos os direitos reservados.",
};

/**
 * -----------------------------------------------------------------------
 * 3. CONFIGURAÇÃO DE IMAGENS DO SITE
 * -----------------------------------------------------------------------
 * Você pode substituir qualquer uma destas imagens pelas fotos reais da sua loja.
 */
export const IMAGES_CONFIG = {
  // Imagem de fundo do ambiente aconchegante natalino (Hero da página inicial)
  heroBackground: "/src/assets/images/hero_cozy_living_room_1794354866624.jpg",
  
  // Imagem oficial principal do kit completo com itens destacados
  kitMainProduct: "/assets/aistudio/Promo__o_Natalina___rvore_Completa_Decorada_f5e6e062.png",
  
  // Imagem de visão geral do kit (com arte comemorativa e selo frete grátis)
  kitOverviewBanner: "/assets/aistudio/491dd1b8-7597-40c0-a155-7cbb9ef96416_db6b1aa0.png",
  
  // Imagem da árvore decorada na sala de estar (Seção "Como fica sua árvore")
  treeShowcase: "/src/assets/images/tree_showcase_living_room_1794354866854.jpg",
  
  // Detalhe dos enfeites natalinos e laço dourado
  ornamentDetail: "/src/assets/images/christmas_pine_ornaments_1794354867381.jpg",
};

/**
 * -----------------------------------------------------------------------
 * 4. PERGUNTAS DO QUIZ (EXATAMENTE 3 PERGUNTAS)
 * -----------------------------------------------------------------------
 * O token '{nome}' é substituído dinamicamente pelo primeiro nome informado.
 */
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "{nome}, o que não pode faltar no seu Natal?",
    options: [
      "Uma casa linda e toda decorada",
      "Momentos especiais com quem eu amo",
      "Uma árvore de Natal que seja o destaque da casa",
      "Tudo isso junto!",
    ],
  },
  {
    id: 2,
    question: "Como você gostaria que sua árvore de Natal fosse este ano?",
    options: [
      "Elegante e cheia de detalhes",
      "Clássica, com vermelho e dourado",
      "Bonita, completa e aconchegante",
      "Quero surpreender minha família!",
    ],
  },
  {
    id: 3,
    question: "Qual seria a melhor forma de preparar sua decoração natalina?",
    options: [
      "Encontrar tudo em um único kit",
      "Economizar sem abrir mão de uma decoração bonita",
      "Não precisar procurar cada enfeite separadamente",
      "Ter praticidade e deixar minha casa linda!",
    ],
  },
];

/**
 * -----------------------------------------------------------------------
 * 5. MENSAGENS DA TELA DE TRANSIÇÃO
 * -----------------------------------------------------------------------
 */
export const TRANSITION_CONFIG = {
  message1: "Estamos preparando algo especial para você, {nome}...",
  message2: "Encontramos uma opção perfeita para deixar seu Natal ainda mais especial!",
};

/**
 * -----------------------------------------------------------------------
 * 6. PRODUTO E OFERTA (SUPER KIT ÁRVORE DE NATAL)
 * -----------------------------------------------------------------------
 * REGRAS INEGOCIÁVEIS:
 * - Preço: R$ 139,90 com Frete Grátis.
 * - Exatamente 5 itens oficiais.
 * - Lacinhos dourados decorativos SEM quantidade definida.
 * - Proibido inventar descontos 'de/por', cupons ou parcelamento.
 */
export interface KitItem {
  id: string;
  name: string;
  description: string;
  badge?: string;
  iconType: "tree" | "baubles" | "star" | "lights" | "bows";
}

export const PRODUCT_OFFER = {
  headlineOffer: "{nome}, encontramos o kit ideal para deixar seu Natal ainda mais bonito!",
  productName: "SUPER KIT ÁRVORE DE NATAL",
  commercialCall: "Tudo o que você precisa para uma árvore completa, elegante e inesquecível, pronta para encantar toda a família.",
  price: "R$ 139,90",
  shippingBadge: "FRETE GRÁTIS",
  primaryCta: "Quero meu Super Kit agora",
  bottomCta: "Garantir meu Super Kit com Frete Grátis",
  
  // Benefícios emocionais e honestos
  benefits: [
    {
      title: "Decoração completa e harmoniosa",
      description: "Cada item foi selecionado para combinar perfeitamente entre si, com a elegância clássica do vermelho e dourado.",
    },
    {
      title: "Sem comprar enfeite por enfeite",
      description: "Esqueça o cansaço de procurar itens separados em várias lojas. Você recebe a solução pronta em uma única entrega.",
    },
    {
      title: "Praticidade e economia de tempo",
      description: "Montagem simples e rápida para você não perder tempo e focar em curtir a casa linda com quem mais ama.",
    },
    {
      title: "Momentos especiais em família",
      description: "A árvore de Natal é o coração das memórias de fim de ano. Transforme a montagem em uma celebração afetuosa.",
    },
    {
      title: "Aconchego natalino que acolhe",
      description: "A iluminação suave dos LEDs e o brilho dos laços dourados criam um clima acolhedor que transforma a sua sala.",
    },
  ],

  // Os 5 itens oficiais do kit (NÃO alterar, adicionar ou remover itens)
  includedItems: [
    {
      id: "tree",
      name: "1 pinheiro de Natal de 1,5 metro",
      description: "Pinheiro de altura ideal, galhos verdes volumosos e base firme com montagem prática e estável.",
      badge: "1,5m de altura",
      iconType: "tree",
    },
    {
      id: "baubles",
      name: "24 bolinhas decorativas (12 vermelhas e 12 douradas)",
      description: "A combinação clássica e nobre com acabamentos brilhantes e texturizados para preencher a árvore com equilíbrio.",
      badge: "24 unidades",
      iconType: "baubles",
    },
    {
      id: "star",
      name: "1 estrela branca para o topo da árvore",
      description: "O símbolo mais especial do Natal, projetado para coroar o pinheiro com elegância e luz.",
      badge: "Topo especial",
      iconType: "star",
    },
    {
      id: "lights",
      name: "1 fita pisca-pisca LED de 2 metros",
      description: "Luzes LED acolhedoras e econômicas que envolvem a árvore e trazem o brilho aconchegante da noite de Natal.",
      badge: "2 metros LED",
      iconType: "lights",
    },
    {
      id: "bows",
      name: "Lacinhos dourados decorativos",
      description: "Laços cintilantes com textura dourada que preenchem os galhos com um toque refinado e encantador.",
      badge: "Dourado nobre",
      iconType: "bows",
    },
  ] as KitItem[],

  // Seção "Como fica sua árvore"
  visualShowcase: {
    title: "Como fica a sua árvore de Natal",
    subtitle: "Harmonia visual perfeita: galhos cheios, iluminação delicada, bolinhas vermelhas e douradas, lacinhos cintilantes e a estrela no topo.",
    highlightPoints: [
      "Altura equilibrada de 1,5 metro perfeita para salas e apartamentos",
      "Iluminação LED distribuída ao longo dos galhos",
      "Bolinhas vermelhas e douradas dispostas em harmonia",
      "Lacinhos dourados dando o acabamento sofisticado",
      "Estrela branca coroando o topo com destaque",
    ],
  },

  // FAQ honesto, seguro e objetivo (sem inventar prazos ou garantias não informadas)
  faq: [
    {
      question: "O que vem exatamente no Super Kit Árvore de Natal?",
      answer: "O kit acompanha 1 pinheiro de 1,5 metro, 24 bolinhas decorativas (12 vermelhas e 12 douradas), 1 estrela branca para o topo da árvore, 1 fita pisca-pisca LED de 2 metros e lacinhos dourados decorativos. Uma árvore completa pronta para montar!",
    },
    {
      question: "Como funciona a fita pisca-pisca LED?",
      answer: "A fita LED possui 2 metros com lâmpadas econômicas de iluminação suave e aconchegante, ideal para contornar os galhos do pinheiro de 1,5m com segurança e beleza.",
    },
    {
      question: "Como será feita a entrega?",
      answer: "O Super Kit é despachado com frete grátis para todo o Brasil, embalado com segurança e proteção para que todos os 5 itens cheguem em perfeito estado até a sua casa.",
    },
    {
      question: "É fácil de montar em casa?",
      answer: "Muito simples e prático! A estrutura do pinheiro é articulada para facilitar a abertura dos galhos. Em seguida, basta enrolar a fita LED, pendurar as bolinhas, posicionar os lacinhos dourados e colocar a estrela no topo.",
    },
  ],
};
