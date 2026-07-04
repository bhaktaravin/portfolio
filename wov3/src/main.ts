import { PRODUCTS, TECHNOLOGY, TESTIMONIALS, CHAT_KNOWLEDGE, type Product } from './data/wov3.data';

import { chatAgent, type ChatMessage } from './chat/chat-agent';

import {

  createCheckout,

  fetchProducts,

  isShopifyConfigured,

  ShopifyError,

} from './shopify/shopify.service';



let activeProducts: Product[] = PRODUCTS;

const shopifyLive = isShopifyConfigured();



/* ── Toast ── */

function showToast(message: string, type: 'error' | 'info' = 'info'): void {

  const container = document.getElementById('toast-container');

  if (!container) return;



  const toast = document.createElement('div');

  toast.className = `toast toast--${type}`;

  toast.textContent = message;

  container.appendChild(toast);



  requestAnimationFrame(() => toast.classList.add('visible'));



  setTimeout(() => {

    toast.classList.remove('visible');

    setTimeout(() => toast.remove(), 300);

  }, 4000);

}



/* ── Shop mode banner ── */

function renderShopModeBanner(): void {

  const banner = document.getElementById('shop-mode-banner');

  if (!banner) return;



  if (shopifyLive) {

    banner.className = 'shop-mode-banner shop-mode-banner--live';

    banner.innerHTML =

      '<span class="shop-mode-dot"></span> Live shop — checkout powered by Shopify';

  } else {

    banner.className = 'shop-mode-banner shop-mode-banner--demo';

    banner.innerHTML =

      '<span class="shop-mode-dot"></span> Demo mode — add Shopify credentials to enable checkout';

  }

}



/* ── Products loading ── */

function showProductsLoading(): void {

  const grid = document.getElementById('products-grid');

  if (!grid) return;



  grid.innerHTML = Array.from({ length: 4 })

    .map(

      () => `

    <div class="product-skeleton" aria-hidden="true">

      <div class="skeleton-visual"></div>

      <div class="skeleton-body">

        <div class="skeleton-line skeleton-line--sm"></div>

        <div class="skeleton-line skeleton-line--lg"></div>

        <div class="skeleton-line"></div>

        <div class="skeleton-line"></div>

        <div class="skeleton-footer">

          <div class="skeleton-line skeleton-line--price"></div>

          <div class="skeleton-btn"></div>

        </div>

      </div>

    </div>

  `

    )

    .join('');

}



async function loadProducts(): Promise<Product[]> {

  if (!shopifyLive) return PRODUCTS;



  try {

    const products = await fetchProducts();

    if (products.length > 0) return products;

    showToast('No products found in Shopify. Showing demo catalog.', 'info');

  } catch (err) {

    const msg = err instanceof ShopifyError ? err.message : 'Could not reach Shopify';

    showToast(`${msg}. Showing demo catalog.`, 'error');

  }



  return PRODUCTS;

}



function renderProductVisual(p: Product): string {

  if (p.imageUrl) {

    return `<img class="product-image" src="${p.imageUrl}" alt="${p.name}" loading="lazy" />`;

  }

  return `

    <div class="product-lattice"></div>

    <span class="product-id">${p.name}</span>

  `;

}



/* ── Products ── */

function renderProducts(products: Product[]): void {

  activeProducts = products;

  chatAgent.setProductContext(products, shopifyLive);



  const grid = document.getElementById('products-grid');

  if (!grid) return;



  grid.innerHTML = products

    .map(

      (p) => `

    <article class="product-card" data-product="${p.id}">

      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}

      <div class="product-visual">

        ${renderProductVisual(p)}

      </div>

      <div class="product-info">

        <span class="product-category">${p.category}</span>

        <h3>${p.tagline}</h3>

        <p>${p.description}</p>

        <ul class="product-features">

          ${p.features.map((f) => `<li>${f}</li>`).join('')}

        </ul>

        <div class="product-footer">

          <span class="product-price">${p.price}</span>

          <button

            class="btn-primary product-buy"

            type="button"

            data-product-id="${p.id}"

            data-variant-id="${p.variantId ?? ''}"

            data-ask="${p.name}"

          >Buy Now</button>

        </div>

      </div>

    </article>

  `

    )

    .join('');



  grid.querySelectorAll('.product-buy').forEach((btn) => {

    btn.addEventListener('click', () => handleBuyClick(btn as HTMLButtonElement));

  });



  initReveal();

}



async function handleBuyClick(btn: HTMLButtonElement): Promise<void> {

  const variantId = btn.dataset.variantId;

  const ask = btn.dataset.ask ?? '';



  if (shopifyLive && variantId) {

    const originalText = btn.textContent ?? 'Buy Now';

    btn.disabled = true;

    btn.textContent = 'Adding...';



    try {

      const checkoutUrl = await createCheckout(variantId);

      window.location.href = checkoutUrl;

    } catch (err) {

      btn.disabled = false;

      btn.textContent = originalText;

      const msg = err instanceof ShopifyError ? err.message : 'Checkout failed. Please try again.';

      showToast(msg, 'error');

    }

    return;

  }



  openChat();

  chatAgent.send(`Tell me about ${ask}`);

}



/* ── Technology ── */

