/* Change the WhatsApp number in this file. Use country code, no +, spaces or dashes.
   Example for Nigeria: 2348012345678 */
const WHATSAPP_NUMBER = "2349130277523"; // REPLACE WITH THE BUSINESS WHATSAPP NUMBER
const CART_KEY = "OreoluwaLUXEESSENCECart";
const money = (amount) => "₦" + Number(amount || 0).toLocaleString("en-NG");
// Reads the saved cart. Ignores damaged data and products that no longer exist.
const getCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((i) => i && PRODUCTS.some((p) => p.id === i.id))
      .map((i) => ({
        id: i.id,
        quantity: Math.max(1, Math.min(99, Math.floor(Number(i.quantity)) || 1)),
      }));
  } catch {
    return [];
  }
};
// Saving can fail in private browsing or when storage is full, so never let it crash the page.
const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    showToast("Your bag could not be saved in this browser");
  }
  updateCartCount();
};
const cartCount = () => getCart().reduce((sum, item) => sum + item.quantity, 0);
function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = cartCount()));
}
function addToCart(id, quantity = 1) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  const cart = getCart(),
    existing = cart.find((i) => i.id === id);
  if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
  else cart.push({ id, quantity });
  saveCart(cart);
  showToast(`${product.name} added to your bag`);
}
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function productCard(p) {
  return `
    <article class="product-card">
      <a class="product-photo" href="product.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
      </a>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="product-name">${p.name}</a>
        <div class="product-bottom">
          <strong>${money(p.price)}</strong>
          <button class="add-small" onclick="addToCart('${p.id}')" aria-label="Add ${p.name} to cart">+</button>
        </div>
      </div>
    </article>`;
}
function renderShell() {
  const header = document.getElementById("site-header"),
    footer = document.getElementById("site-footer");
  if (header)
    header.innerHTML = `
      <div class="announcement">A little beauty, delivered with care <span>✦</span></div>
      <header class="site-header">
        <a class="brand" href="index.html">
          <span class="brand-script">Oreoluwa</span>
          <span class="brand-sub">LUXE ESSENCE</span>
        </a>
        <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
        <nav class="main-nav" id="main-nav">
          <a href="index.html">Home</a>
          <a href="shop.html">Shop</a>
          <a href="index.html#our-story">Our story</a>
        </nav>
        <a class="cart-link" href="cart.html" aria-label="Shopping bag">Add to Cart <span data-cart-count>0</span> <b>↗</b></a>
      </header>`;
  if (footer)
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="footer-top">
          <div>
            <a class="brand footer-brand" href="index.html">
              <span class="brand-script">Oreoluwa</span>
              <span class="brand-sub">LUXE ESSENCE</span>
            </a>
            <p>Beauty, thoughtfully chosen.</p>
          </div>
          <div>
            <strong>Explore</strong>
            <a href="shop.html">Shop all</a>
            <a href="shop.html?category=Perfumes">Perfumes</a>
            <a href="shop.html?category=Skincare">Skincare</a>
          </div>
          <div>
            <strong>Need help?</strong>
            <a href="cart.html">Your bag</a>
            <a href="order.html">Place an order</a>
            <a href="#" onclick="contactWhatsApp();return false">Chat on WhatsApp</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Oreoluwa LUXE ESSENCE. All rights reserved.</span>
          <span>Made for your everyday glow.</span>
        </div>
      </footer>`;
  const toggle = document.getElementById("menu-toggle");
  if (toggle)
    toggle.addEventListener("click", () => {
      const open = document.getElementById("main-nav").classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  updateCartCount();
}
function contactWhatsApp() {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number === "2349130277523") {
    showToast("Add your real WhatsApp number in js/site.js first");
    return;
  }
  window.open(
    `https://wa.me/${number}?text=${encodeURIComponent("Hello Oreoluwa LUXE ESSENCE, I would like to make an enquiry.")}`,
    "_blank"
  );
}
function whatsappOrder(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number === "2348012345678") {
    showToast("Add the business WhatsApp number in js/site.js first");
    return;
  }
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
}
// If a product or category photo fails to load, hide the broken-image icon and show the tile colour.
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") e.target.classList.add("img-failed");
  },
  true
);
document.addEventListener("DOMContentLoaded", renderShell);
// Catch photos that already failed before this script ran.
window.addEventListener("load", () => {
  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) img.classList.add("img-failed");
  });
});
