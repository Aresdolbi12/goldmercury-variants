// ?s=closed renders the off-season hero; days left count to the next 15 March close of intake
(function () {
  var s = new URLSearchParams(location.search).get('s');
  document.documentElement.dataset.season = s === 'closed' ? 'closed' : 'open';
  var now = new Date(), close = new Date(now.getFullYear(), 2, 15, 23, 59);
  if (close < now) close = new Date(now.getFullYear() + 1, 2, 15, 23, 59);
  var days = Math.ceil((close - now) / 864e5);
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-days]').forEach(function (el) { el.textContent = days; });
  });
})();
