(function () {
  function init() {
    var menu = document.querySelector('menu');
    if (!menu) return;

    var btn = document.createElement('button');
    btn.className = 'menu-toggle';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    menu.insertBefore(btn, menu.firstChild);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('menu-open');
      btn.classList.toggle('menu-toggle--open', open);
    });

    // Touch: Resources dropdown toggle
    var lists = menu.querySelectorAll('.menu li .list');
    lists.forEach(function (list) {
      var parentLink = list.parentNode.querySelector('a');
      if (parentLink) {
        parentLink.addEventListener('click', function (e) {
          if (window.innerWidth <= 640) {
            e.preventDefault();
            list.classList.toggle('list--open');
          }
        });
      }
    });

    // Close on outside click
    document.addEventListener('click', function () {
      menu.classList.remove('menu-open');
      btn.classList.remove('menu-toggle--open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
