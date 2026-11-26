document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("shop-products"),
    filters = document.getElementById("category-filters"),
    search = document.getElementById("product-search"),
    sort = document.getElementById("sort-products");
  const categories = ["All", "Perfumes", "Skincare", "Cosmetics", "Body Care"];
  let active = new URLSearchParams(location.search).get("category") || "All";
  if (!categories.includes(active)) active = "All";
  function renderFilters() {
    filters.innerHTML = categories
      .map(
        (c) =>
          `<button class="filter-chip ${active === c ? "active" : ""}" data-category="${c}">${c}</button>`
      )
      .join("");
    filters.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        active = b.dataset.category;
        renderFilters();
        render();
      })
    );
  }
  function render() {
    let list = PRODUCTS.filter(
      (p) =>
        (active === "All" || p.category === active) &&
        `${p.name} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(search.value.toLowerCase())
    );
    if (sort.value === "low") list.sort((a, b) => a.price - b.price);
    if (sort.value === "high") list.sort((a, b) => b.price - a.price);
    document.getElementById("result-count").textContent =
      `Showing ${list.length} product${list.length === 1 ? "" : "s"}`;
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `
        <div class="empty-state">
          <h3>No products found</h3>
          <p>Try another search or category.</p>
        </div>`;
  }
  renderFilters();
  render();
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
});
