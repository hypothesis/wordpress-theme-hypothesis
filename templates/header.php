<header class="banner navbar navbar-default navbar-static-top hypo-nav" role="banner">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>">Hypothes<span class="primary-color">.</span>is</a>
    </div>

    <nav class="collapse navbar-collapse" role="navigation">
      <?php
        if (has_nav_menu('primary_navigation')) :
          wp_nav_menu(array('theme_location' => 'primary_navigation', 'walker' => new Roots_Nav_Walker(), 'menu_class' => 'nav navbar-nav'));
        endif;
      ?>

      <!-- Social Media -->
      <div class="hypo-social-media pull-right">
          <a href="https://github.com/hypothesis"><i class="fa fa-github"></i></a>
          <a href="https://twitter.com/hypothes_is"><i class="fa fa-twitter"></i></a>
          <a href="http://hypothes.is/feed/"><i class="fa fa-rss"></i></a>
      </div>

    </nav>
  </div>
</header>
