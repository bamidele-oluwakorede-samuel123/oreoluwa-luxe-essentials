document.addEventListener("DOMContentLoaded", renderOrder);
function renderOrder() {
  const target = document.getElementById("order-content"),
    cart = getCart();
  const valid = cart
    .map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.id) }))
    .filter((i) => i.product);
  if (!valid.length) {
    target.innerHTML = `
      <div class="empty-state">
        <h2>Your bag is empty</h2>
        <p>Add products before placing an order.</p>
        <a class="btn btn-dark" href="shop.html">Go to shop</a>
      </div>`;
    return;
  }
  const subtotal = valid.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const orderProducts = valid
    .map(
      (i) => `
        <div class="order-product">
          <img src="${i.product.image}" alt="">
          <div>
            <strong>${i.product.name}</strong>
            <span>Qty: ${i.quantity}</span>
          </div>
          <b>${money(i.product.price * i.quantity)}</b>
        </div>`
    )
    .join("");
  target.innerHTML = `
    <div class="checkout-layout">
      <form class="checkout-form" id="checkout-form">
        <h2>Your details</h2>
        <p class="muted">We will use these details to continue your order conversation.</p>
        <label>Full name<input name="name" required placeholder="Your full name"></label>
        <label>WhatsApp phone number<input name="phone" type="tel" required placeholder="e.g. 08012345678"></label>
        <label>Delivery address<textarea name="address" rows="3" required placeholder="Enter your delivery address"></textarea></label>
        <label>Additional note <span class="muted">(optional)</span><textarea name="note" rows="3" placeholder="Preferred delivery time, product questions, etc."></textarea></label>
        <button class="btn btn-dark full-btn" type="submit">Send order to WhatsApp ↗</button>
        <p class="form-footnote">This does not process payment. You will confirm availability, delivery and payment directly with the seller on WhatsApp.</p>
      </form>
      <aside class="summary-card checkout-summary">
        <h2>Your order</h2>
        ${orderProducts}
        <div class="summary-line total-line">
          <span>Subtotal</span>
          <strong>${money(subtotal)}</strong>
        </div>
        <p class="muted summary-hint">Delivery fee will be agreed on WhatsApp.</p>
        <a class="continue-link" href="cart.html">← Edit your bag</a>
      </aside>
    </div>`;
  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = valid.map(
      (i) => `• ${i.product.name} x${i.quantity} = ${money(i.product.price * i.quantity)}`
    );
    const message = [
      `Hello Oreoluwa LUXE ESSENCE! I'd like to place an order.\n\n`,
      `CUSTOMER DETAILS\n`,
      `Name: ${data.get("name")}\n`,
      `Phone: ${data.get("phone")}\n`,
      `Delivery address: ${data.get("address")}\n`,
      `Additional note: ${data.get("note") || "None"}\n\n`,
      `ORDER ITEMS\n`,
      `${lines.join("\n")}\n\n`,
      `Subtotal: ${money(subtotal)}\n`,
      `Delivery fee: To be confirmed\n\n`,
      `Please confirm availability, delivery fee and payment details. Thank you.`,
    ].join("");
    whatsappOrder(message);
  });
}
