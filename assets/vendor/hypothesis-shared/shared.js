/* jshint ignore:start */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * A simple drop-down menu controller.
 *
 * All elements within 'rootElement' with the class 'js-menu-toggle'
 * become dropdown menu toggles that toggle their closest sibling
 * element with a 'js-menu' class, or the first element within
 * 'rootElement' that matches the selector set by 'data-menu-target'
 * on the toggle element.
 */
function DropdownMenuController(rootElement) {
  var menuToggles = rootElement.querySelectorAll('.js-menu-toggle');

  function setupMenu(menuToggle) {
    menuToggle.addEventListener('click', function (openEvent) {
      openEvent.preventDefault();

      var dropdown = menuToggle;
      if (menuToggle.dataset.menuTarget) {
        dropdown = rootElement.querySelector(menuToggle.dataset.menuTarget);
      } else {
        dropdown = dropdown.parentElement.querySelector('.js-menu');
      }
      if (!dropdown) {
        throw new Error('Associated menu not found');
      }

      var isOpen = dropdown.classList.toggle('is-open');
      if (isOpen) {
        document.addEventListener('click', function listener(event) {
          if (menuToggle.contains(event.target) || dropdown.contains(event.target)) {
            return;
          }
          dropdown.classList.remove('is-open');
          document.removeEventListener('click', listener);
        });
      }
    });
  }

  for (var i=0; i < menuToggles.length; i++) {
    setupMenu(menuToggles[i]);
  }
}

module.exports = DropdownMenuController;

},{}],2:[function(require,module,exports){
// this is the entry point for code shared between
// the website and the blog, it sets up
// handlers for dropdown menus and other elements
// of site navigation

var DropdownMenuController = require('./hypothesis-shared/dropdown-menu');

window.addEventListener('DOMContentLoaded', function () {
  new DropdownMenuController(document.querySelector('header'));
});

},{"./hypothesis-shared/dropdown-menu":1}]},{},[2]);
