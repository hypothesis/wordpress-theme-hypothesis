<?php
/**
 * Sage includes
 *
 * The $sage_includes array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 *
 * Please note that missing files will produce a fatal error.
 *
 * @link https://github.com/roots/sage/pull/1042
 */
$sage_includes = [
  'lib/utils.php',                 // Utility functions
  'lib/init.php',                  // Initial theme setup and constants
  'lib/wrapper.php',               // Theme wrapper class
  'lib/conditional-tag-check.php', // ConditionalTagCheck class
  'lib/config.php',                // Configuration
  'lib/assets.php',                // Scripts and stylesheets
  'lib/titles.php',                // Page titles
  'lib/nav.php',                   // Custom nav modifications
  'lib/gallery.php',               // Custom [gallery] modifications
  'lib/extras.php',                // Custom functions
  'templates/people.php',            // Team Section
  'templates/press.php',             // Press Section
  'templates/layout_shortcodes.php', // Hypothes.is Shortcodes
  'templates/loop_shortcodes.php',   // Hypothes.is Loop Shortcodes
];

foreach ($sage_includes as $file) {
  if (!$filepath = locate_template($file)) {
    trigger_error(sprintf(__('Error locating %s for inclusion', 'sage'), $file), E_USER_ERROR);
  }

  require_once $filepath;
}
unset($file, $filepath);

// https://wordpress.org/support/topic/excluding-category-from-widget
// Don't show certain categories in the categories widget.
function exclude_widget_categories($args){
  $exclude = "1,2,6,7,10"; // The IDs of the excluded categories
  $args["exclude"] = $exclude;
  return $args;
}
add_filter("widget_categories_args","exclude_widget_categories");