function renderTechnology(): void {

  const desc = document.getElementById('tech-desc');

  const benefits = document.getElementById('tech-benefits');

  if (desc) desc.textContent = TECHNOLOGY.description;

  if (benefits) {

    benefits.innerHTML = TECHNOLOGY.benefits

      .map(

        (b) => `

      <div class="tech-benefit">

        <div class="tech-benefit-icon">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">

            <polyline points="20 6 9 17 4 12"/>

          </svg>

        </div>

        <div>

          <h4>${b.title}</h4>

          <p>${b.desc}</p>

        </div>

      </div>

    `

      )

      .join('');

  }

}



/* ── Testimonials ── */

function renderTestimonials(): void {

  const grid = document.getElementById('testimonials-grid');

  if (!grid) return;



  grid.innerHTML = TESTIMONIALS.map(

    (t) => `

    <blockquote class="testimonial-card">

      <p class="testimonial-quote">"${t.quote}"</p>

      <footer>

        <div class="testimonial-avatar">${t.initials}</div>

        <div>

          <cite>${t.name}</cite>

          <span>${t.role}</span>

        </div>

      </footer>

    </blockquote>

  `

  ).join('');

}



/* ── Navigation ── */

function initNav(): void {

  const nav = document.getElementById('nav');

  const toggle = document.getElementById('nav-toggle');

  const menu = document.getElementById('mobile-menu');



  window.addEventListener('scroll', () => {

    nav?.classList.toggle('scrolled', window.scrollY > 40);

  });



  toggle?.addEventListener('click', () => {

    toggle.classList.toggle('open');

    menu?.classList.toggle('open');

  });



  menu?.querySelectorAll('a').forEach((link) => {

    link.addEventListener('click', () => {

      toggle?.classList.remove('open');

      menu?.classList.remove('open');

    });

  });

}



/* ── Chat Widget ── */

let chatOpen = false;



function openChat(): void {

  chatOpen = true;

  document.getElementById('chat-widget')?.classList.add('open');

  document.getElementById('chat-input')?.focus();

}



function closeChat(): void {

  chatOpen = false;

  document.getElementById('chat-widget')?.classList.remove('open');

}



function renderMessages(messages: ChatMessage[]): void {

  const container = document.getElementById('chat-messages');

  if (!container) return;



  container.innerHTML = messages

    .map(

      (m) => `

    <div class="chat-msg chat-msg--${m.role}">

      ${m.role === 'assistant' ? '<div class="chat-msg-avatar">W3</div>' : ''}

      <div class="chat-msg-bubble">${formatMessage(m.content)}</div>

    </div>

  `

    )

    .join('');



  if (chatAgent.isTyping()) {

    container.innerHTML += `

      <div class="chat-msg chat-msg--assistant">

        <div class="chat-msg-avatar">W3</div>

        <div class="chat-msg-bubble chat-typing">

          <span></span><span></span><span></span>

        </div>

      </div>`;

  }



  container.scrollTop = container.scrollHeight;

}



function formatMessage(text: string): string {

  return text

    .replace(/&/g, '&amp;')

    .replace(/</g, '&lt;')

    .replace(/>/g, '&gt;')

    .replace(/\n/g, '<br>');

}



function initChat(): void {

  const fab = document.getElementById('chat-fab');

  const minimize = document.getElementById('chat-minimize');

  const form = document.getElementById('chat-form') as HTMLFormElement;

  const input = document.getElementById('chat-input') as HTMLInputElement;

  const quickActions = document.getElementById('chat-quick-actions');



  fab?.addEventListener('click', () => (chatOpen ? closeChat() : openChat()));

  minimize?.addEventListener('click', closeChat);



  form?.addEventListener('submit', (e) => {

    e.preventDefault();

    const text = input.value;

    if (!text.trim()) return;

    input.value = '';

    chatAgent.send(text);

  });



  if (quickActions) {

    quickActions.innerHTML = CHAT_KNOWLEDGE.quickActions

      .map((action) => `<button type="button" class="quick-chip">${action}</button>`)

      .join('');



    quickActions.querySelectorAll('.quick-chip').forEach((chip) => {

      chip.addEventListener('click', () => {

        chatAgent.send(chip.textContent ?? '');

      });

    });

  }



  chatAgent.subscribe(renderMessages);



  const openChatButtons = [

    'open-chat-nav',

    'open-chat-mobile',

    'open-chat-hero',

    'open-chat-about',

    'open-chat-cta',

    'open-chat-footer',

  ];

  openChatButtons.forEach((id) => {

    document.getElementById(id)?.addEventListener('click', openChat);

  });

}



/* ── Scroll reveal ── */

function initReveal(): void {

  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add('visible');

        }

      });

    },

    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }

  );



  document

    .querySelectorAll('.product-card, .testimonial-card, .tech-benefit, .story-card, .cta-card')

    .forEach((el) => {

      el.classList.add('reveal');

      observer.observe(el);

    });

}



/* ── Smooth scroll for anchor links ── */

function initSmoothScroll(): void {

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener('click', (e) => {

      const href = (anchor as HTMLAnchorElement).getAttribute('href');

      if (!href || href === '#') return;

      const target = document.querySelector(href);

      if (target) {

        e.preventDefault();

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      }

    });

  });

}



/* ── Boot ── */

async function boot(): Promise<void> {

  renderShopModeBanner();

  renderTechnology();

  renderTestimonials();

  initNav();

  initChat();

  initSmoothScroll();



  if (shopifyLive) {

    showProductsLoading();

  }



  const products = await loadProducts();

  renderProducts(products);

}



boot();



export { activeProducts };


