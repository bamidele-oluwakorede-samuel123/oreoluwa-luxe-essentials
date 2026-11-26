document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id"),
    p = PRODUCTS.find((item) => item.id === id),
    target = document.getElementById("product-detail");
  if (!p) {
    target.innerHTML = `
      <div class="empty-state">
        <h2>Product not found</h2>
        <a class="btn btn-dark" href="shop.html">Back to shop</a>
      </div>`;
    return;
  }
  document.title = `${p.name} | Oreoluwa LUXE ESSENCE`;
  target.innerHTML = `
    <section class="detail-layout">
      <div class="detail-photo">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="detail-copy">
        <span class="eyebrow">${p.category}</span>
        <h1>${p.name}</h1>
        <div class="detail-price">${money(p.price)}</div>
        <p>${p.description}</p>
        <p class="muted small-note">Product details and availability can be confirmed with us on WhatsApp.</p>
        <div class="detail-actions">
          <label class="quantity-control">Qty <input type="number" id="detail-qty" min="1" max="99" value="1"></label>
          <button class="btn btn-dark" id="detail-add">Add to bag</button>
        </div>
        <div class="detail-note">
          <span>✦</span>
          <div>
            <strong>Need a little help?</strong>
            <p>Send us a message if you have questions about this product.</p>
          </div>
        </div>
        <a class="text-link" href="shop.html">← Continue shopping</a>
      </div>
    </section>`;
  document.getElementById("detail-add").addEventListener("click", () => {
    const qty = Math.max(1, Math.min(99, Number(document.getElementById("detail-qty").value) || 1));
    addToCart(p.id, qty);
  });
});
