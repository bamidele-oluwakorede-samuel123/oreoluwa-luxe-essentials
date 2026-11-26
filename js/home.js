document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("featured-products");
  if (target) target.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
});