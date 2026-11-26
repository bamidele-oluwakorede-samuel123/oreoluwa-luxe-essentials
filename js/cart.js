document.addEventListener("DOMContentLoaded", renderCart);
function renderCart() {
  const target = document.getElementById("cart-content"),
    cart = getCart();
  if (!cart.length) {
    target.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">♡</div>
        <h2>Your bag is waiting for something lovely.</h2>
        <p>You have not added any products yet.</p>
        <a class="btn btn-dark" href="shop.html">Explore the shop</a>
      </div>`;
    return;
  }
  let subtotal = 0;
  const rows = cart
    .map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      if (!p) return "";
      subtotal += p.price * item.quantity;
      return `
        <article class="cart-row">
          <a class="cart-thumb" href="product.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}">
          </a>
          <div class="cart-item-info">
            <span class="product-category">${p.category}</span>
            <a class="product-name" href="product.html?id=${p.id}">${p.name}</a>
            <strong>${money(p.price)}</strong>
            <button class="remove-link" data-remove="${p.id}">Remove</button>
          </div>
          <div class="cart-quantity">
            <button data-change="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-change="${p.id}" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
          <strong class="cart-line-total">${money(p.price * item.quantity)}</strong>
        </article>`;
    })
    .join("");
  target.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">${rows}</div>
      <aside class="summary-card">
        <h2>Order summary</h2>
        <div class="summary-line">
          <span>Subtotal</span>
          <strong>${money(subtotal)}</strong>
        </div>
        <div class="summary-line">
          <span>Delivery</span>
          <span>To be confirmed</span>
        </div>
        <div class="summary-line total-line">
          <span>Estimated total</span>
          <strong>${money(subtotal)}</strong>
        </div>
        <p class="muted summary-hint">Delivery fees and final availability will be confirmed with you on WhatsApp.</p>
        <a class="btn btn-dark full-btn" href="order.html">Continue to order</a>
        <a class="continue-link" href="shop.html">Continue shopping</a>
      </aside>
    </div>`;
  target.querySelectorAll("[data-change]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const c = getCart(),
        item = c.find((x) => x.id === btn.dataset.change);
      if (item)
        item.quantity = Math.max(1, Math.min(99, item.quantity + Number(btn.dataset.delta)));
      saveCart(c);
      renderCart();
    })
  );
  target.querySelectorAll("[data-remove]").forEach((btn) =>
    btn.addEventListener("click", () => {
      saveCart(getCart().filter((x) => x.id !== btn.dataset.remove));
      renderCart();
    })
  );
}
