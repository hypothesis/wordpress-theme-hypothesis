(function () {
  function has(string) {
     var ua = navigator.userAgent.toLowerCase();
     return ua.indexOf(string.toLowerCase()) > -1;
  }

  // Add class to the document for the current browser.
  var detect = {
    safari: has('Safari') && !has('Chrome') && !has('Chromium'),
    chrome: has('Chrome') || has('Chromium'),
    firefox: has('Firefox') && !has('Seamonkey'),
    ie: has('MSIE') || has('Trident'),
    opera: has('Opera') || has('OPR')
  };

  var root = document.documentElement;
  var className = root.className;
  var browser;

  for (browser in detect) {
    if (detect.hasOwnProperty(browser) && detect[browser] === true) {
      root.className = className + ' nav-browser-' + browser;
      break;
    }
  }

  // Update the installation panel when the hash changes.
  window.onhashchange = (function onHashChange(event) {
    var hash = location.hash.slice(1);
    if (detect.hasOwnProperty(hash)) {
      root.className = className + ' nav-browser-' + hash;
    }

    if (hash === 'install') {
      root.className = className + ' nav-install';
    }

    if (event) {
      event.preventDefault();
    }

    return onHashChange;
  })();

  if (!document.querySelectorAll) {
    return;
  }

  // Show the bookmarklet hint when dragging.
  var buttons = document.querySelectorAll('[data-bookmarklet-button]');
  [].forEach.call(buttons, function (button) {
    button.onmouseenter = button.onfocus = function () {
      root.className += ' js-show-bookmark-hint';
    };
    button.onmouseleave = button.onblur = function () {
      root.className = root.className.replace(' js-show-bookmark-hint', '');
    };
  });
})();
