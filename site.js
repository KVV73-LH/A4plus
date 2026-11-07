(function () {
  document.querySelectorAll('a[href="#+79313950551"]').forEach((link) => {
    link.setAttribute("href", "tel:+79313950551");
  });

  document.querySelectorAll('a[href^="#https://"]').forEach((link) => {
    link.setAttribute("href", link.getAttribute("href").slice(1));
  });
})();
