// this is the entry point for code shared between
// the website and the blog, it sets up
// handlers for dropdown menus and other elements
// of site navigation

var DropdownMenuController = require('./hypothesis-shared/dropdown-menu');

window.addEventListener('DOMContentLoaded', function () {
  new DropdownMenuController(document.querySelector('header'));
});
