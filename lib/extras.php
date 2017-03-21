<?php

namespace Roots\Sage\Extras;

use Roots\Sage\Config;

/**
 * Add <body> classes
 */
function body_class($classes) {
  // Add page slug if it doesn't exist
  if (is_single() || is_page() && !is_front_page()) {
    if (!in_array(basename(get_permalink()), $classes)) {
      $classes[] = basename(get_permalink());
    }
  }

  // Add class if sidebar is active
  if (Config\display_sidebar()) {
    $classes[] = 'sidebar-primary';
  }

  return $classes;
}
add_filter('body_class', __NAMESPACE__ . '\\body_class');

/**
 * Clean up the_excerpt()
 */

// Display read more link when there is an automatically entered excerpt
function excerpt_more() {
  return ' &hellip; <a href="' . get_permalink() . '">' . __('Continued', 'sage') . '</a>';
}
add_filter('excerpt_more', __NAMESPACE__ . '\\excerpt_more');

// Display read more link when there is a manually entered excerpt
function excerpt_read_more($excerpt) {
  if (has_excerpt() && !is_attachment()) {
    $excerpt .= ' &hellip; <a href="' . get_permalink() . '">' . __('Continued', 'sage') . '</a>';
  }
    return $excerpt;
}
add_filter('get_the_excerpt', __NAMESPACE__ . '\\excerpt_read_more');
