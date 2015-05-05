<footer class="content-info" role="contentinfo">
  <div class="container">
    <nav class="navbar navbar-default" role="navigation">
      <!-- Social Media -->
      <div class="nav navbar-nav social-media pull-right">
        <a href="https://github.com/hypothesis"><i class="fa fa-github"></i></a>
        <a href="https://twitter.com/hypothes_is"><i class="fa fa-twitter"></i></a>
        <a href="http://hypothes.is/feed/"><i class="fa fa-rss"></i></a>
      </div>
      <!-- / Social Media -->
      <?php
      if (has_nav_menu('secondary_navigation')) :
        wp_nav_menu(['theme_location' => 'secondary_navigation', 'menu_class' => 'nav navbar-nav']);
      endif;
      ?>
    </nav>
  </div>
</footer>
