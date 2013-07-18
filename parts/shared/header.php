
<header>
  <div id="navtainer">
    <a href="<?php echo home_url(); ?>">
      <img alt="hypothesis_logo" src="<?php echo get_template_directory_uri(); ?>/images/hypothelogo_light2.png">
    </a>
    <?php wp_nav_menu( array( 'sort_column' => 'menu_order', 'container' => 'false', 'menu_id' => 'navlist' ) ); ?>
  </div>
<!--   <?php get_search_form(); ?> -->
</header>
