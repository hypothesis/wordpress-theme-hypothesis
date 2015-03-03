(function () {

  function has(string) {
     var ua = navigator.userAgent.toLowerCase();
     return ua.indexOf(string.toLowerCase()) > -1;
  }

  function addListener(element, type, callback) {
    if (element.addEventListener) {
      element.addEventListener(type, callback, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, callback);
    }
  }

  function trackEvent(category, action, label, value) {
    if (typeof ga !== 'function') { return; }
    ga('send', 'event', category, action, label, value);
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
  addListener(window, 'hashchange', function onHashChange(event) {
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
  });

  function addBookmarkHint() {
    root.className += ' js-show-bookmark-hint';
  }

  function removeBookmarkHint() {
    root.className = root.className.replace(' js-show-bookmark-hint', '');
  }

  function trackBookmarkletInstall() {
    trackEvent('install', 'bookmarklet');
  }

  function trackChromeExtInstall() {
    trackEvent('install', 'chromeext');
  }

  function trackViaUse() {
    trackEvent('install', 'via');
  }

  function trackAddToSite() {
    trackEvent('install', 'addtosite');
  }

  if (!document.querySelectorAll) {
    return;
  }

  // Track bookmarklet installs
  var buttons = document.querySelectorAll('[data-bookmarklet-button]');
  [].forEach.call(buttons, function (button) {
    addListener(button, 'dragstart', trackBookmarkletInstall);
    addListener(button, 'contextmenu', trackBookmarkletInstall);
  });

  // Track Chrome extension button clicks
  var chromeButtons = document.querySelectorAll('[data-chromeext-button]');
  [].forEach.call(chromeButtons, function (button) {
    addListener(button, 'click', trackChromeExtInstall);
  });

  // Track use of via
  var viaButton = document.querySelectorAll('[data-via-button]');
  [].forEach.call(viaButton, function (button) {
    addListener(button, 'click', trackViaUse);
  });

  // Track click on "add to site."
  var addtositeButton = document.querySelectorAll('[data-addtosite-button]');
  [].forEach.call(addtositeButton, function (button) {
    addListener(button, 'click', trackAddToSite);
  });

})();
