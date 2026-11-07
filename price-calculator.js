(function () {
  const data = window.PRICE_DATA || { tables: {}, items: [] };
  const categorySelect = document.getElementById("calcCategory");
  const serviceSelect = document.getElementById("calcService");
  const qtyInput = document.getElementById("calcQty");
  const addButton = document.getElementById("addCalcItem");
  const linesEl = document.getElementById("calcLines");
  const totalEl = document.getElementById("calcTotal");
  const tabsEl = document.getElementById("priceTabs");
  const cart = [];

  const money = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "RUB",
  });

  function formatMoney(value) {
    return money.format(value).replace("RUB", "₽");
  }

  function currentPrice(item, qty) {
    return item.prices
      .slice()
      .sort((a, b) => a.minQty - b.minQty)
      .reduce((best, price) => (qty >= price.minQty ? price : best), item.prices[0]);
  }

  function fillCategories() {
    const categories = [...new Set(data.items.map((item) => item.category))];
    categorySelect.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
    fillServices();
  }

  function fillServices() {
    const category = categorySelect.value;
    const options = data.items
      .filter((item) => item.category === category)
      .map((item) => `<option value="${item.id}">${item.name}</option>`);
    serviceSelect.innerHTML = options.join("");
  }

  function renderCart() {
    if (!cart.length) {
      linesEl.innerHTML = '<div class="calc-line"><div>Выберите услугу и количество</div></div>';
      totalEl.textContent = formatMoney(0);
      return;
    }

    let total = 0;
    linesEl.innerHTML = cart
      .map((line, index) => {
        const lineTotal = line.qty * line.price.price;
        total += lineTotal;
        return `<div class="calc-line">
          <div>
            <strong>${line.item.name}</strong>
            <small>${line.qty} ${line.item.unit} × ${formatMoney(line.price.price)} · ${line.price.label}</small>
          </div>
          <div>
            <strong>${formatMoney(lineTotal)}</strong>
            <button type="button" data-remove="${index}" aria-label="Удалить">×</button>
          </div>
        </div>`;
      })
      .join("");
    totalEl.textContent = formatMoney(total);
  }

  function addLine() {
    const item = data.items.find((entry) => entry.id === serviceSelect.value);
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    if (!item) return;
    cart.push({ item, qty, price: currentPrice(item, qty) });
    renderCart();
  }

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = Object.keys(data.tables)
      .map((sheet) => `<a href="#${sheet}">${sheet}</a>`)
      .join("");
  }

  categorySelect.addEventListener("change", fillServices);
  addButton.addEventListener("click", addLine);
  linesEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    cart.splice(Number(button.dataset.remove), 1);
    renderCart();
  });

  fillCategories();
  renderTabs();
  renderCart();
})();
