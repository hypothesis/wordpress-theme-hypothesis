<?php
/*
Template Name: Homepage
*/
// Add items to the header!
function add_homepage_styles() {
  echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/stylesheets/homepage.css" />';
}
add_filter('wp_head', 'add_homepage_styles', 30);

// Add items to the footer
function add_homepage_scripts() {
  echo '<script src="' . get_template_directory_uri() . '/js/homepage.js"></script>';
}
add_filter('wp_footer', 'add_homepage_scripts', 30);

// Remove auto insertion of whitespace in the content
// http://wordpress.org/support/topic/visual-page-editor-changes-to-html-view#post-1975331
remove_filter('the_content', 'wpautop');
?>

<?php get_template_parts( array( 'parts/shared/html-header' , 'parts/shared/header' ) ); ?>

<article>
  <?php if (have_posts()) while (have_posts()) : the_post(); ?>
    <?php the_content(); ?>
  <?php endwhile; ?>
</article>

<div class="bigspacer"></div>

<?php get_template_parts( array( 'parts/shared/footer' , 'parts/shared/html-footer' ) ); ?>
