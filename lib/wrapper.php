<?php
/**
 * Theme wrapper
 *
 * @link http://roots.io/an-introduction-to-the-roots-theme-wrapper/
 * @link http://scribu.net/wordpress/theme-wrappers.html
 */
function roots_template_path() {
  return Roots_Wrapping::$main_template;
}

function roots_sidebar_path() {
  return new Roots_Wrapping('templates/sidebar.php');
}

class Roots_Wrapping {
  // Stores the full path to the main template file
  public static $main_template;

  // basename of template file
  public $slug;

  // array of templates
  public $templates;

  // Stores the base name of the template file; e.g. 'page' for 'page.php' etc.
  static $base;

  public function __construct($template = 'base.php') {
    $this->slug = basename($template, '.php');
    $this->templates = array($template);

    if (self::$base) {
      $str = substr($template, 0, -4);
      array_unshift($this->templates, sprintf($str . '-%s.php', self::$base));
    }
  }

  public function __toString() {
    $this->templates = apply_filters('roots/wrap_' . $this->slug, $this->templates);
    return locate_template($this->templates);
  }

  static function wrap($main) {
    // Check for other filters returning null
    if (!is_string($main)) {
      return $main;
    }

    self::$main_template = $main;
    self::$base = basename(self::$main_template, '.php');

    if (self::$base === 'index') {
      self::$base = false;
    }

    return new Roots_Wrapping();
  }
}
add_filter('template_include', array('Roots_Wrapping', 'wrap'), 99);
