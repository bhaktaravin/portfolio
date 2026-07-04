import { CHAT_KNOWLEDGE, type Product } from '../data/wov3.data';



export interface ChatMessage {

  id: string;

  role: 'user' | 'assistant';

  content: string;

  timestamp: Date;

}



type ChatListener = (messages: ChatMessage[]) => void;



let messageId = 0;

let productContext: Product[] = [];

let usingLiveProducts = false;



function nextId(): string {

  messageId += 1;

  return `msg-${messageId}`;

}



function findProductByIntent(q: string): Product | undefined {

  const checks: Array<[RegExp, string]> = [

    [/wv-?1\b|wv1|recovery slide|slide/, 'wv-1'],

    [/wv-?2\b|wv2|running/, 'wv-2'],

    [/wv-?3\b|wv3|massage|clog/, 'wv-3'],

    [/wv-?4\b|wv4|insole|custom/, 'wv-4'],

  ];



  for (const [pattern, id] of checks) {

    if (pattern.test(q)) {

      return productContext.find((p) => p.id === id);

    }

  }

  return undefined;

}



function buildProductResponse(product: Product): string {

  const features =

    product.features.length > 0 ? ` Features: ${product.features.slice(0, 2).join(', ')}.` : '';

  return `${product.name} — ${product.tagline}. ${product.description.slice(0, 120)}${product.description.length > 120 ? '…' : ''} ${product.price}.${features}`;

}



function buildCompareResponse(): string {

  if (usingLiveProducts && productContext.length > 0) {

    const lines = productContext.map((p) => `• ${p.name} — ${p.tagline} (${p.price})`);

    return `Here's our current lineup:\n${lines.join('\n')}\n\nAsk me about any product for more details.`;

  }

  return CHAT_KNOWLEDGE.responses.compare;

}



function matchIntent(input: string): string {

  const q = input.toLowerCase();



  const matched = findProductByIntent(q);

  if (matched) return buildProductResponse(matched);



  if (q.includes('compare') || q.includes('all product') || q.includes('difference') || q.includes('which')) {

    return buildCompareResponse();

  }

  if (q.includes('hals') || q.includes('3d print') || q.includes('technology') || q.includes('how does')) {

    return CHAT_KNOWLEDGE.responses.hals;

  }

  if (q.includes('scan') || q.includes('insole process') || q.includes('foot scan')) {

    return CHAT_KNOWLEDGE.responses.custom;

  }

  if (q.includes('size') || q.includes('return') || q.includes('fit') || q.includes('shipping')) {

    return CHAT_KNOWLEDGE.responses.sizing;

  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {

    return CHAT_KNOWLEDGE.greeting;

  }

  if (q.includes('price') || q.includes('cost') || q.includes('how much')) {

    return buildCompareResponse();

  }



  return CHAT_KNOWLEDGE.responses.default;

}



function buildSystemPrompt(): string {

  const productLines =

    productContext.length > 0

      ? productContext.map((p) => `${p.name} ${p.tagline} (${p.price})`).join('; ')

      : 'WV-1 Recovery Slides ($89), WV-2 Running Shoes ($149), WV-3 Massage Clogs ($119), WV-4 Custom Insoles ($79)';



  return `You are the Wov3 AI shopping assistant for a 3D-printed footwear brand.

Products: ${productLines}.

Technology: HALS (High-Accuracy Layering System) ultrafast 3D printing.

${usingLiveProducts ? 'Live Shopify catalog is active — prices and availability are current.' : 'Demo mode — static catalog only.'}

Be concise, friendly, and helpful. Recommend products based on user needs.`;

}



export class ChatAgent {

  private messages: ChatMessage[] = [];

  private listeners: ChatListener[] = [];

  private typing = false;



  constructor() {

    this.messages.push({

      id: nextId(),

      role: 'assistant',

      content: CHAT_KNOWLEDGE.greeting,

      timestamp: new Date(),

    });

  }



  setProductContext(products: Product[], live: boolean): void {

    productContext = products;

    usingLiveProducts = live;

  }



  subscribe(listener: ChatListener): () => void {

    this.listeners.push(listener);

    listener([...this.messages]);

    return () => {

      this.listeners = this.listeners.filter((l) => l !== listener);

    };

  }



  private notify(): void {

    this.listeners.forEach((l) => l([...this.messages]));

  }



  isTyping(): boolean {

    return this.typing;

  }



  async send(text: string): Promise<void> {

    const trimmed = text.trim();

    if (!trimmed) return;



    this.messages.push({

      id: nextId(),

      role: 'user',

      content: trimmed,

      timestamp: new Date(),

    });

    this.notify();



    this.typing = true;

    this.notify();



    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));



    const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

    let reply: string;



    if (apiKey) {

      reply = await this.callOpenAI(trimmed, apiKey);

    } else {

      reply = matchIntent(trimmed);

    }



    this.typing = false;

    this.messages.push({

      id: nextId(),

      role: 'assistant',

      content: reply,

      timestamp: new Date(),

    });

    this.notify();

  }



  private async callOpenAI(userMessage: string, apiKey: string): Promise<string> {

    try {

      const res = await fetch('https://api.openai.com/v1/chat/completions', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

          Authorization: `Bearer ${apiKey}`,

        },

        body: JSON.stringify({

          model: 'gpt-4o-mini',

          messages: [

            { role: 'system', content: buildSystemPrompt() },

            ...this.messages.slice(-6).map((m) => ({

              role: m.role,

              content: m.content,

            })),

            { role: 'user', content: userMessage },

          ],

          max_tokens: 300,

        }),

      });



      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      return data.choices?.[0]?.message?.content ?? matchIntent(userMessage);

    } catch {

      return matchIntent(userMessage);

    }

  }

}



export const chatAgent = new ChatAgent();


