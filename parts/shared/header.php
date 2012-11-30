
<header>
  <div id="navtainer">
    <a href="http://hypothes.is">
      <img alt="hypothesis_logo" src="images/hypothelogo_light2.png">
    </a>
    <?php wp_nav_menu( array( 'sort_column' => 'menu_order', 'container' => 'false', 'menu_id' => 'navlist' ) ); ?>
  </div>
  <?php get_search_form(); ?>
</header>
